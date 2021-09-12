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
   house: ""
};

let firstName;
let middleName;
let lastName;
let nickName;
let image;
let house;

function start(){
    console.log("DOM is loaded");
    loadJSON();
    addEventListeners();
}

function addEventListeners(){
    document.querySelector("#filter").addEventListener("change", selectFilter);
}

// Load json
async function loadJSON(){
    const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await respons.json();

    // When loaded, prepare data objects
    prepareObjects(jsonData);
}

// Prepare data objects
function prepareObjects(jsonData){
    allStudents = jsonData.map(preapareObject);
    displayList(allStudents);
}

function preapareObject(jsonData){
    const student = Object.create(Student);

    student.firstName = getFirstName(jsonData.fullname);
    student.lastName = getLastName(jsonData.fullname);
    student.middleName = getMidddelName(jsonData.fullname);
    student.nickName = getNickName(jsonData.fullname);
    student.image = getImage(jsonData.fullname);
    student.house = jsonData.house.trim();
    student.house = student.house.substring(0,1).toUpperCase() + student.house.substring(1).toLowerCase();
    
    return student;
}

// Get firstname
function getFirstName(fullname){
    firstName = fullname.trim();
    if (fullname.includes(" ")) {
        firstName = firstName.substring(0, firstName.indexOf(" "));
        firstName = firstName.substring(0,1).toUpperCase() + firstName.substring(1).toLowerCase();
    } else {
        firstName = firstName;
    }
    return firstName;
}

function getLastName(fullname){
    lastName = fullname.trim();
    lastName = lastName.substring(lastName.lastIndexOf(" ")+1);
    lastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
    return lastName;
}

function getMidddelName(fullname){
    middleName = fullname.trim();
    middleName = middleName.split(" ");
    if (middleName.length > 2){
        middleName = middleName[1].toString();
        middleName = middleName.substring(0,1).toUpperCase() + middleName.substring(1).toLowerCase();
    } else{
        middleName = undefined;
    }
    return middleName;
}

function getNickName(fullname){
    // console.log("Nickname is:", nickName);
    nickName = fullname.trim();
    nickName = nickName.split(" ");
    // if (nickName.includes('"')){
    //     nickName = nickName[1].toString();
    //     console.log(nickName[1]);
    //     nickName = nickName.substring(0,1).toUpperCase() + nickName.substring(1).toLowerCase();
    // } else {
    //     nickName = undefined;
    // }
 return nickName;
}

// function getHouse(element.house){
//     console.log("House is:", house);
//     house = element.house.trim();
//     house = house.substring(0,1).toUpperCase() + house.substring(1).toLowerCase();
// }

 function getImage(fullname){
     image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
     return image;
 }

 // Filtering
function selectFilter(event){
    const selectedFilter = event.target.value;
    console.log(selectedFilter);
    filterList(selectedFilter);
}

function filterList(filterBy){
    let filteredList = allStudents;

    if (filterBy === "gryffindor"){
        filteredList = allStudents.filter(isGryffindor);
    } else {

    }
    displayList(filteredList);
}

function isGryffindor(student){
    console.log("hello gryffindor");
    return student.house === "gryffindor";
}

// Displaying filtered list
function displayList(student){
    //clear the list
    document.querySelector("#students").innerHTML = "";
    //build new list
    student.forEach(displayStudent(student));
}

function displayList(students){
    console.log("Hello there");
    // Clear the list 
    document.querySelector("#students").innerHTML = "";

    // Build a new list
    students.forEach(displayStudent);
}

function displayStudent(student){
    console.log("Hello again");
    // Create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);
   
    //Set clone data
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    //Make clickable to see more details
    clone.querySelector(".studentinfo").addEventListener("click", () => showDetails(student));

    //Append clone to list
    document.querySelector("#students").appendChild(clone);
}

function showDetails(student){
    const clone = document.querySelector("#info").cloneNode(true).content;
    popup.textContent="";
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstName}`;
    clone.querySelector("[data-field=middelname]").textContent = `Middelname: ${student.middelName}`;
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