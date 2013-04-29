'use strict';

/* Controllers */

angular.module('AnguChat.controllers', []).
	controller('AnguChatCtrl', ['$scope', 'socket', '$timeout', '$window', 'DOMCache', function($scope, socket, $timeout, $window, DOMCache) {

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
			if (user.id == $scope.user.id) {
				$scope.loginWindowStatus = 'visible';
			}
		});

		$scope.sendNewMessage = function() {
			var message = {
				time: Date.now(),
				sender: $scope.user.nickname,
				text: $scope.newMessage};

			socket.emit('newMessage', message);

			$scope.messages.push(message);
			$scope.newMessage = '';
		}

		$scope.login = function() {

			$scope.user = {id: Date.now(), nickname: $scope.nickname};
			localStorage.user = JSON.stringify($scope.user);
			
			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome to AnguChat ' + $scope.user.nickname + '!'});

			socket.emit('newUser', $scope.user);

			$scope.loginWindowStatus = 'hidden';
			document.getElementById('newMessage').focus();
		}

		if (localStorage.user) {
			$scope.user = JSON.parse(localStorage.user);

			socket.emit('existingUser', $scope.user);

			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome back ' + $scope.user.nickname + '!'});
		} else {
			$scope.loginWindowStatus = 'visible';
		}
	}]);