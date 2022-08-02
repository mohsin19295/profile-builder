let form = document.querySelector(".input-form");
let displayDiv = document.querySelector(".display");

let fnameSpan = document.getElementById("fname-span");
let lnameSpan = document.getElementById("lname-span");
fnameSpan.innerHTML = " " + "Mohammad";
lnameSpan.innerHTML = " " + "Mohsin";
 
function handleForm(e) {
  e.preventDefault();

  fnameSpan.innerHTML = " " + form["fname"].value;
  lnameSpan.innerHTML = " " + form["lname"].value;

  if (fnameSpan.innerHTML.length <= 1) {
    fnameSpan.innerHTML = " " + "Mohammad";
  }
  if (lnameSpan.innerHTML.length == 1) {
    lnameSpan.innerHTML = " " + "Mohsin";
  }
}
