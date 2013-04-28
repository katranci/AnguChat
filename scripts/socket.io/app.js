var app = require('http').createServer(),
	io = require('socket.io').listen(app);

app.listen(8081);

var users = [];

io.sockets.on('connection', function(socket) {

	socket.on('newMessage', function(message) {
		socket.broadcast.emit('publishNewMessage', message);
	});
	
	socket.on('newUser', function(user) {

		socket.set('currentUser', user);

		users.push(user);
		
		socket.emit('listAllUsers', users);

		socket.broadcast.emit('publishNewMessage', {
			time: Date.now(),
			sender: 'bot',
			text: user.nickname + ' has joined'
		});

		socket.broadcast.emit('displayNewUser', user);
	});

	socket.on('existingUser', function(user) {

		socket.set('currentUser', user);

		var found = false;
		for (var i in users) {
			if (users[i].id == user.id) {
				found = true;
				break;
			}
		}

		if (!found) { // user has disconnected and connected again (e.g. page reload)
			users.push(user);

			socket.broadcast.emit('publishNewMessage', {
				time: Date.now(),
				sender: 'bot',
				text: user.nickname + ' has re-joined'
			});
		} else {
			// user opened the application on a new tab
			// do nothing
		}

		io.sockets.emit('listAllUsers', users);
	});

	socket.on('disconnect', function() {

		socket.get('currentUser', function(err, currentUser) {

			if (!currentUser) return;
			
			var upToDateUsers = [];
			for (var i in users) {
				var user = users[i];
				if (user.id != currentUser.id) {
					upToDateUsers.push(user);
				}
			}

			users = upToDateUsers;

			io.sockets.emit('listAllUsers', users);
			io.sockets.emit('publishNewMessage', {
				time: Date.now(),
				sender: 'bot',
				text: currentUser.nickname + ' has left'
			});
			io.sockets.emit('userDisconnected', currentUser);
		});
	});
});