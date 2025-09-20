const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocket = (io) => {
  // Authentication middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Join driver to tracking rooms if applicable
    if (socket.userRole === 'driver') {
      socket.join('drivers');
    }

    // Join admin to admin room
    if (socket.userRole === 'admin' || socket.userRole === 'superadmin' || socket.userRole === 'moderator') {
      socket.join('admins');
    }

    // Handle joining cargo room for tracking
    socket.on('joinCargoRoom', (cargoId) => {
      socket.join(cargoId);
      console.log(`User ${socket.userId} joined cargo room ${cargoId}`);
    });

    // Handle leaving cargo room
    socket.on('leaveCargoRoom', (cargoId) => {
      socket.leave(cargoId);
      console.log(`User ${socket.userId} left cargo room ${cargoId}`);
    });

    // Handle chat messages
    socket.on('sendMessage', async (data) => {
      try {
        // In a real application, you would save the message to the database here
        // and then broadcast it to the appropriate room

        const { chatId, content } = data;
        
        // Broadcast to the chat room
        socket.to(chatId).emit('newMessage', {
          chatId,
          message: {
            content,
            sender: socket.userId,
            timestamp: new Date()
          }
        });
      } catch (error) {
        console.error('Socket send message error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = setupSocket;