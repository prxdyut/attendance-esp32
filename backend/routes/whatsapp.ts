import express, { type Request, type Response } from "express";
import { Message, Template, User } from "../mongodb/models";
import puppeteer, { Browser, Page } from "puppeteer";
import { unlink, readFile, exists, mkdir, writeFile } from "node:fs/promises";
import path from "path";
import Jimp from "jimp";
// @ts-ignore
import QrCode from "qrcode-reader";

const router = express.Router();

export const screenshotPath: string = path.join(
  __dirname,
  "..",
  "public",
  "whatsapp",
  "qr.png"
);
export const userDataDir: string = path.join(
  __dirname,
  "..",
  "data",
  "browser"
);

let context: { browser?: Browser; page?: Page } = {};

export function getBrowserContext() {
  return context;
}
export function setBrowserContext({
  browser,
  page,
}: {
  browser?: Browser;
  page?: Page;
}) {
  if (browser) context.browser = browser;
  if (page) context.browser = browser;
  return context;
}

interface QueueItem {
  task: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}
type FailedMessage = {
  contactName?: string;
  phoneNumber?: string;
  message: string;
  error: string;
};

const newMessage = async (content: {
  phoneNumber?: string;
  contactName?: string;
  message: string;
  userId: string;
}) => {
  try {
    const message = new Message({
      ...content,
      userId: content.userId,
      timestamp: new Date(),
    });
    await message.save();
    return message;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save message");
  }
};

let failedMessages: FailedMessage[] = [];
class RequestQueue {
  private queue: QueueItem[] = [];
  private isProcessing: boolean = false;

  enqueue(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { task, resolve, reject } = this.queue.shift()!;

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }
}

const requestQueue = new RequestQueue();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const production = process.env.ENV === "production";
async function initializeBrowser(): Promise<void> {
  try {
    context.browser = await puppeteer.launch({
      headless: true,
      userDataDir: production ? "./data" : "../browserData",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      executablePath: "/usr/bin/google-chrome-stable",
    });
    context.page = await context.browser?.newPage();
    await context.page?.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    await context.page?.goto("https://web.whatsapp.com");
    console.log("Browser initialized and whatsapp Web loaded");
  } catch (error) {
    console.error("Error initializing browser:", error);
    throw error;
  }
}
let whatsappInitialized = false;

async function init() {
  if (!whatsappInitialized) {
    console.log(`Whatsapp Server is starting`);
    try {
      await initializeBrowser();
      console.log("Browser Started");
      whatsappInitialized = true;
    } catch (error) {
      console.error("Failed to start the browser:", error);
      process.exit(1);
    }
  }
}

init();

function getCurrentDateTime(): string {
  return new Date().toLocaleString();
}

function getIPAddress(req: Request): string {
  return req.ip || req.socket.remoteAddress || "Unknown";
}

async function detectAndCropQRCode(path: string, req: Request): Promise<void> {
  try {
    const image = await Jimp.read(path);
    console.log(
      `Image dimensions: ${image.bitmap.width}x${image.bitmap.height}`
    );

    const qr = new QrCode();

    const qrResult = await new Promise<QrCode.QrCodeResult>(
      (resolve, reject) => {
        qr.callback = (err: any, value: any) =>
          err != null ? reject(err) : resolve(value);
        qr.decode(image.bitmap);
      }
    );

    if (qrResult) {
      console.log("QR Code detected!");
      console.log("Content:", qrResult.result);
      console.log("QR Code points:", JSON.stringify(qrResult.points));

      const padding = 50;
      const minX = Math.min(
        ...qrResult.points.map((p: { x: number; y: number }) => p.x)
      );
      const minY = Math.min(
        ...qrResult.points.map((p: { x: number; y: number }) => p.y)
      );
      const maxX = Math.max(
        ...qrResult.points.map((p: { x: number; y: number }) => p.x)
      );
      const maxY = Math.max(
        ...qrResult.points.map((p: { x: number; y: number }) => p.y)
      );

      const x = Math.max(0, minX - padding);
      const y = Math.max(0, minY - padding);
      const width = Math.min(image.bitmap.width - x, maxX - minX + 2 * padding);
      const height = Math.min(
        image.bitmap.height - y,
        maxY - minY + 2 * padding
      );

      console.log(
        `Crop dimensions: x=${x}, y=${y}, width=${width}, height=${height}`
      );

      if (width <= 0 || height <= 0) {
        throw new Error(
          `Invalid crop dimensions: width=${width}, height=${height}`
        );
      }

      const croppedImage = image.clone().crop(x, y, width, height);

      const extraSpace = 50;
      const newHeight = croppedImage.bitmap.height + extraSpace;
      const finalImage = new Jimp(
        croppedImage.bitmap.width,
        newHeight,
        0xffffffff
      );
      finalImage.composite(croppedImage, 0, 0);

      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      const dateTime = getCurrentDateTime();
      const ipAddress = getIPAddress(req);
      const text = `${dateTime} - IP: ${ipAddress}`;
      finalImage.print(font, 10, newHeight - 40, text);

      await finalImage.writeAsync(path);
      console.log("Cropped QR code with additional info saved to:", path);
    } else {
      console.log("No QR code detected in the image.");
    }
  } catch (error: any) {
    console.error("An error occurred:", error?.message);
  }
}

