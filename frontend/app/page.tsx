"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IMessage, IMailboxData } from "@schemas/MailData";
import Topbar from "@components/Topbar";
import Sidebar from "@components/Sidebar";
import EmailList from "@components/EmailList";
import MessageViewer from "@components/MessageViewer";

let APIBaseURL = "https://temp-mail-api.tritan.gg";

const generateRandomCredentials = () => {
  return Math.random().toString(36).substring(16);
};

export default function TempMail() {
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
      return toast.error("Failed to create temporary email, please try again.");
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
        return toast.error(
          "Unable to fetch mailbox data, please reload the page."
        );
      }

      setLoading(false);
      setMailboxData(await response.json());
    };

    const interval = setInterval(() => fetchMailboxData(), 10000);
    return () => clearInterval(interval);
  });

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
      toast.info("Email copied to clipboard!");

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return toast.success("Failed to copy email to clipboard.");
    }
  };

  return (
    <div className="bg-[#0d0c0e] font-sans h-screen w-full mx-0">
      <div className="flex h-full">
        <Sidebar deleteMailbox={deleteMailbox} creating={creating} />
        <div className="flex-1 flex">
          <div className="w-1/2 bg-[#0d0c0e]">
            <div>
              <Topbar email={email} copyToClipboard={copyToClipboard} />
            </div>
            <div className="overflow-y-auto h-96 px-4">
              <EmailList
                loading={loading}
                mailboxData={mailboxData!}
                setSelectedMessage={setSelectedMessage}
              />
            </div>
          </div>
          <MessageViewer
            selectedMessage={selectedMessage}
            deleteMailbox={deleteMailbox}
          />
        </div>
      </div>
    </div>
  );
}
