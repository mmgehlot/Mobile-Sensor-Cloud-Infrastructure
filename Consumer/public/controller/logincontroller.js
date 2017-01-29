var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('LoginCtrl',['$scope', '$http', '$location', '$window','$rootScope',function($scope, $http, $location, $window, $rootScope) {
    console.log("Hello World from Login Controller");

    $scope.signIn = function () {
        console.log('Inside Login controller');
        var params = {
            username : $scope.username,
            password : $scope.password
        };
        console.log(params);
        $http.post('/register/login', params).success(function(response){
            $rootScope.username=response.username;
            $window.sessionStorage.username=response.username;
            console.log('Rootscope : ' +$rootScope.username);
            $window.location.href = '/dashboard.html';
        })
            .error(function(response){
                console.log(response.message);
                $window.alert(response.message);
            });

        //.error(response => console.log(response.message));

    };

    $scope.signUp = function () {
        console.log('Inside Login controller');
        var params = {
            username : $scope.username1,
            password : $scope.password1,
            custName : $scope.name,
            custEmail : $scope.email
        };
        console.log(params);
        $http.post('/consumer/user', params).success(function(response){
            createUser();
        })
            .error(function(response){
                console.log(response.message);
                $window.alert(response.message);
            });
        //.error(response => console.log(response.message));
    }

    var createUser = function(){
        console.log('Inside Create controller');
        var params2 = {
            username : $scope.username1,
            password : $scope.password1,
            custName : $scope.name,
            custEmail : $scope.email
        };
        $http.post('/consumer/consumer', params2).success(function(response){
            console.log('Rootscope : ' +$rootScope.username);
            $window.location.href = '/index.html';
        })
            .error(function(response){
                console.log(response.message);
                $window.alert(response.message);
            });

        $window.alert('Registration Successful..!!');
    }
}]);