async function openContact(contactName?: string): Promise<void> {
  if (!contactName) return;
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page.waitForSelector(
      'div:has(button[aria-label="Search or start new chat"]) div [contenteditable="true"]'
    );
    await context.page.type(
      'div:has(button[aria-label="Search or start new chat"]) div [contenteditable="true"]',
      contactName
    );
    await context.page.waitForNetworkIdle({ timeout: 10000 });
    await click(`[role="listitem"]:has([title="${contactName}"])`);
  } catch (error: any) {
    console.log(error);
    throw new Error("Cannot open contact.");
  }
}

async function verifyChat(user: string): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");

    const profile = await context.page.$eval(
      'header:has([title="Profile details"])',
      (el) => el.textContent
    );
    const heading = profile?.replaceAll(" ", "");
    const isVerified = heading?.includes(user.replaceAll(" ", ""));

    if (!isVerified) throw new Error("Cant Match Contact Name or Phone Number");
  } catch (error) {
    console.log(error);
    throw new Error("Cannot verify chat.");
  }
}

async function openPhone(phoneNumber?: string): Promise<void> {
  if (!phoneNumber) return;
  try {
    if (!context.page) throw new Error("Page not initialized");
    const url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    await context.page?.goto(url, { waitUntil: "networkidle0" });
    await context.page.waitForNavigation();
    await context.page.waitForNetworkIdle();
  } catch (error) {
    console.log(error);
    throw new Error("Cannot open Phone Number.");
  }
}

async function resetSearch(): Promise<void> {
  if (!context.page) throw new Error("Page not initialized");
  const inputValue = await context.page.$eval(
    'div:has(button[aria-label="Search or start new chat"]) div [contenteditable="true"]',
    (el) => el.textContent
  );
  await context.page.type(
    'div:has(button[aria-label="Search or start new chat"]) div [contenteditable="true"]',
    " "
  );
  for (let i = 0; i < (inputValue || "").length + 1; i++) {
    await context.page.keyboard.press("Backspace");
  }
  await click('[aria-label="Chat list"]:has([data-icon="search"])');
}

async function sendMessage(message: string): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page.waitForSelector('[aria-placeholder="Type a message"]');
    await context.page.type('[aria-placeholder="Type a message"]', message);
    await context.page.keyboard.press("Enter");
    await context.page.waitForNetworkIdle({ timeout: 2000 });
  } catch (error) {
    console.log(error);
    throw new Error("Message was not sent.");
  }
}

async function deleteScreenshot(): Promise<void> {
  try {
    await unlink(screenshotPath);
    console.log("QR code screenshot deleted");
  } catch (error) {
    console.error("Couldn't delete screenshot");
  }
}

