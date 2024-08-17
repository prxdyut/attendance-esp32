import type { Namespace, Server, Socket } from "socket.io";
import { getBrowserContext } from "../whatsapp";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function whatsappSocket(socket: Socket) {
  console.log("New connection to WhatsApp namespace");

  socket.on("message", (message) => {
    console.log(message);
  });

  let isConnected = true;

  while (isConnected) {
    let base64Image = "";
    try {
      base64Image = await getBrowserContext().page?.screenshot({
        type: "png",
        encoding: "base64",
      }) as string;
    } catch (error: any) {
      console.log("Screenshot Error : ", error.message);
    }
    socket.emit("image", base64Image);

    await delay(100);
  }

  socket.on("disconnect", () => {
    isConnected = false;
    console.log("Client disconnected from WhatsApp namespace");
  });
}
