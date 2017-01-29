var myApp = angular.module('myApp', ['ngRoute']);


myApp.controller('AppCtrl', ['$scope', '$http','$window','$rootScope', function($scope, $http,$window,$rootScope) {

    console.log("Hello World from Controller");

    var refresh = function() {
        $http.get('/consumer/consumer').success(function(response) {
            console.log("I got the data I requested");
            $scope.consumerlist = response;
            $scope.consumer = "";
        });
    };

    refresh();

    $scope.addConsumer = function() {
        console.log($scope.consumer);
        $http.post('/consumer', $scope.consumer).success(function(response) {
            console.log(response);
            refresh();
        });
    };

    $scope.remove = function(id) {
        console.log(id);
        $http.delete('/consumer/' + id).success(function(response) {
            refresh();
        });
    };

    $scope.edit = function(id) {
        console.log(id);
        $http.get('/consumer/' + id).success(function(response) {
            $scope.consumer = response;
        });
    };

    $scope.update = function() {
        console.log($scope.consumer._id);
        console.log($scope.consumer);
        $http.put('/consumer/' + $scope.consumer._id, $scope.consumer).success(function(response) {

            refresh();
        })
    };

    $scope.deselect = function() {
        $scope.consumer = "";
    }

    //Get Transactions
    var transactionGet = function() {
        console.log("Hello World from Transaction");
        var username=$window.sessionStorage.username;
        $http.get('/consumer/transaction/'+username).success(function(response) {
            console.log("I got the transactions I requested");
            $scope.transactionlist = response;
            $scope.transaction = "";
        });
    };
    transactionGet();

    //Get Sensors
    var sensorGet = function() {
        console.log("Hello World from Transaction");
        $http.get('/consumer/sensor').success(function(response) {
            console.log("I got the transactions I requested");
            $scope.sensorlist = response;
            $scope.sensor = "";
        });
    };
    sensorGet();

    var getCity = function(){
        $http.get('/cities').success(function(response){
            $scope.citylist = response;
        });
    }
    getCity();

    var getCountry = function(){
        $http.get('/countries').success(function(response){
            $scope.countrylist = response;
        });
    }
    getCountry();

    var getState = function(){
        $http.get('/states').success(function(response){
            $scope.statelist = response;
        });
    }
    getState();


    // Add Sensor to Cart
    $scope.addSensorCart = function(sensor) {
        console.log(sensor);
        $http.post('/consumer/cart', sensor).success(function(response) {
            console.log(response);
        });
        $window.alert('Product Added to Cart Successfully..!!');
    };

    //Get Cart
    var cartGet = function() {
        console.log("Hello World from Transaction");
        var username=$window.sessionStorage.username;
        $http.get('/consumer/cart/'+username).success(function(response) {
            console.log("I got the transactions I requested");
            $scope.cartlist = response;
            $scope.cart = "";
        });
    };
    cartGet();

    //Delete Cart
    $scope.deleteCart = function(id) {
        console.log(id);
        $http.delete('/consumer/cart/' + id).success(function(response) {
            cartGet();
        });
    };

    //Cart Count
    var cartCount = function() {
        console.log("Hello World from Cart Count");
        var username=$window.sessionStorage.username;
        $http.get('/consumer/carttotal/'+username).success(function(response) {
            console.log("Inside Cart Count "+response);
            $scope.totalCart = response;
        });
    };
    cartCount();
}]);


