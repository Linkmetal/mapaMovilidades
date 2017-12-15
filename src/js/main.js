//Clave maps : AIzaSyAww3Txk8R0wzgSvtIgf_hsgBbbFeJlxAE
//Clave geocoding : AIzaSyDY6jBx513uHdlLA9wa-7r0KZirNLsfw6M
//Clave maps2: AIzaSyCpiCRGo5cM_NdplMhl9oR1AIdri8tLaXo
//clave geocoding2: AIzaSyCRBsKc1kgrlZ9Lr77ZHiCWISrvKUjJv4o
let map;
let data_;
let countries = [];
let types = [];
let toggle_ = false;
let movs_;
let labelCount = 1;
let xhttp = new XMLHttpRequest();
let cityCoords = [];


class MovilityList {
    constructor (data){
        this.movList = [];
        for(let i = 0; i < data.length; i++){
            this.movList.push(data[i]);
        }
    }

    getMov(index){
        return this.movList[index];
    }

    filterByCountry(country){
        let auxList = [];
        for(let i = 0; i < this.movList.length; i++){
            if(this.movList[i].pais == country){
                auxList.push(this.movList[i]);
            }
        }
        return auxList;
    }

    filterByType(type){
        let auxList = [];
        for(let i = 0; i < this.movList.length; i++){
            if(this.movList[i].tipo == type){
                auxList.push(this.movList[i]);
            }
        }
        return auxList;
    }

    filterByModule(ciclo){
        let auxList = [];
        for(let i = 0; i < this.movList.length; i++){
            if(this.movList[i].ciclo == ciclo){
                auxList.push(this.movList[i]);
            }
        }
        return auxList;
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.0189645, lng: 15.22315479 },
        zoom: 3
    });

    xhttp.onreadystatechange = processResult;
}

function addMarker(latlng){
    let marker = new google.maps.Marker({
        label:{
         text: labelCount.toString(),
         fontWeigth: 999,
        },    
        position: latlng,
        map: map,
        title: 'Hello World!'
      });
    labelCount++;
}

function processResult() {
    console.log("readyState: " + xhttp.readyState);
    console.log("status: " + xhttp.status);

    if (xhttp.readyState === 4 && xhttp.status === 200) {
        let response = JSON.parse(xhttp.responseText);
        console.log(response);
        aux = {
            name: response.results["0"].address_components["0"].long_name,
            latlng: response.results["0"].geometry.location
        };
        cityCoords.push(aux);
        console.log(cityCoords);
        addMarker(aux.latlng);
    }
}

function getAddress(address){
    var addr = address.split(" ").join("+");
    xhttp.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=AIzaSyCRBsKc1kgrlZ9Lr77ZHiCWISrvKUjJv4o", true);
    xhttp.send();
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
     movs_ = new MovilityList(data_);
     for (let i = 0; i < data_.length; i++) {
         if(types.indexOf(data_[i].tipo) == -1){
             types.push(data_[i].tipo);
            }
            if(countries.indexOf(data_[i].pais) == -1){
                countries.push(data_[i].pais);
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
        input.id = "check" + i;
        input.value = countries[i];
        label.appendChild(input);
        let text = document.createTextNode(countries[i]);
        label.appendChild(text);
        countriesInputs.appendChild(label);
    }

    //Ciclos
    let modulesSelect = document.getElementById("moduleSelect");
    let modules = [];
    for(let i = 0; i < movs_.movList.length; i++){
        if(modules.indexOf(movs_.movList[i].ciclo) == -1){
            let option = document.createElement("option");
            option.textContent = movs_.movList[i].ciclo;
            option.value = movs_.movList[i].ciclo;
            if(movs_.movList[i].tipo == "Grado Superior"){
                option.className = "GS";
            }
            if(movs_.movList[i].tipo == "Grado Medio"){
                option.className = "GM";
            }
            if(movs_.movList[i].tipo == "Profesorado"){
                option.className = "PR";
            }
            moduleSelect.appendChild(option);
            modules.push(movs_.movList[i].ciclo);
        }
    }
 }

function initListeners(){
    let select = document.getElementById("typeSelect");
    let checktoggle = document.getElementById("checktoggle");    
    let check = document.getElementById("check");
    let uncheck = document.getElementById("uncheck");
    let searchButton = document.getElementById("searchButton");
    select.addEventListener("change", typeChange, false);
    checktoggle.addEventListener("change", toggleChange, false);
    check.addEventListener("click", checkAll, false);
    uncheck.addEventListener("click", uncheckAll, false);
    searchButton.addEventListener("click", searchInMap, false);
    
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
    if(toggle_ == false){
        if(select.value == "Grado Medio"){
            changeModules("GM");
        }
        if(select.value == "Grado Superior"){
            changeModules("GS");
        }
        if(select.value == "Profesorado"){
            changeModules("PR");
        }
    }
    else{
        changeCountries();
    }
}

function changeModules(value){
    let select = document.getElementById("moduleSelect");        
    let options = document.querySelectorAll("#moduleSelect > option");
    let aux = document.querySelectorAll("." + value);
    for(let i = 0; i < options.length; i++){
        options[i].style.display = "none";
    }
    for(let i = 0; i < aux.length; i++){
        aux[i].style.display = "initial";
    }
    select.selectedIndex = 0;
}

function changeCountries(){
    let select = document.getElementById("typeSelect");    
    let auxMovs = new MovilityList(movs_.filterByType(select.value));
    let checkboxes = document.querySelectorAll(".country");
    for(let i = 0; i < checkboxes.length; i++){
        checkboxes[i].parentElement.style.display = "none";
    }
    for(let i = 0; i < countries.length; i++){
        let auxList = auxMovs.filterByCountry(countries[i]);
        if(auxList.length > 0){
            for(let j = 0; j < checkboxes.length; j++){
                if(checkboxes[j].value == countries[i]){
                    checkboxes[j].parentElement.style.display = "initial";
                }
            }
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


var auxNum = 0;
function searchinMap(list) {
    if (auxNum >= list.length) {
        auxNum = 0;
        return;
    }

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.log(response);
            let aux = {
                name: response.results["0"].address_components["0"].long_name,
                latlng: response.results["0"].geometry.location
            };
            cityCoords.push(aux);
            console.log(cityCoords);
            addMarker(aux.latlng);

            auxFunc(list, auxNum++);
        }
    }

    var address = list[auxNum].ciudad + " " + list[auxNum].pais;
    address = address.split(" ").join("+");
    req.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCRBsKc1kgrlZ9Lr77ZHiCWISrvKUjJv4o", true);
    req.send();
}