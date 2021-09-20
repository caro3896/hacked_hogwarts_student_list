"use strict";

window.addEventListener("DOMContentLoaded", start);

// Array for all students
let allStudents = [];

// Prototype for a student and what it contains
let Student = {
   firstName: "",
   lastName: "",
   middleName: "",
   nickName: "",
   image: "",
   house: "",
   bloodStatus: "",
   expelled: false,
   prefect: false,
   squad: false
};

// Global variables for filtering and sorting
const settings = {
    filter: "all",
    sortBy: "firstName"
}

// If DOM is loaded load JSON and listen for click
function start(){
    console.log("DOM is loaded");
    loadJSON();
    addEventListeners();
}

// Listen for click on filtering and sorting
function addEventListeners(){
    document.querySelectorAll("[data-action='filter']").forEach(button => {
        button.addEventListener("click", selectFilter);
    })
    document.querySelectorAll("[data-action='sort']").forEach(button => {
        button.addEventListener("click", selectSorting);
    })
    document.querySelector("#searchfunction").addEventListener("input", search);

}

// Load json
async function loadJSON(){
    await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    prepareObjects(jsonData[0], jsonData[1]);   
    });
    // const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    // const jsonData = await respons.json();

    
}

// Prepare data objects
function prepareObjects(students, bloodStatus){
    students.forEach(element => {
        const student = Object.create(Student);
    
        student.firstName = getFirstName(element.fullname);
        student.lastName = getLastName(element.fullname);
        student.middleName = getMidddelName(element.fullname);
        student.nickName = getNickName(element.fullname);
        student.image = getImage(student.firstName, student.lastName);
        student.house = getHouse(element.house); 
        student.bloodStatus = getBloodStatus(student.lastName, bloodStatus);
        allStudents.push(student);
    });
    buildList();
}

// Get firstname from fullname
function getFirstName(fullname){
    let firstName = fullname.trim();
    // If fullname includes a space, firstname is what comes before that first space
    if (fullname.includes(" ")) {
        firstName = firstName.substring(0, firstName.indexOf(" "));
        firstName = firstName.substring(0,1).toUpperCase() + firstName.substring(1).toLowerCase();
    } else {
        // if fullname only has one name - no space
        firstName = firstName;
    }
    return firstName;
}

// Get lastname from fullname
function getLastName(fullname){
    let lastName = fullname.trim();
    lastName = lastName.substring(lastName.lastIndexOf(" ")+1);
    lastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
    // If fullname contains -, make first character uppercase
    if (fullname.includes("-")){
        let lastNames = lastName.split("-");
        lastNames[1] = lastNames[1].substring(0,1).toUpperCase() + lastNames[1].substring(1).toLowerCase();
        lastName = lastNames.join('-');
    }
    return lastName;
}

// Get middlename from fullname
function getMidddelName(fullname){
    let middleName = fullname.trim();
    middleName = middleName.split(" ");
    // If fullname includes "", ignore that name and make middlename none
    if (fullname.includes(' "')) {
        middleName = ""; 
    } else if (middleName.length > 2) { // if fullname is longer than 2, make second name middlename
        middleName = middleName[1];
        middleName = middleName.substring(0,1).toUpperCase() + middleName.substring(1).toLowerCase();
    } else{
        middleName = "";
    }
    return middleName;
}

// Get nickname from fullname
function getNickName(fullname){
    let nickName = fullname.trim();
    nickName = nickName.split(" ");
    // if fullname contains "", make second name the nickname
    if (fullname.includes(' "')){
        nickName = nickName[1];
    } else {
        nickName = "";
    }
 return nickName;
}

// Get house
function getHouse(house){
    house = house.trim();
    house = house.substring(0,1).toUpperCase() + house.substring(1).toLowerCase();
    return house;
}

