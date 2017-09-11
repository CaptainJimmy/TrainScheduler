
$(document).ready(function(){
              	
// variables
var config = {
    apiKey: "AIzaSyB1JRePlCINJ8zqJfi1Wk_ZfoFD45yOLBE",
    authDomain: "train-scheduler-b8c1d.firebaseapp.com",
    databaseURL: "https://train-scheduler-b8c1d.firebaseio.com",
    projectId: "train-scheduler-b8c1d",
    storageBucket: "train-scheduler-b8c1d.appspot.com",
    messagingSenderId: "770445924609"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var currentTime=moment();

//functions
function clockTime(){
var Time=moment().format("HH:mm:ss");
var UnixTime=moment().format("X");
$('#current-time').html(Time);
};

setInterval(clockTime, 1000);

function timeUpdate(){
	database.ref().once('value',function(snapshot){
		snapshot.forEach(function(childSnapshot){
		currentTime=moment().format("X");
		database.ref(childSnapshot.key).update({
			lastupdated: currentTime,});
	});
});
}

setInterval(timeUpdate, 10000);

// listeners
	//on click 

$('#train-add-btn').on('click', function(event){
	  event.preventDefault();
var trainName=$('#train-name').val().trim();
var destination=$('#destination').val().trim();
var departureTime=moment($('#departure-time').val().trim(), "HH:mm").format("X");
var timeAdded=moment().format("X");
var frequency=$('#frequency').val().trim();


//create a new object for DB pushing

var newTrain={
	name: trainName,
	destination: destination,
	time: departureTime,
	lastupdated: timeAdded,
	freq: frequency
	};

console.log(newTrain);

//database push 
database.ref().push(newTrain);
$('#train-name').empty();
$('#destination').empty();
$('#departure-time').empty();
$('#frequency').empty();
});

//listener for a new train added


function rewriteCurrentTrains(childSnapshot){
 var nextTime;
 var trainKey = childSnapshot.key;
 var trainName = childSnapshot.val().name;
 var destination = childSnapshot.val().destination;
 var departureTime = childSnapshot.val().time;
 var frequency = childSnapshot.val().freq;
 var departureTimeConverted = moment.unix(departureTime);


   var timeDifference = moment().diff(moment(departureTimeConverted, 'HH:mm'), 'minutes');
   var timeDifferenceCalc = timeDifference % parseInt(frequency);
   var timeDifferenceTotal = parseInt(frequency) - timeDifferenceCalc;

        if(timeDifferenceTotal >= 0) {
          nextTime = moment().add(timeDifferenceTotal, 'minutes').format('hh:mm A');

        } else {
          nextTime = departureTimeConverted.format('hh:mm A');
          timeDifferenceTotal = Math.abs(timeDifference - 1);
      }


console.log ("trainKey  " +trainKey);
var newRow=$('<tr>');
newRow.addClass(trainKey);
newRow.append($('<td>').text(trainName))
.append($('<td>').text(destination))
.append($('<td>').text(nextTime))
.append($('<td>').text(frequency))
.append($('<td>').text(timeDifferenceTotal))
.append($('<button>').addClass("delete btn btn-sm btn-danger").attr("data-train",trainKey).html($('<i>').addClass('glyphicon glyphicon-remove')));
$('tbody').append(newRow);


}

function CurrentTrainsValueChanged(childSnapshot){
 var nextTime;
 var trainKey = childSnapshot.key;
 var trainName = childSnapshot.val().name;
 var destination = childSnapshot.val().destination;
 var departureTime = childSnapshot.val().time;
 var frequency = childSnapshot.val().freq;
 var departureTimeConverted = moment.unix(departureTime);


   var timeDifference = moment().diff(moment(departureTimeConverted, 'HH:mm'), 'minutes');
   var timeDifferenceCalc = timeDifference % parseInt(frequency);
   var timeDifferenceTotal = parseInt(frequency) - timeDifferenceCalc;

        if(timeDifferenceTotal >= 0) {
          nextTime = moment().add(timeDifferenceTotal, 'minutes').format('hh:mm A');

        } else {
          nextTime = departureTimeConverted.format('hh:mm A');
          timeDifferenceTotal = Math.abs(timeDifference - 1);
      }


console.log ("trainKey  " +trainKey);
$('.'+trainKey).empty();
$('.'+trainKey).html(($('<td>').text(trainName)
.append($('<td>').text(destination))
.append($('<td>').text(nextTime))
.append($('<td>').text(frequency))
.append($('<td>').text(timeDifferenceTotal))
.append($('<button>').addClass("delete btn btn-sm btn-danger").attr("data-train",trainKey).html($('<i>').addClass('glyphicon glyphicon-remove')))));

// var rewriteRow=$('<td>')
// rewriteRow.html(trainName)

//$('.'+trainKey).html(rewriteRow);


}
//listener for train changed
 database.ref().on('child_added',function(childSnapshot){
rewriteCurrentTrains(childSnapshot);
 });

//  database.ref().on('child_changed',function(childSnapshot){
//  console.log("REWRITE CHANGE");
//  CurrentTrainsValueChanged(childSnapshot);
// });

$(document).on('click','.delete', function(event){
console.log("DELETE");
 	var trainKey = $(this).attr('data-train');
 		console.log(trainKey);
      database.ref(trainKey).remove();
      $('.'+ trainKey).remove();
});

});







































