import { Socket } from "socket.io";
import { store } from "./store";

export const sockets: Record<string, Socket> = {};
export const emit = () => {
  Object.values(sockets).forEach(socket => socket.emit('block', store));
}