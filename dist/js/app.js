// create the module and name it TinkerApp    
var TinkerApp = angular.module('dashboard', ['ngRoute']);  
  
// configure our routes    
TinkerApp.config(function($routeProvider,$locationProvider) {  

    $locationProvider.hashPrefix('');

    $routeProvider  
  
    // route for the home page    
    .when('/', {  
        templateUrl: 'pages/dashboard.html',  
        controller: 'mainController'  
    })  
  
    // route for the about page    
    .when('/about', {  
        templateUrl: 'pages/about.html',  
        controller: 'aboutController'  
    })  
  
    // route for the contact page    
    .when('/contact', {  
        templateUrl: 'pages/contact.html',  
        controller: 'contactController'  
    });  
    
  
});  
  
// create the controller and inject Angular's $scope    
TinkerApp.controller('mainController', function ($scope, $http, $q, $timeout) { 

    // create a message to display in our view    
    $scope.chart_title = 'Real-time room air quality monitoring';  
    $http.get("https://5d8dd342370f02001405c48f.mockapi.io/api/test/v1/sensors") // Load data from MockAPI
        .then(function(response) {
        response.data.sort(function(a, b){return a.createdAt - b.createdAt});
        console.log(response.data);
        var payload = response.data;
    
        const time_series = payload.map(payload => moment(payload.createdAt).format('LT'));
        // console.log(time_series);
        const temperature_series = payload.map(payload => payload.temperature);
        // console.log(temperature_series);
        const humidity_series = payload.map(payload => payload.humidity);
        // console.log(humidity_series);
        const light_series = payload.map(payload => payload.light);
    
        // Chartjs
        var ctx2 = document.getElementById("chart-line").getContext("2d");
    
        var gradientStrokeTem = ctx2.createLinearGradient(0, 230, 0, 50);
        gradientStrokeTem.addColorStop(1, 'rgba(255, 182, 36,0.5)');
        gradientStrokeTem.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStrokeTem.addColorStop(0, 'rgba(255, 182, 36,0)'); //Orange colors
    
        var gradientStrokeHum = ctx2.createLinearGradient(0, 230, 0, 50);
        gradientStrokeHum.addColorStop(1, 'rgba(18, 73, 255,0.5)');
        gradientStrokeHum.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStrokeHum.addColorStop(0, 'rgba(18, 73, 255,0)'); //Blue colors
    
        var gradientStrokeLight = ctx2.createLinearGradient(0, 230, 0, 50);
        gradientStrokeLight.addColorStop(1, 'rgba(8, 252, 126,0.5)');
        gradientStrokeLight.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStrokeLight.addColorStop(0, 'rgba(8, 252, 126,0)'); //Green colors
    
        new Chart(ctx2, {
            type: "line",
            data: {
            // labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            labels: time_series,
            datasets: [{
                label: "Temperature",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: "#f5b342",
                borderWidth: 3,
                backgroundColor: gradientStrokeTem,
                data: temperature_series,
                maxBarThickness: 6,
    
                },
                {
                label: "Humidity",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: "#2478ff",
                borderWidth: 3,
                backgroundColor: gradientStrokeHum,
                data: humidity_series,
                maxBarThickness: 6,
                },
                {
                label: "Light",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: "#08fc7e",
                borderWidth: 3,
                backgroundColor: gradientStrokeLight,
                data: light_series,
                maxBarThickness: 6,
                },
            ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    labels: {
                        fontColor: "white",
                        fontSize: 14
                    }
                },
                tooltips: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                },
                animation: {
                    duration: 2000,
                    xAxis: true,
                    yAxis: true,
    
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            borderDash: [2],
                            borderDashOffset: [2],
                            color: '#dee2e6',
                            zeroLineColor: '#dee2e6',
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [2],
                            drawBorder: false,
                        },
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            beginAtZero: true,
                            padding: 10,
                            fontSize: 11,
                            fontColor: '#adb5bd',
                            lineHeight: 3,
                            fontStyle: 'normal',
                            fontFamily: "Open Sans",
                        },
                        }, ],
                        xAxes: [{
                        gridLines: {
                            zeroLineColor: 'rgba(0,0,0,0)',
                            display: false,
                        },
                        ticks: {
                            padding: 10,
                            fontSize: 11,
                            fontColor: '#adb5bd',
                            lineHeight: 3,
                            fontStyle: 'normal',
                            fontFamily: "Open Sans",
                        }
                    }]
                }
            } // Chart options
        }); // ChartJS
      }); // Get request
    
      //https://5d8dd342370f02001405c48f.mockapi.io/api/test/v1/devices
    $http.get("https://5d8dd342370f02001405c48f.mockapi.io/api/test/v1/devices") 
    .then(function(respone){
        $scope.device_list = respone.data;
        console.log($scope.device_list);
     
        angular.element(document).ready( function () {
            dTable = $('#device_table')
            dTable.DataTable();
        });
    }); 
});  
