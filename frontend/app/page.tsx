"use client";

import { useCallback, useEffect } from "react";
import useUser from "@store/useUser";
import ComposeEmail from "@components/composeEmail";
import EmailList from "@components/emailList";
import MessageViewer from "@components/messageViewer";
import Sidebar from "@components/sidebar";
import Topbar from "@components/topbar";
import { toast } from "react-toastify";

export default function TempMail() {
  // Get global state from the store so we don't have to pass it to each component
  const {
    email,
    password,
    setEmail,
    setPassword,
    setMailboxData,
    setSelectedMessage,
    setLoading,
    setCreating,
    showCompose,
    showSent,
  } = useUser();

  // Create a temporary email address
  const createTemporaryEmail = useCallback(async () => {
    setCreating(true);

    const response = await fetch("/api/mailbox", {
      method: "PUT",
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
  }, [setPassword, setEmail, setCreating]);

  // Grab the email and password from local storage if it exists, if not, create a new mailbox
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
  }, [setEmail, setPassword, createTemporaryEmail]);

  // Patch in mailbox data
  useEffect(() => {
    const fetchMailboxData = async () => {
      const response = await fetch(`/api/mailbox`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": email,
          "X-Auth-Token": password,
        },
      });

      if (response.status !== 200 || !response.ok) {
        localStorage.removeItem("tritan_tempmail_user");
        localStorage.removeItem("tritan_tempmail_pw");
        toast.error(
          "Existing mailbox likely expired or server error, creating new mailbox."
        );

        return createTemporaryEmail();
      }

      setLoading(false);
      setMailboxData(await response.json());
    };

    const interval = setInterval(() => fetchMailboxData(), 5000);
    return () => clearInterval(interval);
  }, [email, password, setLoading, setMailboxData, createTemporaryEmail]);

  // Delete the mailbox
  const deleteMailbox = async () => {
    let response = await fetch(`/api/mailbox`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Email": email,
        "X-Auth-Token": password,
      },
    });

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

  // Close the message viewer if the user switches to or away from the sent tab
  useEffect(() => {
    setSelectedMessage(null);
  }, [showSent, setSelectedMessage]);

  return (
    <div className="bg-[#0d0c0e] font-sans h-screen w-full mx-0">
      <div className="flex h-full">
        <Sidebar deleteMailbox={deleteMailbox} />
        <div className="flex-1 flex">
          <div className="w-1/2 bg-[#0d0c0e]">
            <div>
              <Topbar toast={toast} />
            </div>
            <div className="overflow-y-auto px-4">
              <EmailList />
            </div>
          </div>
          <MessageViewer />
          {showCompose && <ComposeEmail toast={toast} />}
        </div>
      </div>
    </div>
  );
}
