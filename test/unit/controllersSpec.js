'use strict';

describe('controllers', function() {

	describe('AnguChatCtrl', function() {

		var scope;
		var socket;
		var modalDialog;

		beforeEach(function() {
			delete localStorage.user;
		});

		beforeEach(module('AnguChat.controllers'));

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			socket = new socketMock();
			modalDialog = new modalDialogMock();
			var ctrl = $controller('AnguChatCtrl', {$scope: scope, socket: socket, modalDialog: modalDialog});
		}));

		it('should create an empty list of users', function() {
			expect(scope.users.length).toBe(0);
		});

		it('should create an empty list of messages', function() {
			expect(scope.messages.length).toBe(0);
		});

		it('should declare the loggedInUser model', function() {
			expect(scope.loggedInUser).toBeUndefined();
		});

		it('should declare the isReturningUser model', function() {
			expect(scope.isReturningUser).toBeUndefined();
		});

		it('should listen to "listAllUsers" event', function() {
			var users = [{id: Date.now(), nickname: 'Jasmine'}];
			socket.listAllUsers(users);
			expect(scope.users).toEqual(users);
		});

		it('should listen to "displayNewUser" event', function() {
			var user = {id: Date.now(), nickname: 'Jasmine'}
			socket.displayNewUser(user);
			expect(scope.users.pop()).toEqual(user);
		});

		it('should listen to "publishNewMessage" event', function() {
			var message = {
				time: Date.now(),
				sender: 'Jasmine',
				text: 'A message'};
			socket.publishNewMessage(message);
			expect(scope.messages.pop()).toEqual(message);
		});

		describe('On login', function() {
			
			var nickname;

			beforeEach(function() {
				nickname = 'Jasmine';
				scope.nickname = nickname;
				scope.login();
			});

			it('should set the loggedInUser model', function() {				
				expect(scope.loggedInUser.nickname).toBe(nickname);
			});

			it('should save the user to the localStorage', function() {
				expect(localStorage.user).toBeDefined();
				expect(JSON.parse(localStorage.user).nickname).toBe(nickname);
			});

			it('should set isReturningUser model to false', function() {
				expect(scope.isReturningUser).toBe(false);
			});

			it('should create a welcome message', function() {
				expect(scope.messages.length).toBe(1);
				var lastMessage = scope.messages.pop();
				expect(lastMessage.sender).toBe('bot');
				expect(lastMessage.text).toBe('Welcome to AnguChat ' + nickname + '!');
			});

			it('should let the other users know', function() {
				expect(socket.clientEmittedData.newUser).toBeDefined();
				expect(socket.clientEmittedData.newUser.nickname).toBe(nickname);
			});
		});

		describe('On returning user', function() {

			var nickname;

			beforeEach(function() {
				nickname = 'Jasmine';
				scope.nickname = nickname;
				scope.login();
			});

			beforeEach(inject(function($controller) {
				var ctrl = $controller('AnguChatCtrl', {$scope: scope, socket: socket, modalDialog: modalDialog});
			}));

			it('should set the loggedInUser model from localStorage', function() {
				expect(scope.loggedInUser.nickname).toBe(nickname);
			});

			it('should set the isReturningUser to true', function() {
				expect(scope.isReturningUser).toBe(true);
			});

			it('should let the other users know', function() {
				expect(socket.clientEmittedData.existingUser).toBeDefined();
				expect(socket.clientEmittedData.existingUser.nickname).toBe(nickname);
			});

			it('should create a welcome back message', function() {
				expect(scope.messages.length).toBe(1);
				var lastMessage = scope.messages.pop();
				expect(lastMessage.sender).toBe('bot');
				expect(lastMessage.text).toBe('Welcome back ' + nickname + '!');
			});

			it('should be able to logout', function() {
				modalDialog.confirmTrue();

				scope.logout();
				expect(localStorage.user).toBeUndefined();
				expect(scope.loggedInUser).toBeUndefined();
			});

			it('shouldn\'t be logged out if the user hit cancel', function() {
				modalDialog.confirmFalse();

				scope.logout();
				expect(localStorage.user).toBeDefined();
				expect(scope.loggedInUser).toBeDefined();
			});
		});
	});
});