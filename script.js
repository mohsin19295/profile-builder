let form = document.querySelector(".input-form");
let displayDiv = document.querySelector(".display");

let fnameSpan = document.getElementById("fname-span");
let lnameSpan = document.getElementById("lname-span");
let citySpan = document.getElementById("city-span");
let stateSpan = document.getElementById("state-span");
let hdegreeSpan = document.getElementById("hdegree-span");
let cnameSpan = document.getElementById("cname-span");


fnameSpan.innerHTML = " " + "Mohammad";
lnameSpan.innerHTML = " " + "Mohsin" + ".";
citySpan.innerHTML = " " + "Gurgaon" + ",";
stateSpan.innerHTML = " " + "Haryana" + ".";
hdegreeSpan.innerHTML = " " + "12th";
cnameSpan.innerHTML = " " + "xyz";
 
function handleForm(e) {
  e.preventDefault();

  fnameSpan.innerHTML = " " + form["fname"].value;
  lnameSpan.innerHTML = " " + form["lname"].value + ".";
  citySpan.innerHTML = " " + form["city"].value + ",";
  stateSpan.innerHTML = " " + form["state"].value + ".";
  hdegreeSpan.innerHTML = " " + form["hdegree"].value;
  cnameSpan.innerHTML = " " + form["cname"].value;

  if (fnameSpan.innerHTML.length <= 1) {
    fnameSpan.innerHTML = " " + "Mohammad";
  }
  if (lnameSpan.innerHTML.length == 2) {
    lnameSpan.innerHTML = " " + "Mohsin" + ".";
  }
  if (citySpan.innerHTML.length == 2) {
    citySpan.innerHTML = " " + "Gurgaon" + ",";
  }
  if (stateSpan.innerHTML.length == 2) {
    stateSpan.innerHTML = " " + "Haryana" + ".";
  }
  if (hdegreeSpan.innerHTML.length == 1) {
    hdegreeSpan.innerHTML = " " + "12th";
    }
  if (cnameSpan.innerHTML.length == 2) {
    cnameSpan.innerHTML = " " + "xyz";
    }
}

let options = document.getElementById("selectOption");
let optionSpan = document.getElementById("option-span");
optionSpan.innerHTML = " " + "school" + ".";

options.addEventListener('change', () => {
    optionSpan.innerHTML = " " + options.value + ".";
})
