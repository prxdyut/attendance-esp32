import type { Namespace, Server, Socket } from "socket.io";

export function setupWebsocket(
  name: string,
  server: Server,
  socket: (socket: Socket) => void
) {
  const namespace = server.of(name);
  namespace.on("connection", socket);
  return namespace;
}
