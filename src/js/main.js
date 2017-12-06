//Clave maps : AIzaSyAww3Txk8R0wzgSvtIgf_hsgBbbFeJlxAE
//Clave geocoding : AIzaSyDY6jBx513uHdlLA9wa-7r0KZirNLsfw6M

let map;
let data_;
let countries = [];
let types = [];
let modules = [];
let toggle_ = false;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.0189645, lng: 15.22315479 },
        zoom: 3
    });
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

window.onload = function(){ //Lee el fichero json y lo parsea para guardarlo en la variable data_
    readTextFile("resources/movilidades.json", function(text){
        data_ = JSON.parse(text);
        initForm();
        initListeners();
    }); 
 };

 function initForm(){
     //Obtencion de datos
     for (let i = 0; i < data_.length; i++) {
         if(types.indexOf(data_[i].tipo) == -1){
             types.push(data_[i].tipo);
            }
            if(countries.indexOf(data_[i].pais) == -1){
                countries.push(data_[i].pais);
            }
            if(modules.indexOf(data_[i].ciclo) == -1){
                modules.push(data_[i].ciclo);
            }
        }
        
    //Tipos
    let select = document.getElementById("typeSelect");
    for(let i = 0; i < types.length; i++){
        let option = document.createElement("option");
        option.textContent = types[i];
        option.value = types[i];
        select.appendChild(option);
    }

    //Paises
    let countriesInputs = document.getElementById("countriesInputs");
    for(let i = 0; i < countries.length; i++){
        let label = document.createElement("label");
        label.className = "form-check-label";
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input country";
        input.id = "country" + i;
        input.value = countries[i];
        label.appendChild(input);
        let text = document.createTextNode(countries[i]);
        label.appendChild(text);
        countriesInputs.appendChild(label);
    }

    //Ciclos
    let modulesSelect = document.getElementById("moduleSelect");
    for(let i = 0; i < modules.length; i++){
        let option = document.createElement("option");
        option.textContent = modules[i];
        option.value = modules[i];
        moduleSelect.appendChild(option);
    }
 }

function initListeners(){
    let select = document.getElementById("typeSelect");
    let checktoggle = document.getElementById("checktoggle");    
    let check = document.getElementById("check");
    let uncheck = document.getElementById("uncheck");
    select.addEventListener("change", typeChange, false);
    checktoggle.addEventListener("change", toggleChange, false);
    check.addEventListener("click", checkAll, false);
    uncheck.addEventListener("click", uncheckAll, false);
    
}

function typeChange(){
    let select = document.getElementById("typeSelect");    
    if(select.value != "ALL") {
        if(toggle_ == true){
            document.getElementById("modules").style.display = "none";            
            document.getElementById("countries").style.display = "initial";
            document.getElementById("countriesButtons").style.display = "initial";
        }
        else{
            document.getElementById("countriesButtons").style.display = "none";            
            document.getElementById("countries").style.display = "none";            
            document.getElementById("modules").style.display = "initial";
        }
    }
}

function toggleChange(){
    let checktoggle = document.getElementById("checktoggle");

    let select = document.getElementById("typeSelect");    
    if(checktoggle.checked == true){
        toggle_ = true;
    }
    else{
        toggle_ = false;
    }
    typeChange();
}

function checkAll(){
    let countryChecks = document.getElementsByClassName("form-check-input country");
    for(let i = 0; i < countryChecks.length; i++){
        countryChecks[i].checked = true;
    }
}

function uncheckAll(){
    let countryChecks = document.getElementsByClassName("form-check-input country");
    for(let i = 0; i < countryChecks.length; i++){
        countryChecks[i].checked = false;
    }
}