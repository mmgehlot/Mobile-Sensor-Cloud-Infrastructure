var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('LoginCtrl',['$scope', '$http', '$location', '$window','$rootScope',function($scope, $http, $location, $window, $rootScope) {

    $scope.signIn = function () {
        var params = {
            username : $scope.username,
            password : $scope.password,
            userType : $scope.userType
        };

        $http.post('/register/login', params).success(function(response){
                //$rootScope.username=response.username;
                $window.sessionStorage.username=response.username;
                console.log('Rootscope : ' +$rootScope.username);
                $window.location.href = '/dashboard.html';
        })
            .error(function(response){
                console.log(response.message);
                $window.alert(response.message);
            });
    }

    $scope.signUp = function () {
        var params = {
            fname : $scope.fname,
            lname : $scope.lname,
            username : $scope.username,
            password : $scope.password,
            userType : $scope.userType
        };

        $http.post('/register/login', params).success(function(response){
            //$rootScope.username=response.username;
            $window.sessionStorage.username=response.username;
            console.log('Rootscope : ' +$rootScope.username);
            $window.location.href = '/dashboard.html';
        })
    }
}
]);