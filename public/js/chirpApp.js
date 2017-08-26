var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {
    $rootScope.authenticated = false;
    $rootScope.currentUser = "";
    $rootScope.userTitle = "";

    $rootScope.signout = function () {
        $http.get('/auth/signout');
        $rootScope.authenticated = false;
        $rootScope.currentUser = "";


    }

});


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authCtrl'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authCtrl'
        })
        .when('/profile', {
        templateUrl: 'profile.html',
        controller: 'mainCtrl'
    });

});



app.factory('postFactory', function ($resource) {

    return $resource('/api/posts/:id');
});



app.controller('mainCtrl', function ($rootScope, $scope, postFactory) {

    $scope.posts = postFactory.query();
    $scope.newPost = {
        created_by: '',
        text: '',
        created_at: ''
    };



    $scope.post = function () {
        $scope.newPost.created_by = $rootScope.currentUser;
        $scope.newPost.created_at = Date.now();
        postFactory.save($scope.newPost, function () {
            $scope.posts = postFactory.query();
            $scope.newPost = {
                created_by: '',
                text: '',
                created_at: ''
            };
        });
    };


    $scope.delete = function (post) {
        postFactory.delete({id: post._id});
        $scope.posts = postFactory.query();
    };
    
    
    
    $scope.goToProfile = function(user){
        $rootScope.userTitle = user;
        console.log($rootScope.userTitle)
    }
    
    

});





app.controller('authCtrl', function ($scope, $http, $rootScope, $location) {
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.error_message = '';

    $scope.login = function () {
        $http.post('/auth/login', $scope.user).then(function (data) {
            if (data.data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.data.message;
            }
        });
    };

    $scope.register = function () {
        $http.post('/auth/signup', $scope.user).then(function (data) {
            if (data.data.state == 'success') {
                console.log(data);
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.data.user.username;
                console.log($rootScope.currentUser)
                //                $location.path('/');
            }
            //            else{
            //                $scope.error_message = data.data.message;
            //            }
        });
    };
});


//app.controller('profileCtrl', function($rootScope){
//    
//    
//});