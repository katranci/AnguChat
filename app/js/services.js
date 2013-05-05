'use strict';

angular.module('AnguChat.services', []).
	factory('socket', ['$rootScope', function($rootScope) {

		var socket = io.connect('http://localhost:8081');

		return {
			on: function(eventName, callback) {
				socket.on(eventName, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			},
			emit: function(eventName, data, callback) {
				socket.emit(eventName, data, function() {
					console.log(eventName);
					var args = arguments;
					$rootScope.$apply(function() {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},
			connect: function() {
				if (!socket.socket.connected) {
					socket.socket.reconnect();
				}
			},
			disconnect: function() {
				socket.disconnect();
			}
		}
	}]).
	factory('DOMCache', ['$cacheFactory', function($cacheFactory) {
		return $cacheFactory('DOMCache', {});
	}]).
	factory('modalDialog', ['$window', function($window) {
		return {
			confirm: function(message) {
				return $window.confirm(message);
			}
		}
	}]);