let form = document.querySelector(".input-form");
let displayDiv = document.querySelector(".display");

let hname = document.getElementById("h2-hname");
let fnameSpan = document.getElementById("fname-span");
let lnameSpan = document.getElementById("lname-span");
let citySpan = document.getElementById("city-span");
let stateSpan = document.getElementById("state-span");
let hdegreeSpan = document.getElementById("hdegree-span");
let cnameSpan = document.getElementById("cname-span");

hname.innerHTML = "Mohammad Mohsin";
fnameSpan.innerHTML = " " + "Mohammad";
lnameSpan.innerHTML = " " + "Mohsin" + ".";
citySpan.innerHTML = " " + "Gurgaon" + ",";
stateSpan.innerHTML = " " + "Haryana" + ".";
hdegreeSpan.innerHTML = " " + "B.tech";
cnameSpan.innerHTML = " " + "Aligarh";

// Handeling form data

function handleForm(e) {
  e.preventDefault();
  hname.innerHTML = document.getElementById("hname").value;
  fnameSpan.innerHTML = " " + form["fname"].value;
  lnameSpan.innerHTML = " " + form["lname"].value + ".";
  citySpan.innerHTML = " " + form["city"].value + ",";
  stateSpan.innerHTML = " " + form["state"].value + ".";
  hdegreeSpan.innerHTML = " " + form["hdegree"].value;
  cnameSpan.innerHTML = " " + form["cname"].value;

  if (hname.innerHTML.length == 0) {
    hname.innerHTML = "Mohammad Mohsin";
  }
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
    hdegreeSpan.innerHTML = " " + "B.tech";
  }
  if (cnameSpan.innerHTML.length == 1) {
    cnameSpan.innerHTML = " " + "Aligarh";
  }
}

let options = document.getElementById("selectOption");
let optionSpan = document.getElementById("option-span");
optionSpan.innerHTML = " " + "university" + ".";

options.addEventListener("change", () => {
  if (options.value == "select") {
    optionSpan.style.display = "hidden";
  } else {
    optionSpan.innerHTML = " " + options.value + ".";
  }
});

// For image upload

let readUrl = document.getElementById("readUrl");
readUrl.addEventListener("change", imageViewer);
let uploadedImg = document.getElementById("uploadedImg");

function imageViewer() {
  if (this.files[0]) {
    let picture = new FileReader();
    picture.readAsDataURL(this.files[0]);
    picture.addEventListener("load", function (e) {
      uploadedImg.src = e.target.result;
    });
  }
}

// For Translate

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}

// For appending data

let save = document.getElementById("save");
let initialSpan = "Hi, my name is";
let fromSpan = " I am from";
let completedSpan = " I have completed my";
let from = " from";

let data = document.getElementById("data");

save.addEventListener("click", () => {
  let heading = hname.innerHTML;
  let content =
    initialSpan +
    fnameSpan.innerHTML +
    lnameSpan.innerHTML +
    fromSpan +
    citySpan.innerHTML +
    stateSpan.innerHTML +
    completedSpan +
    hdegreeSpan.innerHTML +
    from +
    cnameSpan.innerHTML +
    optionSpan.innerHTML;
  
  let singleDiv = document.createElement("div");
  singleDiv.className = "singleDiv"

  let h4 = document.createElement("h4");
  h4.innerHTML = heading;

  let p = document.createElement("p");
  p.innerHTML = content;

  let img = document.createElement("img");
  img.src = uploadedImg.src;

  singleDiv.append(img, h4, p)
  data.append(singleDiv);
});
