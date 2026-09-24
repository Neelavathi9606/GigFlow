import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import {createServer} from 'http';
import { Server } from 'socket.io';

dotenv.config({
  path: './env'
})

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('authenticate', (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

export { io, connectedUsers };

connectDB().then(()=>{
  httpServer.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running at port: ${process.env.PORT}`);
    console.log('Socket.IO server initialized');
  })
}).catch((error)=>{
  console.log("MongoDB connection FAILED!!! ", error);
})