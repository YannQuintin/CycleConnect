import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketIO = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.userId = (user._id as any).toString();
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected to socket`);

    // Join ride chat room
    socket.on('join-ride', (rideId: string) => {
      socket.join(`ride-${rideId}`);
      console.log(`User ${socket.userId} joined ride ${rideId}`);
    });

    // Leave ride chat room
    socket.on('leave-ride', (rideId: string) => {
      socket.leave(`ride-${rideId}`);
      console.log(`User ${socket.userId} left ride ${rideId}`);
    });

    // Send message to ride chat
    socket.on('send-message', async (data: {
      rideId: string;
      content: string;
      type: 'text' | 'location';
      metadata?: any;
    }) => {
      try {
        // Create and save message to database
        const message = new Message({
          rideId: data.rideId,
          sender: socket.userId,
          content: data.content,
          type: data.type,
          metadata: data.metadata
        });

        await message.save();
        await message.populate('sender', 'profile.firstName profile.lastName profile.profileImage');

        // Broadcast to ride participants
        io.to(`ride-${data.rideId}`).emit('new-message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Live location updates during ride
    socket.on('location-update', (data: {
      rideId: string;
      coordinates: [number, number];
    }) => {
      // Broadcast location to other ride participants (not sender)
      socket.to(`ride-${data.rideId}`).emit('participant-location', {
        userId: socket.userId,
        coordinates: data.coordinates,
        timestamp: new Date()
      });
    });

    // Ride status updates
    socket.on('ride-status-update', (data: {
      rideId: string;
      status: string;
      message?: string;
    }) => {
      // Broadcast status change to all ride participants
      io.to(`ride-${data.rideId}`).emit('ride-status-changed', {
        rideId: data.rideId,
        status: data.status,
        message: data.message,
        timestamp: new Date(),
        updatedBy: socket.userId
      });
    });

    // User joins ride (real-time notification)
    socket.on('user-joined-ride', (data: {
      rideId: string;
      userId: string;
      userName: string;
    }) => {
      socket.to(`ride-${data.rideId}`).emit('participant-joined', {
        userId: data.userId,
        userName: data.userName,
        timestamp: new Date()
      });
    });

    // User leaves ride (real-time notification)
    socket.on('user-left-ride', (data: {
      rideId: string;
      userId: string;
      userName: string;
    }) => {
      socket.to(`ride-${data.rideId}`).emit('participant-left', {
        userId: data.userId,
        userName: data.userName,
        timestamp: new Date()
      });
    });

    // Emergency alert
    socket.on('emergency-alert', (data: {
      rideId: string;
      location: [number, number];
      message?: string;
    }) => {
      // Broadcast emergency to all ride participants
      io.to(`ride-${data.rideId}`).emit('emergency-alert', {
        userId: socket.userId,
        location: data.location,
        message: data.message,
        timestamp: new Date()
      });
    });

    // Mark messages as read
    socket.on('mark-messages-read', async (data: {
      rideId: string;
      messageIds: string[];
    }) => {
      try {
        await Message.updateMany(
          { 
            _id: { $in: data.messageIds },
            rideId: data.rideId
          },
          {
            $addToSet: {
              readBy: {
                user: socket.userId,
                readAt: new Date()
              }
            }
          }
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { rideId: string }) => {
      socket.to(`ride-${data.rideId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data: { rideId: string }) => {
      socket.to(`ride-${data.rideId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from socket`);
    });
  });
};
