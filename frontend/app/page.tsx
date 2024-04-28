"use client";

import { useState, useEffect } from "react";
import { IMessage, IMailboxData } from "../schemas/mailData";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

let APIBaseURL = "https://temp-mail-api.tritan.gg";

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
    setCreating(true);
    const randomUsername = generateRandomCredentials();
    const randomPassword = generateRandomCredentials();

    const response = await fetch(APIBaseURL + "/api/mailbox", {
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
    setCreating(false);
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
        APIBaseURL + `/api/mailbox?email=${email}&password=${password}`
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
      APIBaseURL + `/api/mailbox/delete?email=${email}&password=${password}`,
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
    <div className="bg-[#1c1d25] font-sans h-screen w-full mx-0">
      <div className="flex h-full">
        <div className="w-64 bg-[#1c1d25] text-white flex flex-col justify-between border border-zinc-800">
          <div className="bg-[#1c1d25] p-4 rounded-xl">
            <div className="text-lg font-semibold mb-1 mt-1 pb-4 text-center text-white border-b border-zinc-800">
              Tritan Temporary Mail
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-xs text-gray-300 underline mb-2 px-2">
              <Link href="https://tritan.gg/legal">TOS - Privacy Policy</Link>
            </div>
            <div className="text-xs text-gray-300 underline mb-2 px-2">
              <Link href="https://tritan.gg/contact/new-request?type=abuse_report">
                Report Abuse
              </Link>
            </div>
          </div>
          <div>
            <button
              onClick={deleteMailbox}
              className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#1a1a22] border border-zinc-800 rounded-lg"
            >
              Destroy Inbox
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="w-1/2 bg-[#1c1d25]">
            {error && (
              <div className="bg-red-600 text-white text-center py-2">
                {error}
              </div>
            )}

            {creating && (
              <div className="bg-green-800 w-full text-white text-center py-2">
                Creating inbox...
              </div>
            )}

            {loading && (
              <div className="bg-indigo-600 w-full text-white text-center py-2">
                Fetching messages...
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <h2 className="text-md font-semibold text-white">Inbox</h2>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 mr-2" />
                  <h2 className="text-md font-semibold text-white">{email}</h2>
                </div>
              </div>

              <div className="overflow-y-auto h-96">
                {loading && (
                  <div>
                    <div className="flex h-full mt-4">
                      <div className="animate-pulse">
                        <div className="h-6 w-[650px] bg-white opacity-50 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-full bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-1/2 bg-white opacity-50 rounded"></div>
                      </div>
                    </div>
                    <div className="flex h-full mt-8">
                      <div className="animate-pulse">
                        <div className="h-6 w-96 bg-white opacity-50 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-full bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-1/2 bg-white opacity-50 rounded"></div>
                      </div>
                    </div>

                    <div className="flex h-full mt-8">
                      <div className="animate-pulse">
                        <div className="h-6 w-40 bg-white opacity-50 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-full bg-white opacity-50 rounded mb-1"></div>
                        <div className="h-4 w-1/2 bg-white opacity-50 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}

                {mailboxData && mailboxData.messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white text-center">No messages found.</p>
                  </div>
                )}

                {mailboxData &&
                  mailboxData.messages.map((message: IMessage) => (
                    <div
                      key={message.id}
                      className="flex items-start py-4 border-b border-zinc-800 cursor-pointer"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500">
                          {message.date}
                        </p>
                        <h3 className="text-lg font-semibold text-white">
                          {message.from}
                        </h3>
                        <p className="text-sm font-semibold text-white">
                          {message.subject}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {selectedMessage ? (
            <div className="w-1/2 bg-[#1c1d25] p-6 overflow-auto border border-zinc-800">
              <p className="text-xs font-semibold text-gray-500">
                {selectedMessage.date}
              </p>
              <h3 className="text-lg font-semibold text-white">
                {selectedMessage.from}
              </h3>
              <h3 className="text-white text-lg mb-2">
                {selectedMessage.subject}
              </h3>
              <p className="text-white mt-8">{selectedMessage.body}</p>
              <button
                className="flex items-center py-2 px-4 text-sm font-semibold bg-gray-700 hover:bg-gray-600 rounded mt-8"
                onClick={clearEmailViewer}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="w-1/2 bg-[#1c1d25] p-6 overflow-auto flex items-center justify-center h-screen border border-zinc-800">
              <p className="text-md font-semibold text-gray-500 text-center w-full">
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
