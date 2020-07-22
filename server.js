const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io");
const formatmessage = require('./utils/message');
const {joinuser, curantuser,userleave,roomusers} = require('./utils/users');

const app = express();
app.use(express.static(path.join(__dirname,"public")));
const server = http.createServer(app);
const io = socketio(server); 
const botname = 'chatbot';


//Run when a client connects 
io.on("connection", socket => {
    socket.on('chatjoin', ({username, room}) => {
        const user =joinuser(socket.id,username,room);
        
        socket.join(user.room);
       

        //informer tout les autres utilisateurs (a new user)
        socket.broadcast.to(user.room).emit("message", formatmessage(user.username,`un nouvel utilisateur est connecte`));

        //informer l'utilisateur meme qu'il est connecte
        socket.to(user.room).emit("message", formatmessage(user.username,`${user.username} connects`));

        io.to(user.room).emit('chatroom',{room: user.room, listusers: roomusers(user.room)   });
     console.log(user.room);
     console.log(roomusers(user.room));
    });

    //get a message 
    socket.on("chatmessage", msg => {
        const userc = curantuser(socket.id);
        io.to(userc.room).emit("message", formatmessage(userc.username,msg));
            
    });

    
    //informer tout les utilsateur (a user disconnects) 
    socket.on("disconnect", () => {
        const user = userleave(socket.id);
        if (user) {
            io.to(user.room).emit("message",formatmessage(user.username,`${user.username} disconnects`));
            io.to(user.room).emit('chatroom',{room: user.room, listusers: roomusers(user.room)   }); 
        }
        
    });

});



const PORT = 3000 || process.env.PORT;
server.listen(PORT,() => console.log(`le port ${PORT}`));