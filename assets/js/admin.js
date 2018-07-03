//Some Variables
var addUserBtnId = '#addUserBtn'; //add user button
var addPlaceBtnId = '#addPlaceBtn'; //add place button
var addTicketBtnId ='#addTicketBtn'; //add ticket button

var tbUsers ='#tbUsers'; //table body id where users are shown

//user form vars
var frmName = '#user_name';
var frmTitle = '#user_title';
var frmMake = '#user_carMake';
var frmModel = '#user_carModel';
var frmTag = '#user_carTag';

//Map variables
var adminGoogleMap;
var markers = [];
var bound;
var tmpMap;

//function tha manage the on click event for addUserBtn
function addUserBtnClick( e ) {
    e.preventDefault();
    console.log('addUser button clicked');

    //grab values from add user form and pass as value to the function addUser
    var name = $( frmName ).val().trim();
    var title = $( frmTitle ).val().trim();
    var make = $( frmMake ).val().trim();
    var model = $( frmModel ).val().trim();
    var tag = $( frmTag ).val().trim();

    addUser( name, title, {'make': make, 'model': model, 'tag': tag} );

    //clear inputs from form
    $( frmName ).val('');
    $( frmTitle ).val('');
    $( frmMake ).val('');
    $( frmModel ).val('');
    $( frmTag ).val('');
}

//function for adding users to database
function addUser( name, title, car ) {
    console.log('Adding user...');

    var user = {
        userName: name,
        userTitle: title,
        userCar: car,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    fbPtrDb.ref('users/').push( user );

}

//function that manage the on click event for addPlaceBtn
function addPlaceBtnClick( e ) {
    e.preventDefault();
    console.log('addPlace button clicked');

    //grab values from add place form and pass as value to the function addPlace

    addPlace( 'UM', {'lat':'25.7230019', 'long':'-80.2784722'} );

    //clear inputs from form
}

//function for adding places to database
function addPlace( name, coordinates ) {
    console.log('Adding place...');

    var place = {
        placeName: name,
        placeCoordinates: coordinates //coordinates is an object {lat:value, long:value}
    }

    console.log( coordinates );

    fbPtrDb.ref('places/').push( place );
}

//managing onclick event for addTicket button
function addTicketBtnClick( e ) {
    console.log( 'Add ticket button clicked' );

    var place = {
        name: 'Prueba',
        coordinates: {'lat':'25.7230019', 'long':'-80.2784722'}
    }

    var now = moment().format('MM/DD/YYYY hh:mm a');

    addTicket( 'Peter Brown', now , place );
}

//function for adding ticket
function addTicket( userName, startDate, place ) {
    console.log('Adding ticket to user...');

    var ticket = {
        ticketStartDate: startDate,
        ticketStopDate: '',
        ticketPlace: place,
        ticketRate: '',         //obtain this value from parking API
        ticketAproved: 'false',
        ticketPreAproved: 'false'
    }


    fbPtrDb.ref( 'tickets/'+userName+'/' ).push( ticket );
}

//managing oclick venet for get location button
function getLocationBtnClick() {
    console.log('getLocation Button clicked');
    getLocation();
}

//get location function
function getLocation( map ) {
    tmpMap = map; //tmpMap is a global variable to use as a parameter

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( showPosition, showError );
    }
    else {
        alert( "Geolocation is not supported by this browser." );
    }
}

//creating a map
function createMap( container ) {
    var myOptions = {
        //center: latlon,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions:{
            style: google.maps.NavigationControlStyle.SMALL
        }
    }

    var map = new google.maps.Map( container, myOptions );
    return map
}

//show position on a map
function showPosition( position ) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latlon = new google.maps.LatLng( lat, lon );
    console.log('var latlon created');

    //centering the map
    tmpMap.setCenter( latlon );

    //adding marker for signaling where you are
    var marker = new google.maps.Marker({
        position: latlon,
        map: tmpMap, //map,
        title: 'You are here',
        animation: google.maps.Animation.BOUNCE
    })

    //show the markers for job sites
    if ( markers.length > 0 ) {
        for( var i=0; i< markers.length; i++ ){
            markers[i].setMap( tmpMap );
            bound.extend( markers[i].position );
        }
        bound.getCenter();
        tmpMap.fitBounds( bound );
        //map.fitBounds( bound );
    }

    tmpMap.addListener('click', function( e ) {
        console.log( e.latLng.lat() + ', ' + e.latLng.lng() );

        //Create and show marker
        var marker = new google.maps.Marker({
            position: e.latLng,
            map: tmpMap, //map,
            title: 'place',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', //'assets/images/jobsite.png',
            animation: google.maps.Animation.DROP
        });

        //Adjust centering of the map
        bound.extend( e.latLng );
        bound.getCenter();
        tmpMap.fitBounds( bound );
        //map.fitBounds(bound);

        //Add values to Firebase
        addPlace( 'place', {'lat': e.latLng.lat(), 'long': e.latLng.lng() } );

    } ); //end of the function listener


} //end of show position

//show errors on getting location
function showError( error ) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert( "User denied the request for Geolocation." )
            break;
        case error.POSITION_UNAVAILABLE:
            alert( "Location information is unavailable." )
            break;
        case error.TIMEOUT:
            alert( "The request to get user location timed out." )
            break;
        case error.UNKNOWN_ERROR:
            alert( "An unknown error occurred." )
            break;
    }
}


//start manipulating the DOM
$(document).ready( function(){

    //materialize initializations
    $('.tabs').tabs(); // for using tabs
    $('.modal').modal(); //for using modals
    $('.dropdown-trigger').dropdown(); //for dropdowns

    //grab DOM element to insert the map
    var adminMap = $('#adminMap');
    adminMap.css( { 'height':'600px', 'width':'100%' } );

    //create google map
    adminGoogleMap = createMap( adminMap[0] );

    //creates it for centering all the markers
    bound = new google.maps.LatLngBounds(); //bound is global

    //get current location and shows on map
    getLocation( adminGoogleMap );

    //Registering onclick event for adding user
    $( addUserBtnId ).click( addUserBtnClick );

    //Registering onclick event for adding ticket
    $( addTicketBtnId ).click( addTicketBtnClick );

    //Show the users in a table
    fbPtrDb.ref('users/').on( "child_added", function( snapshot ) {
        console.log( 'users.child_added: ' + snapshot.val().userName );

        var name = snapshot.val().userName;
        var title = snapshot.val().userTitle;
        var make = snapshot.val().userCar.make;
        var model = snapshot.val().userCar.model;
        var tag = snapshot.val().userCar.tag;

        var newRow = $('<tr>').appendTo( $( tbUsers ) );
        $('<td>').text( name ).appendTo( newRow );
        $('<td>').text( title ).appendTo( newRow );
        $('<td>').text( make ).appendTo( newRow );
        $('<td>').text( model ).appendTo( newRow );
        $('<td>').text( tag ).appendTo( newRow );

    } );

    //Show the jobsites in map
    fbPtrDb.ref('places/').on( "child_added", function( snapshot ) {
        console.log( 'Place name = ' + snapshot.val().placeName + '('+ snapshot.val().placeCoordinates.lat +')');

        //adding marker
        var latlon = new google.maps.LatLng( snapshot.val().placeCoordinates.lat, snapshot.val().placeCoordinates.long );
        var marker = new google.maps.Marker({
            position: latlon,
            //map: adminGoogleMap,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            title: snapshot.val().placeName,
            animation: google.maps.Animation.DROP
        });

        markers.push( marker );


    });


});