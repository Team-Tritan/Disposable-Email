import { useState } from "react";
import useUser from "@store/useUser";

interface CredentialsModalProps {
  onSubmit: (email: string, password: string) => void;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({ onSubmit }) => {
  const { email, password, setEmail, setPassword } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-[#0d0c0e] opacity-50" />
      <div className="relative w-1/5 p-4 bg-[#0d0c0e] shadow-lg rounded-lg border border-zinc-800">
        <h2 className="text-lg font-semibold text-white mb-3">
          Tritan Webmail
        </h2>
        <p className="text-sm text-zinc-400 mb-4">
          Please enter your email and password to login.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 bg-[#0d0c0e] border border-zinc-800 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 bg-[#0d0c0e] border border-zinc-800 rounded mt-2"
          />
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] text-white rounded-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialsModal;
