var app = angular.module("demoapp", ["firebase"]);

app.config(function() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyB_YFKRlDMjcIebP6jQpiKMFU1xYOnUkMk",
    authDomain: "mysmarthome-9a330.firebaseapp.com",
    databaseURL: "https://mysmarthome-9a330.firebaseio.com",
    projectId: "mysmarthome-9a330",
    storageBucket: "mysmarthome-9a330.appspot.com",
    messagingSenderId: "77335671922",
    appId: "1:77335671922:web:f38f5818a3b03ded14beeb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
});

app.controller("myCtrl", function($scope, $timeout, $http) {

// $scope.read_once_time = firebase.database().ref('SENSOR_NODE/SerialNumber').once('value').then(function(snapshot) {
//     console.log("once time snapshot: ",snapshot.val());
//     $scope.realtime_value = snapshot.val();
// });

// $scope.on_value_event = firebase.database().ref('SENSOR_NODE/SerialNumber').on('value', function(snapshot) {
//     console.log("On value event snapshot: ",snapshot.val());
//     $scope.realtime_value = snapshot.val();
//     return  snapshot.val();
// });
  
  $scope.products = ["Milk", "Bread", "Cheese"];
  
  $scope.chart_time = [];
    $scope.chart_data = [];
    $scope.temperature_chart;
    $scope.showchartloading = true;
    $scope.get_data = function () {
        console.log("Call get data !"); 
      //   Swal.fire({
      //     title: 'Loading...',
      //     html: 'Waiting for data loading...',
      //     timer: 1000
      //       });
        $scope.showchartloading = true;
        $http({
          method: "GET",
          url: "http://lethanhtrieu.servehttp.com:1122/nodes/getChartToday",
        }).then(
          function successCallback(response) {
            // this callback will be called asynchronously
            console.log(response.data);
            $scope.data_get = response;
            angular.forEach(response.data.payload, function (value, key) {
              //  console.log(value.createdAt + " " + value.payload[0].temperature);
              $scope.chart_time.push(moment(new Date(value.createdAt)).format('LT'));
              $scope.chart_data.push(value.payload[0].temperature);
            });
  
            $scope.temperature_chart.series[0].setData($scope.chart_data);
            $scope.temperature_chart.xAxis[0].setCategories($scope.chart_time);
  
            $scope.showchartloading = false;
  
            // when the response is available
          },
          function errorCallback(error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(error);
          }
        );
      };



   // Simple GET request example:
   $scope.plot_temperature_charts = function()
   {
       $scope.temperature_chart = new Highcharts.Chart({

           chart: {
               renderTo: 'id_temperature_chart',
               type: 'spline',
               zoomType: 'xy',
               panning: true,
               panKey: 'shift'
           },
           animation: true,
           title: {
               text: 'Realtime Temperature'
           },
           xAxis: {
               categories: $scope.chart_time
           },
           yAxis: {
               title: {
                   text: '°C'
               }
           },
           legend: {
               layout: 'vertical',
               align: 'right',
               verticalAlign: 'middle'
           },
           loading: {
               hideDuration: 1000,
               showDuration: 1000
           },

           series: [{
               name: 'Temperature',
               data: $scope.chart_data,
               color: '#ff9019'
           }],
           responsive: {
               rules: [{
                   condition: {
                       maxWidth: 500
                   },
                   chartOptions: {
                       legend: {
                           layout: 'horizontal',
                           align: 'center',
                           verticalAlign: 'bottom'
                       }
                   }
               }]
           }

       });
   }; // Temperature charts
  var socket;
  var IpSocket = 'http://lethanhtrieu.servehttp.com:1234';

  if (socket == null)
    socket = io.connect(IpSocket);
  else
    socket.connect();

  socket.on('connect', function(){
    console.log("Connected to socketio server !");

  //   socket.emit('chat message', 'can you hear me?');
  //   setInterval(function(){
  //     console.log("Send emit message !");
  //     socket.emit('chat message', { data: 'Data from client' });
  // },2000);

  socket.on('server message', (data) => {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  
});

 
socket.on('event', function(data){
  console.log("Received data from socketio server, data: ", data);      
});


socket.on('disconnect', function(){
  console.log("Disconnected to socketio server !");
});


});

app.controller("firebaseCtrl", ["$scope", "$firebaseObject",
  function($scope, $firebaseObject) {
     var ref = firebase.database().ref("SENSOR_NODE/SerialNumber");

     var obj = $firebaseObject(ref);

     // to take an action after the data loads, use the $loaded() promise
     obj.$loaded().then(function() {
        console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

       // To iterate the key/value pairs of the object, use angular.forEach()
       angular.forEach(obj, function(value, key) {
          console.log(key, value);
       });
     });

     // To make the data available in the DOM, assign it to $scope
     $scope.on_value_event = obj;

     // For three-way data bindings, bind it to the scope instead
     obj.$bindTo($scope, "on_value_event");
  }
]);

app.controller("MyAuthCtrl", ["$scope", "$firebaseAuth","$firebaseObject",
  function($scope, $firebaseObject, $firebaseAuth) {
    $scope.light_status = true;
    var ref = firebase.database().ref("SENSOR_NODE/TEST");
    var obj = $firebaseObject(ref);
    obj.foo = "bar";
    obj.$save().then(function(ref) {
      ref.key === obj.$id; // true
    }, function(error) {
      console.log("Error:", error);
    });

    firebase.auth().signInWithEmailAndPassword("lethanhtrieuk36@gmail.com", "12345678").then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.user.email);

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign-out successful !");
      }).catch(function(error) {
        // An error happened.
        console.log("Sign-out failed !");
      });
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });

  }
]);