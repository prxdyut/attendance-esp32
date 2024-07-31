import express, { type Request, type Response } from "express";
import { Message, Template, User } from "../mongodb/models";
import puppeteer, { Browser, Page } from "puppeteer";
import { unlink, readFile, exists, mkdir } from "node:fs/promises";
import path from "path";
import Jimp from "jimp";
//@ts-ignore
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

router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

let context: { browser?: Browser; page?: Page } = {};

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
const production = process.env.ENV === "production" || true;
async function initializeBrowser(): Promise<void> {
  try {
    context.browser = await puppeteer.launch({
      headless: production,
      userDataDir: "./data",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      executablePath: production ? "/usr/bin/google-chrome-stable" : undefined,
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
    // Read the image
    const image = await Jimp.read(path);
    console.log(
      `Image dimensions: ${image.bitmap.width}x${image.bitmap.height}`
    );

    // Create QR code reader
    const qr = new QrCode();

    // Promisify the callback-based decode function
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

      // Calculate crop area with increased padding
      const padding = 50; // Increased padding
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

      // Crop the image
      const croppedImage = image.clone().crop(x, y, width, height);

      // Add extra space at the bottom
      const extraSpace = 50; // Adjust this value as needed
      const newHeight = croppedImage.bitmap.height + extraSpace;
      const finalImage = new Jimp(
        croppedImage.bitmap.width,
        newHeight,
        0xffffffff
      );
      finalImage.composite(croppedImage, 0, 0);

      // Add text at the bottom
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      const dateTime = getCurrentDateTime();
      const ipAddress = getIPAddress(req);
      const text = `${dateTime} - IP: ${ipAddress}`;
      finalImage.print(font, 10, newHeight - 40, text);

      // Save the final image
      await finalImage.writeAsync(path);
      console.log("Cropped QR code with additional info saved to:", path);
    } else {
      console.log("No QR code detected in the image.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function openContact(contactName?: string): Promise<void> {
  if (!contactName) return;
  try {
    if (!context.page) throw new Error("Page not initialized");
    await resetSearch();
    await context.page?.waitForSelector(
      'div[contenteditable="true"][data-tab="3"][aria-label="Search input textbox"]',
      {
        timeout: 60000,
      }
    );
    await context.page?.type(
      'div[contenteditable="true"][data-tab="3"][aria-label="Search input textbox"]',
      contactName
    );
    await delay(500);
    await context.page?.waitForSelector(`span[title="${contactName}"]`, {
      timeout: 5000,
    });
    await context.page?.click(`span[title="${contactName}"]`);
    await delay(1000);
    return;
  } catch (error: any) {
    console.log(error.message);
  }
  throw new Error("Cannot open contact.");
}

async function verifyChat(
  contactName?: string,
  phoneNumber?: string
): Promise<void> {
  if (!contactName || !phoneNumber) return;

  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.waitForSelector("#main", {
      timeout: 5000,
    });
    let verifiedChat = false;

    verifiedChat = await context.page?.evaluate(
      ({ contactName, phoneNumber }) => {
        const text = (
          document.querySelector("#main") as HTMLDivElement
        ).innerText.replaceAll(" ", "") as string;
        const contactMatches = text.includes(
          (contactName || " ").replaceAll(" ", "")
        );
        const phoneMatches = text.includes(
          (phoneNumber || " ").replaceAll(" ", "")
        );

        return contactMatches || phoneMatches;
      },
      { contactName, phoneNumber }
    );
    if (!verifiedChat)
      throw new Error("Cant Match Contact Name or Phone Number");
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
  } catch (error) {
    console.log(error);
    throw new Error("Cannot open Phone Number.");
  }
}

async function resetSearch(): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.type(
      'div[contenteditable="true"][data-tab="3"][aria-label="Search input textbox"]',
      " "
    );
  } catch (error) {
    console.log(error);
  }
}

async function sendMessage(message: string): Promise<void> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.waitForSelector(
      '#main div[contenteditable="true"][data-tab="10"]',
      { timeout: 5000 }
    );
    await context.page?.type(
      '#main div[contenteditable="true"][data-tab="10"]',
      message,
      { delay: 50 }
    );
    await context.page?.keyboard.press("Enter");
    await delay(1000);
    console.log("Message sent successfully!");
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
  try {
    await context.page?.waitForSelector(".landing-header", {
      timeout: 5000,
    });
    const loggedIn = !(await context.page?.evaluate(() => {
      return (
        (document.querySelector(".landing-header") as HTMLDivElement)
          .innerText == "WHATSAPP WEB"
      );
    }));
    if (loggedIn) {
      console.log("User is logged in");

      return true;
    }
    console.log("User is not logged in");
    return false;
  } catch (error) {
    try {
      await context.page?.waitForSelector('[aria-label="New chat"]', {
        timeout: 5000,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
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

async function takeLinkCode(phoneNumber: string): Promise<string> {
  try {
    if (!context.page) throw new Error("Page not initialized");
    await context.page?.waitForSelector(".landing-main", { timeout: 15000 });
    await context.page?.waitForSelector('[role="button"]:nth-of-type(1)');
    await context.page?.click('[role="button"]:nth-of-type(1)');
    await delay(500);
    await context.page?.click("button");
    await context.page?.waitForSelector(
      'div[contenteditable="true"][data-lexical-editor="true"]',
      {
        timeout: 60000,
      }
    );
    await context.page?.type(
      'div[contenteditable="true"][data-lexical-editor="true"]',
      "india",
      {
        delay: 100,
      }
    );
    await context.page?.click(
      '[aria-label="Selected country: India. Click to select a different country."]'
    );
    await delay(500);
    await context.page?.waitForSelector(
      '[aria-label="Type your phone number."]',
      {
        timeout: 60000,
      }
    );
    await context.page?.type(
      '[aria-label="Type your phone number."]',
      phoneNumber,
      {
        delay: 100,
      }
    );
    await context.page?.waitForSelector(
      ".landing-main > div > div:nth-of-type(3) > div:nth-of-type(2) button",
      {
        timeout: 60000,
      }
    );
    await context.page?.click(
      ".landing-main > div > div:nth-of-type(3) > div:nth-of-type(2) button"
    );
    await context.page?.waitForSelector(
      '[aria-label="Enter code on phone:"] > div[data-link-code]',
      {
        timeout: 60000,
      }
    );
    return await getLinkCode();
  } catch (error) {
    console.log(error);
    throw error;
  }
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

async function waitForLinkCode(phoneNumber: string): Promise<boolean> {
  let lastLinkCode: string = "";
  while (true) {
    try {
      if (!context.page) throw new Error("Page not initialized");
      const linkCodeSelector = '[aria-label="Enter code on phone:"] > div';
      await context.page?.waitForSelector(linkCodeSelector, { timeout: 5000 });
      const currentLinkCode = await context.page?.evaluate(() => {
        const element = document.querySelector(
          '[aria-label="Enter code on phone:"] > div'
        );
        return element ? element.getAttribute("data-link-code") : null;
      });

      if (currentLinkCode !== lastLinkCode) {
        lastLinkCode = currentLinkCode as string;
        const linkCode = await getLinkCode();
        console.log("New Link code detected, " + linkCode);
      }
    } catch (error) {
      console.log("Link code not found, checking if logged in");
      if (await isLoggedIn()) {
        console.log("Successfully logged in via Link Code");
        return true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

router.get("/", (req: Request, res: Response) => {
  res.json("api working");
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, method } = req.body;

    if (await isLoggedIn()) {
      res.json({ success: false, message: "Already logged in" });
      return;
    }

    if (method == "code" && !phoneNumber) {
      res.json({ success: false, message: "Please provide Phone Number" });
      return;
    }

    switch (method) {
      case "qr":
        const qrCodeUrl = await takeQRCode(req);
        res.json({
          success: true,
          message: "Log via QR code",
          data: { qrCodeUrl },
        });
        await waitForQRLogin(req);
        break;

      case "code":
        const linkCode = await takeLinkCode(phoneNumber);
        res.json({
          success: true,
          message: "Log in via this link code.",
          data: { linkCode },
        });
        await waitForLinkCode(phoneNumber);
        break;

      default:
        res.json({ success: false, message: "Invalid method" });
        break;
    }
    return;
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
    if (contactName && !phoneNumber) {
      await openContact(contactName);
    } else if (contactName && phoneNumber) {
      try {
        await openContact(contactName);
      } catch {
        await openPhone(phoneNumber);
      }
    } else if (phoneNumber && !contactName) {
      await openPhone(phoneNumber);
    }
    await verifyChat(contactName, phoneNumber);
    await sendMessage(message);
    await resetSearch();
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
      // Add a small delay between messages to avoid rate limiting
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

// New endpoint: /api-status
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

// New endpoint: /logout
router.post("/logout", async (req: Request, res: Response) => {
  try {
    if (!context.page) {
      res.status(400).json({ success: false, message: "Not logged in" });
      return;
    }

    await context.page.waitForSelector('div[aria-label="Menu"]', {
      timeout: 5000,
    });
    await context.page?.evaluate(() => {
      const menuButton = document.querySelector('div[aria-label="Menu"]');
      if (menuButton) (menuButton as HTMLElement).click();
    });

    await context.page?.waitForSelector('div[aria-label="Log out"]', {
      timeout: 5000,
    });
    await context.page?.click('div[aria-label="Log out"]');

    await context.page?.waitForSelector(
      'div[aria-label="Log out?"] button:nth-of-type(2)',
      { timeout: 5000 }
    );
    await context.page?.click(
      'div[aria-label="Log out?"] button:nth-of-type(2)'
    );
    await delay(1000);
    await context.page?.waitForSelector('[aria-label="Chat list"]', {
      timeout: 30000,
    });

    whatsappInitialized = false;
    await context.browser?.close();
    context = {};

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Couldn't logout" });
  }
});

// New endpoint: /reload
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

// New endpoint: /send-test-message
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
