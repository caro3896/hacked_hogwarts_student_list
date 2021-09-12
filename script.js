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
}

let firstName;
let middleName;
let lastName;
let nickName;
let image;
let house;

function start(){
    console.log("DOM is loaded");
    loadJSON();
}

async function loadJSON(){
    const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await respons.json();

    // When loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData){
jsonData.forEach(element => {
    const student = Object.create(Student);

    student.firstName = getFirstName(element.fullname);
    student.lastName = getLastName(element.fullname);
    student.middleName = getMidddelName(element.fullname);
    student.nickName = getNickName(element.fullname);
    student.image = getImage(element.fullname);
    student.house = element.house.trim();
    student.house = student.house.substring(0,1).toUpperCase() + student.house.substring(1).toLowerCase();
    allStudents.push(student);
});
displayList(allStudents);}

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
    clone.querySelector("[data-field=name]").textContent = student.name;

    //Make clickable to see more details
    clone.querySelector(".studentinfo").addEventListener("click", () => showDetails(student));

    //Append clone to list
    document.querySelector("#students").appendChild(clone);
}

function showDetails(student){
    const clone = document.querySelector("#info").cloneNode(true).content;
    popup.textContent="";
    clone.querySelector(".fullname").textContent = student.fullname;
    clone.querySelector(".house").textContent = `House: ${student.house}`;
    popup.classList.add('active');
    overlay.classList.add('active');
    clone.querySelector("#close").addEventListener("click", closeDetails);
    popup.appendChild(clone);
}

function closeDetails(){
    popup.classList.remove('active');
    overlay.classList.remove('active');
}