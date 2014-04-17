var socket = io.connect('/');


socket.on('connected', function(){
  console.log("connected");
});
