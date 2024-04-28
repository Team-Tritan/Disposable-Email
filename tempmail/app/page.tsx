"use client";

import { useState, useEffect } from "react";
import { IMessage, IMailboxData } from "../schemas/mailData";

const generateRandomCredentials = () => {
  return Math.random().toString(36).substring(16);
};

const TempMail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mailboxData, setMailboxData] = useState<IMailboxData | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createTemporaryEmail = async () => {
    setLoading(true);
    const randomUsername = generateRandomCredentials();
    const randomPassword = generateRandomCredentials();

    const response = await fetch("http://localhost:4000/api/mailbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: randomUsername,
        password: randomPassword,
      }),
    });

    if (!response.ok) {
      setError("Failed to create temporary email.");
    } else {
      setError(null);
    }

    const data = await response.json();
    setEmail(data.email);
    setPassword(data.password);
    localStorage.setItem("tritan_tempmail_user", data.email);
    localStorage.setItem("tritan_tempmail_pw", data.password);
    setLoading(false);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("tritan_tempmail_user");
    const storedPassword = localStorage.getItem("tritan_tempmail_pw");

    if (!storedEmail || !storedPassword) createTemporaryEmail();
    else {
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    const fetchMailboxData = async () => {
      const response = await fetch(
        `http://localhost:4000/api/mailbox?email=${email}&password=${password}`
      );

      if (!response.ok) {
        setError("Failed to fetch mailbox data.");
      } else {
        setError(null);
      }

      setMailboxData(await response.json());
      setLoading(false);
    };

    const interval = setInterval(() => fetchMailboxData(), 10000);
    return () => clearInterval(interval);
  }, [email, password]);

  const clearEmailViewer = () => {
    setSelectedMessage(null);
  };

  const deleteMailbox = async () => {
    let response = await fetch(
      `http://localhost:4000/api/mailbox/delete?email=${email}&password=${password}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      setError("Failed to delete mailbox.");
    } else {
      setError(null);
    }

    setMailboxData(null);
    localStorage.removeItem("tritan_tempmail_user");
    localStorage.removeItem("tritan_tempmail_pw");
    createTemporaryEmail();
  };

  return (
    <div className="bg-gray-200 font-sans h-screen w-full mx-0">
      <div className="flex h-full">
        <div className="w-64 bg-[#18161a] text-white flex flex-col justify-between">
          <div className="bg-[#0d0c0e] p-4 rounded-xl">
            <div className="text-lg font-semibold mb-1 mt-1 text-center text-white">
              Temporary Mail
            </div>
          </div>
          <div>
            <button
              onClick={deleteMailbox}
              className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#0e0d0f] border border-zinc-800 rounded-lg"
            >
              Destroy Inbox
            </button>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="w-1/2 bg-white">
            {error && (
              <div className="bg-red-600 text-white text-center py-2">
                {error}
              </div>
            )}

            {creating && (
              <div className="bg-indigo-600 text-white text-center py-2">
                Creating inbox...
              </div>
            )}

            {loading && (
              <div className="bg-indigo-600 text-white text-center py-2">
                Fetching messages...
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Inbox</h2>
                <h2 className="text-xl font-semibold text-gray-500">{email}</h2>
              </div>

              <div className="overflow-y-auto h-96">
                {loading && <p>Loading...</p>}

                {mailboxData && mailboxData.messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-black text-center">No messages found.</p>
                  </div>
                )}

                {mailboxData &&
                  mailboxData.messages.map((message: IMessage) => (
                    <div
                      key={message.id}
                      className="flex items-start py-4 border-b cursor-pointer"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500">
                          {message.date}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-700">
                          {message.from}
                        </h3>
                        <p className="text-sm font-semibold text-gray-600">
                          {message.subject}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {selectedMessage ? (
            <div className="w-1/2 bg-gray-200 p-6 overflow-auto">
              <p className="text-xs font-semibold text-gray-500">
                {selectedMessage.date}
              </p>
              <h3 className="text-lg font-semibold text-gray-700">
                {selectedMessage.from}
              </h3>
              <h3 className="text-black text-lg mb-2">
                {selectedMessage.subject}
              </h3>
              <p className="text-black mt-8">{selectedMessage.body}</p>
              <button
                className="flex items-center py-2 px-4 text-sm font-semibold bg-gray-700 hover:bg-gray-600 rounded mt-8"
                onClick={clearEmailViewer}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="w-1/2 bg-gray-200 p-6 overflow-auto flex items-center justify-center h-screen">
              <p className="text-xs font-semibold text-gray-500 text-center w-full">
                Select a message to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempMail;
