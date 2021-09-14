"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

// Prototype for all students
let Student = {
   firstName: "",
   lastName: "",
   middleName: "",
   nickName: "",
   image: "",
   house: "",
   expelled: false
};

const settings = {
    filter: "all",
    sortBy: "house"
}

function start(){
    console.log("DOM is loaded");
    loadJSON();
    addEventListeners();
}

function addEventListeners(){
    document.querySelectorAll("[data-action='filter']").forEach(button => {
        button.addEventListener("click", selectFilter);
    })
    document.querySelectorAll("[data-action='sort']").forEach(button => {
        button.addEventListener("click", selectSorting);
    })

}

// Load json
async function loadJSON(){
    const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await respons.json();

    // When loaded, prepare data objects
    prepareObjects(jsonData);
}

// Prepare data objects
function prepareObjects(students){
    students.forEach(element => {
        const student = Object.create(Student);
    
        student.firstName = getFirstName(element.fullname);
        student.lastName = getLastName(element.fullname);
        student.middleName = getMidddelName(element.fullname);
        student.nickName = getNickName(element.fullname);
        student.image = getImage(student.firstName, student.lastName);
        student.house = getHouse(element.house); 
        allStudents.push(student);
    });
    displayList(allStudents);
}

// Get firstname
function getFirstName(fullname){
    let firstName = fullname.trim();
    if (fullname.includes(" ")) {
        firstName = firstName.substring(0, firstName.indexOf(" "));
        firstName = firstName.substring(0,1).toUpperCase() + firstName.substring(1).toLowerCase();
    } else {
        firstName = firstName;
    }
    return firstName;
}

function getLastName(fullname){
    let lastName = fullname.trim();
    lastName = lastName.substring(lastName.lastIndexOf(" ")+1);
    lastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
    if (fullname.includes("-")){
        let lastNames = lastName.split("-");
        lastNames[1] = lastNames[1].substring(0,1).toUpperCase() + lastNames[1].substring(1).toLowerCase();
        lastName = lastNames.join('-');
    }
    return lastName;
}

function getMidddelName(fullname){
    let middleName = fullname.trim();
    middleName = middleName.split(" ");
    if (fullname.includes(' "')) {
        middleName = ""; 
    } else if (middleName.length > 2) {
        middleName = middleName[1];
        middleName = middleName.substring(0,1).toUpperCase() + middleName.substring(1).toLowerCase();
    } else{
        middleName = "";
    }
    return middleName;
}

function getNickName(fullname){
    let nickName = fullname.trim();
    nickName = nickName.split(" ");
    if (fullname.includes(' "')){
        nickName = nickName[1];
    } else {
        nickName = "";
    }
 return nickName;
}

function getHouse(house){
    house = house.trim();
    house = house.substring(0,1).toUpperCase() + house.substring(1).toLowerCase();
    return house;
}

 function getImage(firstName, lastName){
    let image;
    if (lastName === 'Patil') {
        image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
      } else if (firstName === 'Leanne') {
        image = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      } else if (firstName === 'Justin') {
          lastName = lastName.split("-");
          image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
      else {
        image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
     return image;
 }

 // Filtering
function selectFilter(event){
    const filter = event.target.dataset.filter;
    setFilter(filter);
}

function setFilter(filter){
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList){

    if (settings.filterBy === "gryffindor"){
        filteredList = allStudents.filter(isGryffindor);
    } else if (settings.filterBy === "hufflepuff"){
        filteredList = allStudents.filter(isHufflepuff);
    } else if (settings.filterBy === "ravenclaw"){
        filteredList = allStudents.filter(isRavenclaw);
    } else if (settings.filterBy === "slytherin"){
        filteredList = allStudents.filter(isSlytherin);
    }
    return filteredList;
}

function isGryffindor(student){
    return student.house === "Gryffindor";
}

function isHufflepuff(student){
    return student.house === "Hufflepuff";
}

function isRavenclaw(student){
    return student.house === "Ravenclaw";
}

function isSlytherin(student){
    return student.house === "Slytherin";
}

// Sorting 

function selectSorting(event){
    const sortBy = event.target.dataset.sort;
    setSort(sortBy);
}

function setSort(sortBy){
    settings.sortBy = sortBy;
    buildList();
}

function sortList(sortedList){
    sortedList.sort(sortByProperty);
    
    function sortByProperty(nameA, nameB){
        if (nameA[settings.sortBy] < nameB[settings.sortBy]){
            return -1;
        } else {
            return 1;
        }
    }
    return sortedList;
}

function buildList(){
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

// Displaying filtered list
function displayList(students){
    // Clear the list 
    document.querySelector("#students").innerHTML = "";

    // Build a new list
    students.forEach(displayStudent);
}

function displayStudent(student){
    // Create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);
   
    //Set clone data
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    //Make clickable to see more details
    clone.querySelector(".studentinfo").addEventListener("click", () => showDetails(student));

    //Expell student
    clone.querySelector(".expell").addEventListener("click", () => expellOrUnExpell(expell, student));

    //Append clone to list
    document.querySelector("#students").appendChild(clone);
}

function showDetails(student){
    const clone = document.querySelector("#info").cloneNode(true).content;
    popup.textContent="";
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstName}`;
    clone.querySelector("[data-field=middelname]").textContent = `Middelname: ${student.middleName}`;
    clone.querySelector("[data-field=nickname]").textContent = `Nickname: ${student.nickName}`;
    clone.querySelector("[data-field=lastname]").textContent = `Lastname: ${student.lastName}`;
    clone.querySelector("[data-field=bloodstatus]").textContent = `Blood status:`;
    clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
    popup.classList.add('active');
    overlay.classList.add('active');
    clone.querySelector("#close").addEventListener("click", closeDetails);
    popup.appendChild(clone);
}

function closeDetails(){
    popup.classList.remove('active');
    overlay.classList.remove('active');
}

function expell(student){
    return student.expelled = true;
}

function unExpell(student){
    return student.expelled = false;
}

function expellOrUnExpell(action, student){
    action(student);
}


// function hire(person){
//     person.hired = true;
// }

// function fire(person){
//     person.hired = false;
// }

// function hireOrFire(action, person){
//     action(person);
// }