"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IMessage, IMailboxData } from "@schemas/MailData";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";

let APIBaseURL = "https://temp-mail-api.tritan.gg";
//let APIBaseURL = "http://localhost:4000";

const generateRandomCredentials = () => {
  return Math.random().toString(36).substring(16);
};

const TempMail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mailboxData, setMailboxData] = useState<IMailboxData | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

    if (response.status !== 200) {
      toast.error("Failed to create temporary email, please try again.");
    }

    const data = await response.json();

    setEmail(data.email);
    setPassword(data.password);

    localStorage.setItem("tritan_tempmail_user", data.email);
    localStorage.setItem("tritan_tempmail_pw", data.password);

    setCreating(false);
    return toast.success("New mailbox created successfully!");
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("tritan_tempmail_user");
    const storedPassword = localStorage.getItem("tritan_tempmail_pw");

    (async () => {
      if (!storedEmail || !storedPassword) await createTemporaryEmail();
      else {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    })();
  }, [email, password]);

  useEffect(() => {
    const fetchMailboxData = async () => {
      const response = await fetch(
        APIBaseURL + `/api/mailbox?email=${email}&password=${password}`
      );

      if (response.status !== 200 || !response.ok) {
        localStorage.removeItem("tritan_tempmail_user");
        localStorage.removeItem("tritan_tempmail_pw");
        toast.error("Unable to fetch mailbox data, please reload the page.");
      }

      setLoading(false);
      setMailboxData(await response.json());
    };

    const interval = setInterval(() => fetchMailboxData(), 10000);
    return () => clearInterval(interval);
  });

  // const clearEmailViewer = () => {
  //   setSelectedMessage(null);
  // };

  const deleteMailbox = async () => {
    let response = await fetch(
      APIBaseURL + `/api/mailbox/delete?email=${email}&password=${password}`,
      {
        method: "POST",
      }
    );

    if (response.status !== 200) {
      return toast.error("Failed to create temporary email.");
    }

    setMailboxData(null);
    setSelectedMessage(null);

    localStorage.removeItem("tritan_tempmail_user");
    localStorage.removeItem("tritan_tempmail_pw");

    createTemporaryEmail();
    toast.info("Mailbox destroyed successfully!");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Email copied to clipboard!");

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return toast.success("Failed to copy email to clipboard.");
    }
  };

  return (
    <div className="bg-[#1c1d25] font-sans h-screen w-full mx-0">
      {/** Sidebar */}
      <div className="flex h-full">
        <div className="w-64 bg-[#1c1d25] text-white flex flex-col justify-between border border-zinc-800">
          <div className="bg-[#1c1d25] p-4 rounded-xl">
            <div className="text-lg font-semibold mb-1 mt-1 pb-4 text-center text-white border-b border-zinc-800">
              Tritan Disposable Mail
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={deleteMailbox}
              className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#2b2b38] border border-zinc-800 rounded-lg"
              disabled={creating}
            >
              New Inbox
            </button>
          </div>

          <div className="mt-auto">
            <div className="text-xs text-gray-300 underline mb-2 px-2">
              <Link href="https://tritan.gg/legal">TOS & Privacy Policy</Link>
            </div>
            <div className="text-xs text-gray-300 underline mb-2 px-2">
              <Link href="https://tritan.gg/contact/new-request?type=abuse_report">
                Report Abuse
              </Link>
            </div>
            <div className="text-xs text-gray-300 mt-6 mb-2 px-2">
              Created by Tritan Internet LLC
            </div>
          </div>
        </div>

        {/** Main content */}
        <div className="flex-1 flex">
          <div className="w-1/2 bg-[#1c1d25]">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <h2 className="text-md font-semibold text-white">Inbox</h2>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 mr-2" />
                  <h2
                    className="text-md font-semibold text-white transition-colors hover:text-purple-400"
                    onClick={() => copyToClipboard(email)}
                    style={{ cursor: "pointer" }}
                  >
                    {email ? email : "Loading..."}
                  </h2>
                </div>
              </div>

              <div className="overflow-y-auto h-96">
                {loading && (
                  <div>
                    <div className="flex items-center justify-center">
                      <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="white"
                        ariaLabel="line-wave-loading"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white text-center">
                        Establishing real-time connection to the server.
                      </p>
                    </div>
                  </div>
                )}

                {mailboxData && mailboxData.messages.length === 0 && (
                  <div>
                    <div className="flex items-center justify-center">
                      <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="white"
                        ariaLabel="line-wave-loading"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white text-center">
                        Waiting for emails to arrive.
                      </p>
                    </div>
                  </div>
                )}

                {/** Email list */}
                {mailboxData &&
                  mailboxData.messages.map((message: any) => (
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

          {/** Email Viewer */}
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
              <div className="bg-black rounded-lg p-4 mt-8 w-[100%]">
                <code className="text-white">
                  <p className="mt-2">{selectedMessage.body}</p>
                </code>
              </div>
              <button
                className="flex items-center py-2 px-4 text-sm font-semibold bg-[#2b2b38] rounded mt-8"
                onClick={deleteMailbox}
              >
                Delete Message
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