// Get image
 function getImage(firstName, lastName){
    let image;
    // If lastname is patil, use both lastname and firstname to get image
    if (lastName === 'Patil') {
        image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
      } else if (firstName === 'Leanne') { // If lastname is Leanne, show no image avaliable picture
        image = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      } else if (firstName === 'Justin') { // If lastname is Justin, split the lastname and use second lastname
          lastName = lastName.split("-");
          image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
      else {
        image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
     return image;
 }

 // Get bloodstatus
 function getBloodStatus(lastName, bloodStatus) {
     if (bloodStatus.half.includes(lastName)){
         bloodStatus = "Half-blood";
     } else if (bloodStatus.pure.includes(lastName)) {
         bloodStatus = "Pure-blood";
     } else {
         bloodStatus = "Muggle-born";
     }
     return bloodStatus;
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
    } else if (settings.filterBy === "prefect"){
        filteredList = allStudents.filter(isPrefect);
    } else if (settings.filterBy === "squad"){
        filteredList = allStudents.filter(isSquad);
    } else if (settings.filterBy === "expelled"){
        filteredList = allStudents.filter(isExpelled);
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

function isPrefect(student){
    return student.prefect === true;
}

function isSquad(student){
    return student.squad === true;
}

function isExpelled(student){
    return student.expelled === true;
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
    sortedList = sortedList.sort(sortByProperty);
    
    function sortByProperty(nameA, nameB){
        if (nameA[settings.sortBy] < nameB[settings.sortBy]){
            return -1;
        } else {
            return 1;
        }
    }
    return sortedList;
}

// Searching
function search(){
    const searchWord = document.querySelector("#searchfunction").value.toLowerCase();
    const filteredSearch = allStudents.filter((student) => {
        return (
            student.firstName.toLowerCase().includes(searchWord) ||
            student.lastName.toLowerCase().includes(searchWord)
        );
    });
    displayList(filteredSearch);
}

function buildList(){
    const currentList = filterList(allStudents.filter((student) => student.expelled === false));
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
    clone.querySelector("#studenttext").addEventListener("click", () => showDetails(student));

    // INQUISITORIAL SQUAD
    // Change textcontent if student is part of inquisitorial squad or not
    if (student.squad === true){
        clone.querySelector(".squad").classList.remove("gray");
    } else if (student.squad === false){
        clone.querySelector(".squad").classList.add("gray");
    }

    // Add eventlistener to squad
    clone.querySelector(".squad").addEventListener("click", clickSquad);

    // Toggle squad true or false on click
    function clickSquad() {
        if (student.house === "Slytherin" || student.bloodStatus === "Pure-blood"){
            student.squad = !student.squad;
        } else {
            
        }
        buildList();
    }

    // PREFECT
    // // Change textcontent if student is a prefect or not
    if (student.prefect === true){
        clone.querySelector(".prefect").classList.remove("gray");
    } else if (student.squad === false){
        clone.querySelector(".prefect").classList.add("gray");
    }

    // // Add eventlistener to prefect
    clone.querySelector(".prefect").addEventListener("click", clickPrefect);

    // // Toggle prefect true or false on click
    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        } else {
            tryToMakePrefect(student);
        }
        buildList();
    }

    // EXPELLED
    //  // Change textcontent if student is expelled or not
     if (student.expelled === true){
        clone.querySelector(".expell").classList.remove("gray");
        clone.querySelector(".studentinfo").classList.add("gray");
        popup.classList.add("gray");
    } else if (student.expelled === false){
        clone.querySelector(".expell").classList.add("gray");
    }

    // // Add eventlistener to prefect
    clone.querySelector(".expell").addEventListener("click", clickExpell);

    // // Toggle prefect true or false on click
    function clickExpell() {
        student.expelled = !student.expelled;
        buildList();
    }

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
    clone.querySelector("[data-field=bloodstatus]").textContent = `Blood status: ${student.bloodStatus}`;
    clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
    if (student.house === "Gryffindor"){
        popup.style.background = "radial-gradient(circle, rgba(251,74,74,1) 0%, rgba(210,29,29,1) 35%, rgba(158,16,16,1) 76%)";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/gryffindor.png')";    
    } else if (student.house === "Hufflepuff"){
        popup.style.background = "radial-gradient(circle, rgba(251,239,74,1) 0%, rgba(230,217,44,1) 35%, rgba(194,176,18,1) 76%)";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/hufflepuff.png')";
    } else if (student.house === "Slytherin"){
        popup.style.background = "radial-gradient(circle, rgba(75,156,51,1) 0%, rgba(27,112,33,1) 35%, rgba(21,76,18,1) 76%)";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/slytherin.png')";
    } else {
        popup.style.background = "radial-gradient(circle, rgba(43,135,189,1) 0%, rgba(30,70,140,1) 35%, rgba(22,33,79,1) 76%)";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/ravenclaw.png')";
    }

    popup.classList.add('active');
    overlay.classList.add('active');
    clone.querySelector("#close").addEventListener("click", closeDetails);
    popup.appendChild(clone);
}

function tryToMakePrefect(selectedStudent){
    //Variable for prefects
    const prefects = allStudents.filter(student => student.prefect);

    //Variable for other prefects from same house
    const other = prefects.filter(student => student.house === selectedStudent.house);
    const numberOfPrefects = other.length;

    //If there is two other students from the same house
    if (numberOfPrefects >= 2){
        console.log("There can only be two prefects from each house");
        removeAorB(other[0], other[1]);
    } else {
        makePrefect(selectedStudent);
    }

    function removeAorB(prefectA, prefectB){
        console.log(prefectA.firstName);
        console.log(prefectB.firstName);

        // Ask user to igore or remove
        document.querySelector("#remove_AorB").classList.remove("hide");
        document.querySelector("#remove_AorB .close_dialog").addEventListener("click", closeDialog);
        document.querySelector("#remove_AorB #removeA").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_AorB #removeB").addEventListener("click", clickRemoveB);

        // Show names on buttons
        document.querySelector("#remove_AorB [data-field=prefectA]").textContent = `${prefectA.firstName} ${prefectA.lastName}`;
        document.querySelector("#remove_AorB [data-field=prefectB]").textContent = `${prefectB.firstName} ${prefectB.lastName}`;
        
        // If ignore - do nothing
        function closeDialog(){
            document.querySelector("#remove_AorB").classList.add("hide");
            document.querySelector("#remove_AorB .close_dialog").removeEventListener("click", closeDialog);
            document.querySelector("#remove_AorB #removeA").removeEventListener("click", clickRemoveA);
            document.querySelector("#remove_AorB #removeB").removeEventListener("click", clickRemoveB);
        }

        // If remove a
        function clickRemoveA(){
            removePrefect(prefectA);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
        

        // If remove b
        function clickRemoveB(){
            removePrefect(prefectB);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removePrefect(studentPrefect){
        studentPrefect.prefect = false;
    }

    function makePrefect(student) {
        student.prefect = true;

    }
    
}  

function closeDetails(){
    popup.classList.remove('active');
    overlay.classList.remove('active');
}