import React, { useState, useEffect } from "react";
import { handleSubmit } from "../utils/handleSubmit";
import { handleFetch } from "../utils/handleFetch";
import AutoReloadImage from "../components/AutoReloadingImage";
import LoadingOverlay from "../components/LoadingOverlay";

interface FailedMessage {
  userId: any;
  message: string;
  error: string;
  screen: string;
}

export default function Whatsapp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    messagesToday: 0,
    messagesThisMonth: 0,
    sendRate: 0,
    failedMessages: 0,
  });
  const [failedMessages, setFailedMessages] = useState<FailedMessage[]>([]);

  useEffect(() => {
    checkApiStatus();
    getFailedMessages();
  }, []);

  const checkApiStatus = async () => {
    handleFetch(
      "/whatsapp/api-status",
      setLoading,
      (data: any) => {
        console.log(data);
        setIsLoggedIn(data.isLoggedIn);
      },
      setError
    );
  };

  const getFailedMessages = async () => {
    handleFetch(
      "/whatsapp/failed-messages",
      setLoading,
      (data: any) => {
        setFailedMessages(data.failedMessages);
        setStats((_) => ({ ..._, failedMessages: data.failedMessages.length }));
        console.log(data);
      },
      setError
    );
  };

  const retryFailedMessages = async (event: React.FormEvent) => {
    handleSubmit(
      event,
      "/whatsapp/retry-failed-messages",
      setLoading,
      () => {
        alert("Retrying failed messages");
        getFailedMessages();
      },
      setError
    );
  };

  const login = async (e: any) => {
    handleSubmit(
      e,
      "/whatsapp/login",
      setLoading,
      (data: any) => {
        console.log(data);
        if (data.qrCodeUrl) {
          setQrCode(data.qrCodeUrl);
        } else {
          setIsLoggedIn(true);
          setQrCode(null);
        }
      },
      setError
    );
  };

  const logout = async (e: any) => {
    handleSubmit(
      e,
      "/whatsapp/logout",
      setLoading,
      () => {
        setIsLoggedIn(false);
        setQrCode(null);
      },
      setError
    );
  };

  const restart = async (event: any) => {
    handleSubmit(
      event,
      "/whatsapp/reload",
      setLoading,
      () => {
        checkApiStatus();
      },
      setError
    );
  };

  const sendTestMessage = async (event: any) => {
    handleSubmit(
      event,
      "/whatsapp/send-test-message",
      setLoading,
      () => {
        alert("Test message sent successfully!");
      },
      setError
    );
  };

  const getScreenshot = async () => {
    handleFetch(
      "/whatsapp/screenshot",
      setLoading,
      (data: any) => {
        window.open(`/api/${data.screenshotPath}`);
      },
      setError
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {loading && <LoadingOverlay />}

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            WhatsApp Integration Management
          </h1>

          <div className="mb-6 bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-lg">
              Status:{" "}
              <span className={isLoggedIn ? "text-green-600" : "text-red-600"}>
                {isLoggedIn ? "Connected" : "Not Connected"}
              </span>
            </p>
          </div>

          {qrCode && (
            <div className="mb-6">
              <AutoReloadImage
                src={`/api/${qrCode}`}
                alt={"Whatsapp QR"}
                className="mx-auto"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={checkApiStatus}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Check Status
            </button>
            <form onSubmit={login} className="contents">
              <input type="hidden" name="method" value="qr" />
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            </form>
            <form onSubmit={logout} className="contents">
              <button
                type="submit"
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </form>
            <form onSubmit={restart} className="contents">
              <button
                type="submit"
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Reload
              </button>
            </form>
            <button
              onClick={getScreenshot}
              className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition-colors"
            >
              Get Screenshot
            </button>
          </div>

          <form onSubmit={sendTestMessage} className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="message"
                placeholder="Message"
                className="border rounded p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors w-full"
            >
              Send Test Message
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="border p-4 rounded bg-white shadow">
              <p className="text-gray-600">Messages Today</p>
              <p className="font-bold text-2xl">{stats.messagesToday}</p>
            </div>
            <div className="border p-4 rounded bg-white shadow">
              <p className="text-gray-600">Messages This Month</p>
              <p className="font-bold text-2xl">{stats.messagesThisMonth}</p>
            </div>
            <div className="border p-4 rounded bg-white shadow">
              <p className="text-gray-600">Send Rate</p>
              <p className="font-bold text-2xl">{stats.sendRate}%</p>
            </div>
            <div className="border p-4 rounded bg-white shadow">
              <p className="text-gray-600">Failed Messages</p>
              <p className="font-bold text-2xl">{stats.failedMessages}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Failed Messages</h2>
            {failedMessages.length > 0 ? (
              <div>
                <ul className="mb-4 max-h-60 overflow-y-auto">
                  {failedMessages.map((msg, index) => (
                    <li key={index} className="mb-2 p-2 bg-red-100 rounded">
                      <p>
                        <strong>To:</strong> {msg.userId.name} (
                        {msg.userId.phone})
                      </p>
                      <p>
                        <strong>Message:</strong> {msg.message}
                      </p>
                      {msg.error && (
                        <p>
                          <strong>Error:</strong> {msg.error}
                        </p>
                      )}
                      {msg.screen && (
                        <p>
                          <a
                            target="_blank"
                            href={
                              `/whatsapp/errors` +
                              msg.screen
                            }
                            className=" text-blue-900 font-bold"
                          >
                            preview
                          </a>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <form onSubmit={retryFailedMessages}>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition-colors w-full"
                  >
                    Retry Failed Messages
                  </button>
                </form>
              </div>
            ) : (
              <p>No failed messages</p>
            )}
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
