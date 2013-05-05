'use strict';

/* Controllers */

angular.module('AnguChat.controllers', []).
	controller('AnguChatCtrl', ['$scope', 'socket', 'modalDialog', function($scope, socket, modalDialog) {

		$scope.users = [];
		$scope.messages = [];
		$scope.loggedInUser;
		$scope.isReturningUser;

		socket.on('listAllUsers', function(users) {
			$scope.users = users;
		});

		socket.on('displayNewUser', function(user) {
			$scope.users.push(user);
		});

		socket.on('publishNewMessage', function(message) {
			$scope.messages.push(message);
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
			$scope.isReturningUser = false;
			
			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome to AnguChat ' + $scope.loggedInUser.nickname + '!'});

			socket.emit('newUser', $scope.loggedInUser);
		}

		$scope.logout = function() {
			if (modalDialog.confirm('Are you sure you want to log out?')) {

				var upToDateUsers = [];
				angular.forEach($scope.users, function(user) {
					if (user.id != $scope.loggedInUser.id) {
						upToDateUsers.push(user);
					}
				});
				$scope.users = upToDateUsers;

				delete localStorage.user;
				delete $scope.loggedInUser;
				
				socket.disconnect();
			}
		}

		if (localStorage.user) {
			$scope.loggedInUser = JSON.parse(localStorage.user);
			$scope.isReturningUser = true;

			socket.emit('existingUser', $scope.loggedInUser);

			$scope.messages.push({
				time: Date.now(),
				sender: 'bot',
				text: 'Welcome back ' + $scope.loggedInUser.nickname + '!'});
		}
	}]);