'use strict';

/* Controllers */

angular.module('AnguChat.controllers', []).
	controller('AnguChatCtrl', ['$scope', 'socket', function($scope, socket) {

		$scope.users = [];
		$scope.messages = [];

		socket.on('listAllUsers', function(users) {
			$scope.users = users;
		});

		socket.on('displayNewUser', function(user) {
			$scope.users.push(user);
		});

		socket.on('publishNewMessage', function(message) {
			$scope.messages.push(message);
		});

		socket.on('userDisconnected', function(user) {
			if (user.id == $scope.loggedInUser.id) {
				$scope.loginWindowStatus = 'visible';
			}
		});

		$scope.sendNewMessage = function() {
			var message = {
				time: Date.now(),
				sender: $scope.loggedInUser.nickname,
				text: $scope.newMessage};

			socket.emit('newMessage', message);

			$scope.messages.push(message);
			$scope.newMessage = '';
		}

		$scope.login = function() {

			socket.connect();
			
			$scope.loggedInUser = {id: Date.now(), nickname: $scope.nickname};
			localStorage.user = JSON.stringify($scope.loggedInUser);
			
			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome to AnguChat ' + $scope.loggedInUser.nickname + '!'});

			socket.emit('newUser', $scope.loggedInUser);

			$scope.loginWindowStatus = 'hidden';
		}

		$scope.logout = function() {
			if (confirm('Are you sure you want to log out?')) {

				var upToDateUsers = [];
				angular.forEach($scope.users, function(user) {
					if (user.id != $scope.loggedInUser.id) {
						upToDateUsers.push(user);
					}
				});
				$scope.users = upToDateUsers;

				delete localStorage.user;
				
				socket.disconnect();
				$scope.loginWindowStatus = 'visible';
			}
		}

		if (localStorage.user) {
			$scope.loggedInUser = JSON.parse(localStorage.user);

			socket.emit('existingUser', $scope.loggedInUser);

			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome back ' + $scope.loggedInUser.nickname + '!'});
		} else {
			$scope.loginWindowStatus = 'visible';
		}
	}]);