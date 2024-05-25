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
import io from "socket.io-client";

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
    socket,
    setSocket,
  } = useUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Establish WebSocket connection
  useEffect(() => {
    const newSocket = io("ws://mailbox-api.tritan.gg");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  // Fetch mailbox data
  const fetchMailboxData = useCallback(() => {
    if (!socket || !email || !password) return;

    socket.emit("fetch-mail", { username: email, password });

    socket.on("mailbox-response", (data: any) => {
      setLoading(false);
      setMailboxData(data);
    });

    socket.on("mailbox-error", (error: any) => {
      toast.error(error.message);
      setIsLoggedIn(false);
    });

    return () => {
      socket.off("mailbox-response");
      socket.off("mailbox-error");
    };
  }, [socket, email, password, setLoading, setMailboxData, setIsLoggedIn]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
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
    setIsLoggedIn(false);
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
