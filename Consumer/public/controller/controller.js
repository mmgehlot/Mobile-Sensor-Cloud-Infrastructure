var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('AppCtrl', ['$scope', '$http','$window','$rootScope', function($scope, $http,$window,$rootScope) {

    console.log("Hello World from Controller");
    var refresh = function() {
        $http.get('/mysql/transaction').success(function(response) {
            console.log("I got the data I requested");
            $scope.consumerlist = response;
            $scope.consumer = "";
        });
    };

    refresh();

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
        $http.get('/mysql/transaction/'+username).success(function(response) {
            console.log("I got the transactions I requested");
            $scope.transactionlist = response;
            $scope.transaction = "";
        });
    };
    transactionGet();

    //Insert Transactions from Cart on Checkout
    $scope.insertTransactions = function(cartlist) {
        console.log(cartlist);
        var username=$window.sessionStorage.username;
        $http.post('/consumer/transaction', cartlist).success(function(response) {
            console.log('Cart List'+response);
        });
        transactionGet();
        $window.alert('All transactions added..!!');
        $window.location.reload();

    };

    //Delete Transactions
    $scope.deactivateSensor = function(id) {
        console.log(id);
        $http.delete('/consumer/transaction/' + id).success(function(response) {
            transactionGet();
        });
    };

    //Get Sensors
    var sensorGet = function() {
        console.log("Hello World from Transaction");
        $http.get('/mysql/sensor').success(function(response) {
            console.log("I got the transactions I requested");
            $scope.sensorlist = response;
            $scope.sensor = "";
        });
    };
    sensorGet();

    // Add Sensor to Cart
    $scope.addSensorCart = function(sensor) {
        console.log(sensor);
        var username=$window.sessionStorage.username;
        $http.post('/mysql/cart/'+username, sensor).success(function(response) {
            console.log(response);
        });
        $window.alert('Product Added to Cart Successfully..!!');
    };

    //Get Cart
    var cartGet = function() {
        console.log("Hello World from Cart");
        var username=$window.sessionStorage.username;
        $http.get('/mysql/cart/'+username).success(function(response) {
            console.log("I got the transactions I requested");
            $scope.cart = "";
            var total=0;

            for(var i=0; i<response.length; i++)
            {
                //response[i].sensorPrice=(response[i].sensorPrice).substr(1);
                total=total + parseFloat(response[i].sensorPrice);
            }
            $scope.cartlist=response;
            console.log(total);
            $scope.total=total;
            $scope.vat = (parseFloat(total) * 8.5) /100;
            $scope.totalWithTax = parseFloat($scope.vat) + parseInt($scope.total) + 2;

        });
    };
    cartGet();

    //Delete Cart
    $scope.deleteCart = function(id) {
        console.log(id);
        $http.delete('/mysql/cart/' + id).success(function(response) {
            cartGet();
        });
    };

    //Cart Count
    var cartCount = function() {
        console.log("Hello World from Cart Count");
        var username=$window.sessionStorage.username;
        $http.get('/mysql/carttotal/'+username).success(function(response) {
            console.log("Inside Cart Count "+response);
            $scope.totalCart = response;
        });
    };
    cartCount();

    //cancel button
    $scope.cancel = function()
    {
        $window.location.href = '/dashboard.html';
    }


    //Get Consumer Details
    var consumerDetails = function() {
        console.log("Hello World from Consumer Details");
        var username=$window.sessionStorage.username;
        $http.get('/consumer/consumer/'+username).success(function(response) {
            console.log("Inside Consumer Details "+response);
            $scope.consumerName = response.custName;
            $scope.consumerEmail = response.custEmail;
            $scope.consumerOrganization = response.organizationName;
            $scope.consumerDateRegistration = response.dateOfRegistration;
            $scope.consumerContact = response.contactNumber;

        });
    };
    //consumerDetails();

    //Get Sensor Counts
    var motionCount = function() {
        console.log('motionCount');
        var username=$window.sessionStorage.username;
        $http.get('/mysql/transaction/motion/'+username, {
            cache: false
        }).success(function(response) {
            console.log("Inside Motion Sensor count "+response);
            $scope.motionSensor = response;
        });
    };
    motionCount();

    //Get Sensor Counts
    var tempCount = function() {
        console.log('tempCount');
        var username=$window.sessionStorage.username;
        $http.get('/mysql/transaction/temperature/'+username, {
            cache: false
        }).success(function(response) {
            console.log("Inside Temperature Sensor count "+response);
            $scope.tempSensor = response;
        });
    };
    tempCount();

    //Get Sensor Counts and Total Sensor Count
    var humidCount = function() {
        console.log('humidCount');
        var username=$window.sessionStorage.username;
        $http.get('/mysql/transaction/humidity/'+username, {
            cache: false
        }).success(function(response) {
            console.log("Inside Humidity Sensor count "+response);
            $scope.humidSensor = response;
            $scope.totalSensor=$scope.motionSensor+$scope.tempSensor+$scope.humidSensor;
        });
    };
     humidCount();



}]);





