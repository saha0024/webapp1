// JavaScript Document
var pages = [];
var links=[];
var numLinks = 0;
var numPages = 0;
var names = [];
var waitingMessage;
var randomeContactNum;

document.addEventListener("deviceready", function(){
    console.log ("deviceready");
});

document.addEventListener("DOMContentLoaded", function(){
	//device ready listener
    
    waitingMessage = document.createElement("p");
    randomeContactNum = document.createElement("p");
	pages = document.querySelectorAll('[data-role="page"]');	
	numPages = pages.length;
	links = document.querySelectorAll('[data-role="pagelink"]');
	numLinks = links.length;
	for(var i=0;i<numLinks; i++){
		//either add a touch or click listener
     if(detectTouchSupport( )){
       links[i].addEventListener("touchend", handleTouch, false);
     }
		links[i].addEventListener("click", handleNav, false);	
	}
  //add the listener for the back button
  window.addEventListener("popstate", browserBackButton, false);
	loadPage(null);
});


// Geolocation

function watchPosition( position ){ 
    console.log(position);
    var curLatitude=position.coords.latitude;
    var curLongitude=position.coords.longitude;
//  console.log( position.coords.latitude );
//  console.log( position.coords.longitude );
//  console.log( position.coords.accuracy );
//  console.log( position.coords.altitude );
   var canvas = document.createElement("canvas"); 
    canvas.id="mapCanvas";
    canvas.setAttribute("width", 400);
    canvas.setAttribute("height", 400);
    //document.section.appendChild(canvas);
   // document.querySelector('#map').appendChild(canvas);
    var context = canvas.getContext("2d");
    var imageObj = document.getElementById("myCanvas");
//
    imageObj.onload = function() {
       // console.log("now image loaded");
        context.drawImage(imageObj, 0, 0, 400, 400);
        //var dataURL=canvas.toDataURL();
        //document.querySelector("#hiddenposter").innerHTML=dataURL;
    }
    imageObj.src="https://maps.googleapis.com/maps/api/staticmap?center="+curLatitude+","+curLongitude+"&zoom=14&size=400x400&maptype=roadmap&markers=color:purple%7Clabel:A%7C"+curLatitude+","+curLongitude;
}

function gpsError( error ){   
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}





// Contacts Code


function findRandomContacts() {
    console.log("findRandomContacts");
// specify contact search criteria
// console.log("find random now");
var randomContactDiv = document.querySelector("#randomContact");
while (randomContactDiv.firstChild) {
randomContactDiv.removeChild(randomContactDiv.firstChild);
}
waitingMessage.innerHTML = "Please wait, it's navicating your contact list...";
randomContactDiv.appendChild(waitingMessage);
var options = new ContactFindOptions();
options.filter=""; // empty search string returns all contacts
options.multiple=true; // return multiple results
filter = ["displayName"]; // return contact.displayName field
// find contacts
navigator.contacts.find(filter, successFunc, errorFunc, options);
}

function successFunc(contacts) {
for (var i=0; i<contacts.length; i++) {
if (contacts[i].displayName) { // many contacts don't have displayName
names.push(contacts[i].displayName);
}
}
// console.log("on success now ="+names);
//alert('contacts loaded');
randomeContactNum.innerHTML = "Finished. Located "+names.length+" contacts. A random contact is displayed: "+names[Math.floor((Math.random()*names.length))];
document.querySelector("#randomContact").removeChild(waitingMessage);
document.querySelector("#randomContact").appendChild(randomeContactNum);
}
function errorFunc(){
alert("Page failed to load.");
}







//handle the touchend event
function handleTouch(ev){
  ev.preventDefault();
  ev.stopImmediatePropagation();
  var touch = ev.changedTouches[0];        //this is the first object touched
  var newEvt = document.createEvent("MouseEvent");	
  //old method works across browsers, though it is deprecated.
  newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
  ev.currentTarget.dispatchEvent(newEvt);
  //send the touch to the click handler
}

//handle the click event
function handleNav(ev){
	ev.preventDefault();
	var href = ev.target.href;
	var parts = href.split("#");
	loadPage( parts[1] );	
  return false;
}

//Deal with history API and switching divs
function loadPage( url ){
    console.log(url);
	if(url == null){
		//home page first call
		pages[0].style.display = 'block';
		history.replaceState(null, null, "#home");	
	
        
    




	}else
    
//    if(url == "contacts"){
//		//home page first call
//		pages[2].style.display = 'block';
//        
//		history.replaceState(null, null, "#contacts");	
//	}else 
    {
    
//      findRandomContacts();
        for(var i=0; i < numPages; i++){
          if(pages[i].id == url){
            pages[i].style.display = "block";
            history.pushState(null, null, "#" + url);
              
              
          }else{
            pages[i].style.display = "none";	
          }
        }
        for(var t=0; t < numLinks; t++){
          links[t].className = "";
          if(links[t].href == location.href){
            links[t].className = "activetab";
          }
        }
	}
    
    if (url=="map"){
        
        
        
        if (navigator.geolocation) {
            console.log("get current position");
        //code goes here to find position
        var params = {
            enableHighAccuracy: true,
            timeout: 360000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(watchPosition, gpsError, params);
    }
    
    
    }
    
    if(url=="contacts"){
              findRandomContacts();
              }
}






//Need a listener for the popstate event to handle the back button
function browserBackButton(ev){
  url = location.hash;  //hash will include the "#"
  //update the visible div and the active tab
  for(var i=0; i < numPages; i++){
      if(("#" + pages[i].id) == url){
        pages[i].style.display = "block";
      }else{
        pages[i].style.display = "none";
        
      }
  }
  for(var t=0; t < numLinks; t++){
    links[t].className = "";
    if(links[t].href == location.href){
      links[t].className = "activetab";
    }
  }
}

//Test for browser support of touch events
function detectTouchSupport( ){
  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
  var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
  return touchSupport;
}