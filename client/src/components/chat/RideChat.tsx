import React, { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../../config/api';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Chip,
  Badge
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  };
  rideId: string;
  timestamp: string;
}

interface RideChatProps {
  rideId: string;
  isParticipant: boolean;
}

const RideChat: React.FC<RideChatProps> = ({ rideId, isParticipant }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isParticipant || !user) return;

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const socketInstance = io(API_CONFIG.SOCKET_URL, {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      socketInstance.emit('join-ride', rideId);
    });

    socketInstance.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      if (!isExpanded && message.sender._id !== user._id) {
        setUnreadCount(prev => prev + 1);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    // Fetch existing messages
    fetchMessages();

    return () => {
      if (socketInstance) {
        socketInstance.emit('leave-ride', rideId);
        socketInstance.disconnect();
      }
    };
  }, [rideId, isParticipant, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded) {
      setUnreadCount(0);
    }
  }, [isExpanded]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rides/${rideId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    socket.emit('send-message', {
      rideId,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isParticipant) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
        <ChatIcon sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Join this ride to access the chat
        </Typography>
      </Paper>
    );
  }

  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
               onClick={() => setIsExpanded(!isExpanded)}>
            <ChatIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Ride Chat</Typography>
            {unreadCount > 0 && (
              <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }}>
                <Box />
              </Badge>
            )}
            <Box sx={{ flex: 1 }} />
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        }
        sx={{ pb: 0 }}
      />
      
      {isExpanded && (
        <CardContent sx={{ pt: 1 }}>
          {/* Messages */}
          <Box
            sx={{
              height: 300,
              overflowY: 'auto',
              mb: 2,
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 1,
              p: 1
            }}
          >
            <List dense>
              {messages.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No messages yet"
                    secondary="Be the first to say hello!"
                    sx={{ textAlign: 'center' }}
                  />
                </ListItem>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender._id === user?._id;
                  return (
                    <ListItem
                      key={message._id}
                      sx={{
                        flexDirection: isOwn ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        mb: 1
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: isOwn ? 0 : 56, ml: isOwn ? 1 : 0, mr: isOwn ? 0 : 1 }}>
                        <Avatar
                          src={message.sender.profile.profileImage}
                          sx={{ width: 32, height: 32 }}
                        >
                          {message.sender.profile.firstName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Paper
                          sx={{
                            p: 1,
                            bgcolor: isOwn ? 'primary.light' : 'grey.100',
                            color: isOwn ? 'white' : 'text.primary',
                            borderRadius: 2,
                            maxWidth: '80%',
                            ml: isOwn ? 'auto' : 0,
                            mr: isOwn ? 0 : 'auto'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                        </Paper>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: isOwn ? 'right' : 'left',
                            mt: 0.5
                          }}
                        >
                          {!isOwn && `${message.sender.profile.firstName} • `}
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                })
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>

          {/* Connection Status */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Chip
              label={socket?.connected ? 'Connected' : 'Connecting...'}
              color={socket?.connected ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default RideChat;
