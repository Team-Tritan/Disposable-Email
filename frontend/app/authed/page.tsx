"use client";

import { useState, useEffect, useCallback } from "react";
import useUser from "@store/useUser";
import ComposeEmail from "@components/composeEmail";
import EmailList from "@components/emailList";
import MessageViewer from "@components/messageViewer";
import Sidebar from "@components/sidebar";
import Topbar from "@components/topbar";
import CredentialsModal from "@components/credentialsModal";
import { toast } from "react-toastify";

const AuthedMail = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    setMailboxData,
    setSelectedMessage,
    setLoading,
    showCompose,
    showSent,
  } = useUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch mailbox data
  const fetchMailboxData = useCallback(async () => {
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutDuration = 60000;

    const timeoutId = setTimeout(() => {
      controller.abort();
      toast.error("Request timed out. Please try again later.");
    }, timeoutDuration);

    try {
      const response = await fetch(`/api/mailbox`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": email,
          "X-Auth-Token": password,
        },
        signal,
      });

      clearTimeout(timeoutId);

      if (response.status !== 200 || !response.ok) {
        toast.error("Authentication failed, please relogin.");
        return setIsLoggedIn(false);
      }

      setLoading(false);
      setMailboxData(await response.json());
    } catch (error: Error | any) {
      if (error.name === "AbortError") {
        console.error("Request aborted due to timeout");
      } else {
        console.error("Fetch error:", error.message);
      }
    }
  }, [email, password, setLoading, setMailboxData, setIsLoggedIn]);

  useEffect(() => {
    let intervalId: any;
    if (isLoggedIn) {
      intervalId = setInterval(fetchMailboxData, 5000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isLoggedIn, fetchMailboxData]);

  // Delete the mailbox
  const deleteMailbox = async () => {
    toast.info("Logged out successfully.");
    setEmail("");
    setPassword("");
    setMailboxData(null);
    setSelectedMessage(null);
    return setIsLoggedIn(false);
  };

  // Close the message viewer if the user switches to or away from the sent tab
  useEffect(() => {
    setSelectedMessage(null);
  }, [showSent, setSelectedMessage]);

  // Handle form submission
  const handleAuthenticationSubmit = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setIsLoggedIn(true);
  };

  return (
    <div className="bg-[#0d0c0e] font-sans h-screen w-full mx-0">
      {!isLoggedIn && (
        <CredentialsModal onSubmit={handleAuthenticationSubmit} />
      )}{" "}
      {isLoggedIn && (
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
      )}
    </div>
  );
};

export default AuthedMail;
