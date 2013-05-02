function socketMock() {

	this.clientListeningEvents = {};
	this.clientEmittedData = {};

	this.on = function(event, callback) {
		this.clientListeningEvents[event] = callback;
	}

	this.emit = function(event, data) {
		this.clientEmittedData[event] = data;
	}

	this.connect = function() {}
	this.disconnect = function() {}

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