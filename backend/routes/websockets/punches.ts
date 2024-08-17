import type { Namespace, Server, Socket } from "socket.io";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function punchesSocket(namespace: Namespace) {
  namespace.on("connection", (socket: Socket) => {
    console.log("New connection to PunchesNamespace");

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from WhatsApp namespace");
    });
  });
}
