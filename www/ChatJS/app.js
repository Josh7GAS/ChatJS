var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);
var users = [];

app.listen(3000);
console.log(" The Aplication is in execution...");

function response (req, res) {
	var file = "";
	if(req.url == "/"){
		file = __dirname + '/index.html';
	}else{
		file = __dirname + req.url;
	}
	fs.readFile(file,
		function(err, data){
			if(err){
				res.writeHead(404);
				return res.end("Pages or files not founded");
			}

			res.writeHead(200);
			res.end(data);
		}
		);
}

io.on("connection", function(socket){
	socket.on("enter", function(nick, callback){
		if(!(nick in users)){
			socket.nick = nick;
			users[nick] = socket;

			io.sockets.emit("update users",Object.keys(users));
			io.socket.emit("update messages"," [ " + getActualDate() + " ] " + nick +
				"just entered the room");

			callback(true);
		}else{
			callback(false);
		}
	});

	socket.on("disconnect", function(){
		delete users[socket.nick];
		io.sockets.emit("update users", Object.keys(users));
		io.sockets.emit("update messages", "[ " + getActualDate()+ " ] " + socket.nick
			+ "exit the room");
	});
	
	socket.on("send message", function(message_sended, callback){
		message_sended = "[" + getActualDate() + "]: " + message_sended;

		io.sockets.emit("update messages", message_sended);
		callback()
	});
	
});

function getActualDate(){
	var actualDate = new Date();
	var day  = (actualDate.getDate()<10 ? '0' : '') + actualDate.getDate();
	var month = ((actualDate.getMonth() + 1)<10 ? '0' : '') + (actualDate.getMonth() + 1);
	var year = actualDate.getFullYear();
	var hours = (actualDate.getHours()<10 ? '0' : '') + actualDate.getHours();
	var minute = (actualDate.getMinutes()<10 ? '0' : '') + actualDate.getMinutes();
	var seconds = (actualDate.getSeconds()<10 ? '0' : '') + actualDate.getSeconds();

	var formatDate = day + "/" + month + "/" + year + " " + minute + ":" + seconds;
	return formatDate;
}