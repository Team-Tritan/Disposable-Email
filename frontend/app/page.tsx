"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";

import { IMessage, IMailboxData } from "@schemas/MailData";
import useCreateTemporaryEmail from "@hooks/createTemporaryMailbox";
import useFetchMailboxData from "@hooks/fetchMailboxData";
import useDeleteMailbox from "@hooks/deleteMailbox";
import copyToClipboard from "@hooks/copyToClipboard";

let APIBaseURL = "https://temp-mail-api.tritan.gg";

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

  const createTemporaryEmail = useCreateTemporaryEmail({
    setCreating,
    generateRandomCredentials,
    APIBaseURL,
    setEmail,
    setPassword,
    toast,
  });

  useEffect(() => {
    const storedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("tritan_tempmail_user")
        : null;
    const storedPassword =
      typeof window !== "undefined"
        ? localStorage.getItem("tritan_tempmail_pw")
        : null;

    (async () => {
      if (!storedEmail || !storedPassword) await createTemporaryEmail();
      else {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    })();
  }, [email, password, createTemporaryEmail]);

  useFetchMailboxData({
    APIBaseURL,
    email,
    password,
    setMailboxData,
    setLoading,
  });

  const deleteMailbox = useDeleteMailbox({
    APIBaseURL,
    email,
    password,
    setMailboxData,
    setSelectedMessage,
    createTemporaryEmail: () => createTemporaryEmail(),
  });

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
