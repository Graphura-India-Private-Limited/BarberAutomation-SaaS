import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.warn('Socket disconnected');
    });
  }
  return socket;
};

export const sendEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected, cannot send event:', event);
  }
};

export const listenEvent = (event, callback) => {
  if (!socket) connectSocket();
  if (socket) {
    socket.on(event, callback);
  }
};

export const removeEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const getSocket = () => socket;
