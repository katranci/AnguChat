'use strict';

function socketMock() {

	this.clientListeningEvents = [];

	this.on = function(event, callback) {
		this.clientListeningEvents[event] = callback;
	}

	this.emit = function(event, data) {
		return;
	}

	this.listAllUsers = function(users) {
		this.clientListeningEvents['listAllUsers'](users);
	}

	this.displayNewUser = function(user) {
		this.clientListeningEvents['displayNewUser'](user);
	}

	this.publishNewMessage = function(message) {
		this.clientListeningEvents['publishNewMessage'](message);
	}

	this.userDisconnected = function(user) {
		this.clientListeningEvents['userDisconnected'](user);
	}
}

describe('controllers', function() {

	describe('AnguChatCtrl', function() {

		var scope;
		var socket;

		beforeEach(module('AnguChat.controllers'));

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			socket = new socketMock();
			var ctrl = $controller('AnguChatCtrl', {$scope: scope, socket: socket});
		}));

		it('should create an empty list of users', function() {
			expect(scope.users.length).toBe(0);
		});

		it('should create an empty list of messages', function() {
			expect(scope.messages.length).toBe(0);
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

		it('should show the login screen when the user disconnects', function() {
			var user = {id: Date.now(), nickname: 'Jasmine'};
			var disconnectedUser = user;

			scope.user = user;

			socket.userDisconnected(disconnectedUser);
			expect(scope.loginWindowStatus).toBe('visible');
		});

		it('shouldn\'t show the login screen when a user disconnects', function() {
			var user = {id: Date.now(), nickname: 'Jasmine'};
			var disconnectedUser = {id: Date.now()+1, nickname: 'Jasmine2'};

			scope.user = user;
			scope.loginWindowStatus = 'hidden';

			socket.userDisconnected(disconnectedUser);
			expect(scope.loginWindowStatus).not.toBe('visible');
		});
	});

});