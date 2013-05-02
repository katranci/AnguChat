'use strict';

/* Directives */


angular.module('AnguChat.directives', []).
	directive('messages', ['DOMCache', '$window', function(DOMCache, $window) {

		var directiveDefinitionObject = {
			restrict: 'E',
			transclude: true,
			replace: true,
			template:
				'<div id="messagesWindow">' +
					'<ol ng-transclude>' +
					'</ol>' +
				'</div>',
			compile: function() {

				DOMCache.put('messagesWindow', document.getElementById('messagesWindow'));

				angular.element($window).bind('resize', function() {
					DOMCache.get('messagesWindow').scrollTop = DOMCache.get('messagesWindow').scrollHeight;
				});
				
				return function(scope, element, attrs) {
					scope.$watch('messages.length', function(newValue, oldValue) {
						scope.$evalAsync(function() {
							DOMCache.get('messagesWindow').scrollTop = DOMCache.get('messagesWindow').scrollHeight;
						});
					});
				}
			}
		}

		return directiveDefinitionObject;
	}]).
	directive('message', function() {

		var directiveDefinitionObject = {
			require: '?messages',
			restrict: 'E',
			transclude: true,
			replace: true,
			template:
				'<li ng-transclude>{{message.time}}' + 
					'<span>[{{time}}]</span> ' + 
					'<span>&lt;{{sender}}&gt;</span> ' +
				'</li>',
			scope: {
				time: '@time',
				sender: '@sender'
			}
		}

		return directiveDefinitionObject;
	}).
	directive('users', function() {

		var directiveDefinitionObject = {
			restrict: 'E',
			transclude: true,
			replace: true,
			template: 
				'<div id="usersWindow">' +
                	'<ul ng-transclude>' +
                	'</ul>' +
                '</div>'
		}

		return directiveDefinitionObject;
	}).
	directive('user', function($compile) {

		var directiveDefinitionObject = {
			require: '?users',
			restrict: 'E',
			transclude: false,
			replace: true,
			template:
				'<li><span class="nickname">{{user.nickname}}</span></li>',
			link: function(scope, element, attrs) {
				attrs.$observe('isLoggedInUser', function(value) {
					if (value == 'true') {
						var logoutElement = $compile('<a ng-click="logout()" class="logout" title="Log out"></a>')(scope);
						element.append(logoutElement);
					}
				});
			}
		}

		return directiveDefinitionObject;
	});