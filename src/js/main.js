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
let infowindow;
let markers = [];
let markerCluster;
let infoWindows = [];


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

    filterByCountries(countries){
        let auxList = [];
        for(let j = 0; j < countries.length; j++){
            for(let i = 0; i < this.movList.length; i++){
                if(this.movList[i].pais == countries[j].value){
                    auxList.push(this.movList[i]);
                }
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

    var mc =window.MarkerClusterer.prototype.onRemove = function(){
        for ( var i = 0 ; i < this.clusters_.length; i++){
        this.clusters_[i].remove();
        }
    };
    xhttp.onreadystatechange = processResult;
}

function addMarker(latlng, it){
    contentString = "<h4>Datos de la movilidad</h3><ul><li><b>Tipo:</b> " + movs_.movList[it].tipo + "</li><li><b>Ciclo:</b> " + movs_.movList[it].ciclo + "</li><li><b>País:</b> " + movs_.movList[it].pais + "</li><li><b>Ciudad:</b> " + movs_.movList[it].ciudad + "</li></ul>"; 
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    infoWindows.push(infowindow);
    let marker = new google.maps.Marker({
        id: labelCount.toString(),    
        animation: google.maps.Animation.DROP,
        position: latlng,
        map: map,
        title: 'Hello World!'
      });
    labelCount++;
    markers.push(marker);
    marker.addListener('click', function() {
        infoWindows[parseInt(marker.id) - 1].open(map, marker);
    });
}

function deleteMarkers(){
    if(markerCluster != null){
        markerCluster.clearMarkers();
    }
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers.length = 0;
    labelCount = 1;
    cityCoords = [];
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
        input.checked = true;
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
    let typeSelect = document.getElementById("typeSelect");
    let moduleSelect = document.getElementById("moduleSelect");    
    let checktoggle = document.getElementById("checktoggle");    
    let check = document.getElementById("check");
    let uncheck = document.getElementById("uncheck");
    let searchButton = document.getElementById("searchButton");
    let countriesInputs = document.querySelectorAll("#countriesInputs input");
    typeSelect.addEventListener("change", typeChange, false);
    moduleSelect.addEventListener("change", moduleChange, false);   
    checktoggle.addEventListener("change", toggleChange, false);
    check.addEventListener("click", checkAll, false);
    uncheck.addEventListener("click", uncheckAll, false);
    searchButton.addEventListener("click", function() {
        searchinMap(movs_.movList);
    }, false);
    for(let i = 0; i < countriesInputs.length; i++){
        countriesInputs[i].addEventListener("change", countryChange, false);
    }
    
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
    movs_ = new MovilityList(data_); //reseteo de lista de movilidades
    let typeCode = ""; 

    //Filtra la lista de movilidades segun el valor seleccionado
    if(select.value == "Grado Medio"){
        typeCode = "GM";
    }
    if(select.value == "Grado Superior"){
        typeCode = "GS";              
    }
    if(select.value == "Profesorado"){
        typeCode = "PR";        
    }
    
    movs_.movList = movs_.filterByType(select.value);

    if(toggle_ == false){
        changeModules(typeCode);
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
        checkboxes[i].checked = false;
    }
    for(let i = 0; i < countries.length; i++){
        let auxList = auxMovs.filterByCountry(countries[i]);
        if(auxList.length > 0){
            for(let j = 0; j < checkboxes.length; j++){
                if(checkboxes[j].value == countries[i]){
                    checkboxes[j].parentElement.style.display = "initial";
                    checkboxes[j].checked = true;
                }
            }
        }
    }
}

function moduleChange(){
    let typeSelect = document.getElementById("typeSelect");
    let moduleSelect = document.getElementById("moduleSelect");
    movs_ = new MovilityList(data_);
    if(typeSelect.selectedIndex == 0){
        movs_.movList = movs_.filterByType(typeSelect.value);        
    }
    else{
        movs_.movList = movs_.filterByType(typeSelect.value);
        movs_.movList = movs_.filterByModule(moduleSelect.value);
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

function countryChange() {
    let typeSelect = document.getElementById("typeSelect");
    movs_ = new MovilityList(data_);
    movs_.movList = movs_.filterByType(typeSelect.value);            
    let selectedCountries = document.querySelectorAll("#countriesInputs input[type='checkbox']:checked");
    if(selectedCountries.length != 0){
        movs_.movList = movs_.filterByCountries(selectedCountries);
    }
    console.log(movs_.movList);
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
    if(auxNum == 0){
        deleteMarkers();
    }
    if (auxNum >= list.length) {
        markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
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
            aux = fixPosition(aux);
            console.log(cityCoords);
            addMarker(aux.latlng, auxNum);
            auxNum++;
            searchinMap(list);
        }
    };

    var address = list[auxNum].ciudad + " " + list[auxNum].pais;
    address = address.split(" ").join("+");
    req.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCRBsKc1kgrlZ9Lr77ZHiCWISrvKUjJv4o", true);
    req.send();
}

function fixPosition(mov){
    let coincidences = 0;
    for(let i = 0; i < cityCoords.length; i++){
        if(aux = cityCoords[i]){
            coincidences++;
        }
    }

    mov.latlng.lat = mov.latlng.lat - (coincidences / 5000);

    return mov;
}