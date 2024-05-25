"use client";

import { useCallback, useEffect, useState } from "react";
import useUser from "@store/useUser";
import ComposeEmail from "@components/composeEmail";
import EmailList from "@components/emailList";
import MessageViewer from "@components/messageViewer";
import Sidebar from "@components/sidebar";
import Topbar from "@components/topbar";
import { toast } from "react-toastify";
import io from "socket.io-client";

const TempMail = () => {
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
    socket,
    setSocket,
  } = useUser();

  useEffect(() => {
    const newSocket = io("ws://mailbox-api.tritan.gg");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  const createTemporaryEmail = useCallback(async () => {
    setCreating(true);

    try {
      if (!socket) throw new Error("Socket connection not established.");

      socket.emit("new-mailbox");

      socket.on("mailbox-response", (data: any) => {
        setEmail(data.email);
        setPassword(data.password);
        localStorage.setItem("tritan_tempmail_user", data.email);
        localStorage.setItem("tritan_tempmail_pw", data.password);
        setCreating(false);
        toast.success("New mailbox created successfully!");
      });

      socket.on("mailbox-error", (error: any) => {
        toast.error(error.message);
        setCreating(false);
      });
    } catch (error) {
      toast.error("Error creating temporary mailbox.");
      setCreating(false);
    }
  }, [socket, setEmail, setPassword, setCreating]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("tritan_tempmail_user");
    const storedPassword = localStorage.getItem("tritan_tempmail_pw");

    if (!storedEmail || !storedPassword) {
      createTemporaryEmail();
    } else {
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, [createTemporaryEmail, setEmail, setPassword]);

  useEffect(() => {
    const fetchMailboxData = () => {
      if (!socket || !email || !password) return;

      socket.emit("fetch-mail", { username: email, password });

      socket.on("mailbox-response", (data: any) => {
        setLoading(false);
        setMailboxData(data);
      });

      socket.on("mailbox-error", (error: any) => {
        toast.error(error.message);
      });
    };

    const interval = setInterval(fetchMailboxData, 5000);
    return () => clearInterval(interval);
  }, [socket, email, password, setLoading, setMailboxData]);

  const deleteMailbox = () => {
    try {
      if (!socket) throw new Error("Socket connection not established.");

      socket.emit("mailbox-delete", { username: email, password });

      socket.on("mailbox-response", () => {
        setMailboxData(null);
        setSelectedMessage(null);
        localStorage.removeItem("tritan_tempmail_user");
        localStorage.removeItem("tritan_tempmail_pw");
        createTemporaryEmail();
        toast.info("Mailbox destroyed successfully!");
      });

      socket.on("mailbox-error", (error: any) => {
        toast.error(error.message);
      });
    } catch (error) {
      toast.error("Error deleting mailbox.");
    }
  };

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
};

export default TempMail;
