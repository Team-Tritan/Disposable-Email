import { create } from "zustand";
import { IEmail, IMailbox } from "@schemas/mailbox";
import { Socket } from "socket.io-client";

// Define the global state for the user
interface State {
  email: string;
  password: string;
  mailboxData: IMailbox | null;
  selectedMessage: IEmail | null;
  loading: boolean;
  creating: boolean;
  showCompose: boolean;
  showSent: boolean;
  socket: any;
  setSocket: (socket: any) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setMailboxData: (mailboxData: IMailbox | null) => void;
  setSelectedMessage: (selectedMessage: IEmail | null) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setShowCompose: (showCompose: boolean) => void;
  setShowSent: (showSent: boolean) => void;
}

// Create or edit the global state for the user
const useUser = create<State>((set) => ({
  email: "",
  password: "",
  mailboxData: null,
  selectedMessage: null,
  loading: true,
  creating: false,
  showCompose: false,
  socket: null,
  showSent: false,
  setSocket: (socket) => set({ socket }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setMailboxData: (mailboxData) => set({ mailboxData }),
  setSelectedMessage: (selectedMessage) => set({ selectedMessage }),
  setLoading: (loading) => set({ loading }),
  setCreating: (creating) => set({ creating }),
  setShowCompose: (showCompose) => set({ showCompose }),
  setShowSent: (showSent) => set({ showSent }),
}));

export default useUser;