async function isLoggedIn(): Promise<boolean> {
  if (!context.page) return false;
  await context.page.waitForNetworkIdle({ timeout: 5000 });
  try {
    await context.page?.waitForSelector('[aria-label="Chats"]', {
      timeout: 500,
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function takeQRCode(req: Request): Promise<string> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.waitForSelector(".landing-main", { timeout: 15000 });
    await context.page?.waitForSelector("canvas", { timeout: 10000 });
    await context.page?.screenshot({ path: screenshotPath });
    console.log("Took screenshot");
    await detectAndCropQRCode(screenshotPath, req);
    return "/whatsapp/qr.png";
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getLinkCode(): Promise<string> {
  const linkCode = await context.page?.evaluate(() => {
    const element = document.querySelector(
      '[aria-label="Enter code on phone:"] > div'
    );
    return element
      ? element.getAttribute("data-link-code")?.replaceAll(",", " ") || ""
      : "";
  });
  return linkCode || "";
}

async function waitForQRLogin(req: Request): Promise<boolean> {
  let lastQRCode: string = "";
  while (true) {
    try {
      if (!context.page) throw new Error("Page not initialized");
      const qrCodeSelector = "div[data-ref]:has(canvas)";
      await context.page?.waitForSelector(qrCodeSelector, { timeout: 5000 });
      const currentQRCode = await context.page?.$eval(
        qrCodeSelector,
        (el: Element) => (el as HTMLDivElement).dataset.ref || ""
      );
      if (currentQRCode !== lastQRCode) {
        lastQRCode = currentQRCode;
        await takeQRCode(req);
        console.log("New QR code detected, updated screenshot");
      }
    } catch (error) {
      console.log("QR code not found, checking if logged in : ", error);
      if (await isLoggedIn()) {
        console.log("Successfully logged in via QR code");
        await deleteScreenshot();
        return true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function click(selector: string) {
  await context.page?.waitForSelector(selector, {
    timeout: 2000,
  });
  const offset = (await context.page?.evaluate((selector) => {
    const el = document.querySelector(selector);
    const { x, y } = (el as HTMLElement).getBoundingClientRect() as {
      x: number;
      y: number;
    };
    return { x: x + 2, y: y + 2 };
  }, selector)) as { x: number; y: number };
  await context.page?.mouse.click(offset.x, offset.y);
}

async function closeChat() {
  await context.page?.waitForNetworkIdle({ timeout: 5000 });
  await context.page?.$eval('#main [aria-label="Menu"]', (el) =>
    (el as HTMLElement).click()
  );
  await delay(1000);
  await context.page?.$eval('li:has([aria-label="Close chat"])', (el) =>
    (el as HTMLElement).click()
  );
}

async function newGroup(name: string, contacts: string[]) {
  if (!context.page) throw Error;

  await context.page.$eval('[aria-label="Menu"]', (el) =>
    (el as HTMLElement).click()
  );
  await delay(1000);
  await context.page.$eval('[aria-label="New group"]', (el) =>
    (el as HTMLElement).click()
  );

  for (const contact of contacts) {
    await context.page?.type("header + div input", contact);
    await openContact(contact);
  }

  await delay(500);
  await context.page.waitForSelector('[aria-label="Next"]');
  await context.page.$eval('[aria-label="Next"]', (el) =>
    (el as HTMLElement).click()
  );
  await context.page.waitForNetworkIdle({ timeout: 5000 });
  await delay(1000);
  await context.page.waitForSelector('[title="Group subject (optional)"]');
  await context.page.type('[title="Group subject (optional)"]', name);
  await delay(500);
  await context.page.waitForSelector('[aria-label="Create group"]');
  await context.page.$eval('[aria-label="Create group"]', (el) =>
    (el as HTMLElement).click()
  );
  await context.page.waitForNetworkIdle({ timeout: 5000 });
  await delay(2000);
  await resetSearch();
  await closeChat();
}
async function getInviteLink(groupName: string) {
  await openContact(groupName);
  await context.page?.$eval('[title="Profile details"]', (el) =>
    (el as HTMLElement).click()
  );
  await context.page?.$eval('[role="button"]:has([data-icon="link"])', (el) =>
    (el as HTMLElement).click()
  );
  await delay(1000);
  const inviteLink = await context.page?.$eval(
    "a#group-invite-link-anchor",
    (el) => (el as HTMLElement).getAttribute("href")
  );
  await closeChat();
  return inviteLink;
}
async function removeFromGroup(name: string, contacts: string[]) {
  await openContact(name);
  await context.page?.waitForNetworkIdle({ timeout: 10000 });
  await delay(1000);
  await context.page?.$eval('[title="Profile details"]', (el) =>
    (el as HTMLElement).click()
  );
  await context.page?.waitForNetworkIdle({ timeout: 10000 });
  await delay(1000);
  await context.page?.$eval('[role="button"]:has([data-icon="search"])', (el) =>
    (el as HTMLElement).click()
  );
  await context.page?.waitForNetworkIdle({ timeout: 10000 });
  await delay(1000);
  for (const contact of contacts) {
    await openContact(contact);
    await context.page?.waitForNetworkIdle({ timeout: 10000 });
    await delay(1000);
    await context.page?.$eval('li:has([aria-label="Remove"])', (el) =>
      (el as HTMLElement).click()
    );
    console.log("Removed " + contact);
    await context.page?.waitForNetworkIdle({ timeout: 10000 });
    await resetSearch();
  }
  await delay(2000);
  await context.page?.$eval('[role="button"]:has([data-icon="x"])', (el) =>
    (el as HTMLElement).click()
  );
  await delay(2000);
  await resetSearch();
  await closeChat();
}

router.get("/stream", async function (req, res, next) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setTimeout(0);

  req.on("close", () => {
    console.log("Client disconnected");
  });
  // Send the initial HTML
  res.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Live Screenshot</title>
      <script>
        function updateImage(data) {
          document.getElementById('screenshot').src = 'data:image/png;base64,' + data;
        }
      </script>
    </head>
    <body>
      <h1>Live Screenshot</h1>
      <img id="screenshot" alt="Live Screenshot" style="max-width: 100%;">
    </body>
    </html>
  `);

  res.write(`<!-- keepalive ${Date.now()} -->\n`);
  // Function to sleep for a specified number of milliseconds
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    while (true) {
      if (!context.page) {
        throw new Error("Page not initialized");
      }

      const screenshot = await context.page.screenshot({ encoding: "base64" });

      // Send a script to update the image
      res.write(`<script>updateImage("${screenshot}");</script>`);

      // Flush the response to ensure the client receives the data immediately
      // res.flush();

      // Wait for a short period before taking the next screenshot
      await sleep(0); // Adjust this value to control the frame rate
    }
  } catch (error) {
    console.error("Error:", error);
    res.write(
      `<script>document.body.innerHTML += "<p>Error: ${error.message}</p>";</script>`
    );
    res.write(`<script>window.reload();</script>`);
    res.end();
  }
});

router.get("/testing", async (req: Request, res: Response) => {
  try {
    if (!context.page) throw new Error("Page not initialized");

    const name = "batch 4r";
    const contacts = ["Pradyut Das 444", "Mayuresh Patil"];

    // TODO : implement NLP
    // TODO : unread messages

    res.json({ success: true });
  } catch (error: any) {
    console.log(error);
    // await context.page?.reload({ waitUntil: "networkidle0" });
    res.json({ success: false });
  }
});
router.get("/login", async (req: Request, res: Response) => {
  try {
    if (await isLoggedIn()) {
      res.json({
        success: false,
        message: "Already logged in",
        data: { isLoggedIn: true },
      });
      return;
    }

    const qrCodeUrl = await takeQRCode(req);
    res.json({
      success: true,
      message: "Log via QR code",
      data: { qrCodeUrl },
    });
    await waitForQRLogin(req);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export function addMessageToQueue(data: {
  message: string;
  userId: string;
}): void {
  requestQueue.enqueue(async () => {
    let savedMessage: any = null;
    let user: any = null;
    try {
      user = await User.findById(data.userId);
      console.log(user);
      const phoneNumber = user?.phone;
      const contactName = user?.contact || undefined;
      savedMessage = await newMessage(data);
      await sendWhatsappMessage({
        contactName,
        phoneNumber,
        message: data.message,
      });
      savedMessage.failed = false;
      await savedMessage.save();
    } catch (error: any) {
      console.error("Error sending message:", error);
      const screenshot = "/" + Date.now() + ".png";
      const screenshotPath = "./public/whatsapp/errors/" + screenshot;
      await context.page?.screenshot({ path: screenshotPath });
      savedMessage.screen = screenshot;
      savedMessage.error = error.message || String(error);
      await savedMessage.save();
      await context.page?.reload({ waitUntil: "networkidle0" });
    }
  });
}

export async function sendWhatsappMessage(data: {
  contactName?: string;
  message: string;
  phoneNumber?: string;
}): Promise<void> {
  const { contactName, message, phoneNumber } = data;

  if (!contactName && !phoneNumber) {
    throw new Error("Either contactName or phoneNumber is required");
  }

  if (!(await isLoggedIn())) {
    throw new Error("WhatsApp not logged in");
  }

  try {
    await resetSearch();
    if (contactName) {
      await openContact(contactName);
    } else if (contactName && phoneNumber) {
      try {
        await openContact(contactName);
      } catch {
        await openPhone(phoneNumber);
      }
    } else if (phoneNumber) {
      await openPhone(phoneNumber);
    }
    await verifyChat((contactName as string) || (phoneNumber as string));
    await sendMessage(message);
    await resetSearch();
    await closeChat();
    console.log("Message sent successfully!");
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw error;
  }
}

router.get("/failed-messages", async (req: Request, res: Response) => {
  const failedMessages = await Message.find({ failed: true }).populate(
    "userId"
  );
  res.json({ success: true, data: { failedMessages } });
});

router.post("/retry-failed-messages", async (req: Request, res: Response) => {
  let messages = { failed: 0, success: 0 };

  try {
    const failedMessages = (await Message.find({
      failed: true,
    })) as (FailedMessage & any)[];

    for (const failedMessage of failedMessages) {
      try {
        await sendWhatsappMessage({
          contactName: failedMessage.contactName,
          message: failedMessage.message,
          phoneNumber: failedMessage.phoneNumber,
        });
        messages.success++;
        failedMessage.failed = false;
        await failedMessage.save();
        console.log(`Message ${failedMessage._id} sent successfully on retry!`);
      } catch (error: any) {
        messages.failed++;
        console.error(
          `Error sending failed message ${failedMessage._id} on retry:`,
          error
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Finished retrying all failed messages");
    res.json({
      success: true,
      message:
        "Retried All; recieved success : " +
        messages.success +
        ", failed : " +
        messages.failed,
      data: { totalMessages: failedMessages.length },
    });
  } catch (error: any) {
    console.error("Error in retry-failed-messages route:", error);
    res.json({
      success: true,
      message: "Couldn't retry all failed messages",
      data: { totalMessages: failedMessages.length },
    });
  }
});

router.get("/api-status", async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is operational",
    data: {
      whatsappInitialized,
      isLoggedIn: await isLoggedIn(),
    },
  });
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    if (!context.page) {
      res.status(400).json({ success: false, message: "Not logged in" });
      return;
    }
    await context.page.waitForNetworkIdle({ timeout: 10000 });
    await context.page.waitForSelector('div[aria-label="Menu"]', {
      timeout: 1000,
    });
    await context.page.click('div[aria-label="Menu"]');
    await delay(1000);
    await context.page?.waitForSelector('div[aria-label="Log out"]', {
      timeout: 1000,
    });
    await context.page?.click('div[aria-label="Log out"]');
    await delay(1000);
    await context.page?.waitForSelector(
      'div[aria-label="Log out?"] button:nth-of-type(2)',
      { timeout: 1000 }
    );
    await context.page?.click(
      'div[aria-label="Log out?"] button:nth-of-type(2)'
    );
    await context.page.waitForNetworkIdle({ timeout: 10000 });
    whatsappInitialized = false;
    await context.browser?.close();
    context = {};

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Couldn't logout" });
  }
});

router.post("/reload", async (req: Request, res: Response) => {
  try {
    if (context.page) {
      await context.page?.reload({ waitUntil: "networkidle0" });
      res.json({ success: true, message: "Page reloaded successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No active page to reload" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/send-test-message", async (req: Request, res: Response) => {
  const { phoneNumber, contactName, message } = req.body;

  if (!phoneNumber && !contactName) {
    res.status(400).json({
      success: false,
      message: "Phone number or contact name is required",
    });
    return;
  }

  if (!(await isLoggedIn())) {
    res.status(400).json({ success: false, message: "WhatsApp not logged in" });
    return;
  }

  try {
    await sendWhatsappMessage({ contactName, message, phoneNumber });
    res.json({ success: true, message: "Sent test message." });
  } catch (error: any) {
    res.json({
      success: true,
      message: `Failed to send test message : ${error.message}`,
    });
    await context.page?.reload({ waitUntil: "networkidle0" });
  }
});

router.get("/screenshot", async (req: Request, res: Response) => {
  try {
    context.page?.evaluate(() => {
      document.body.style.zoom = "0.75";
    });
    const screenshotPath = "/whatsapp/screenshot.png";
    await context.page?.screenshot({ path: `./public${screenshotPath}` });

    res.send({ success: true, data: { screenshotPath } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

process.on("SIGINT", async () => {
  console.log("Closing browser and shutting down server...");
  if (context.browser) {
    try {
      await context.browser.close();
      console.log("Browser closed successfully");
    } catch (error) {
      console.error("Error closing browser:", error);
    }
  }
  process.exit();
});

export default router;
