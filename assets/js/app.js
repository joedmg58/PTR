// PTR: Parking Ticket Reimbursment App
// Project #1. UM Coding Boot CAmp 2018.

//Global Variables
var userLoginBtn = '#'; // Id of the User login button
var adminLoginBtn = '#'; //Id of the Admin login button

var fbDatabaseName = 'ptrdb-joedmg58';

$(document).ready( function(){
    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA7edVoCp46Jh6AEe3dwGkhQoM5yS0uazM", //change later for Joseph apiKey
    authDomain: fbDatabaseName + ".firebaseapp.com",
    databaseURL: "https://ptrdb-joedmg58.firebaseio.com",
    projectId: fbDatabaseName,
    storageBucket: fbDatabaseName + ".appspot.com",
    messagingSenderId: "254791034902" //change later for Joseph messagingSenderId
  };
  firebase.initializeApp(config);

  //Reference to ptrdb database
  var fbptrDB = firebase.database();
  console.log( fbptrDB );

  

});