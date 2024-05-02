import { useState } from "react";
import { toast } from "react-toastify";
import { OutgoingEmail } from "@schemas/OutgoingEmail";

interface Props {
  setShowCompose: React.Dispatch<React.SetStateAction<boolean>>;
  toast: typeof toast;
  email: string;
  password: string;
}

const ComposeEmail: React.FC<Props> = ({
  setShowCompose,
  toast,
  email,
  password,
}) => {
  const [newEmail, setNewEmail] = useState<OutgoingEmail>({
    to: "",
    subject: "",
    text: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-email": email,
        "x-auth-token": password,
      },
      body: JSON.stringify(newEmail),
    }).then((res) => {
      if (res.status !== 200) {
        return toast.info("Failed to send email, please try again.");
      }

      toast.info("Email sent successfully!");
    });

    setShowCompose(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof OutgoingEmail
  ) => {
    setNewEmail({ ...newEmail, [key]: e.target.value });
  };

  const { to, subject, text } = newEmail;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-[#0d0c0e] opacity-50" />
      <div className="relative w-1/3 p-4 bg-[#0d0c0e] shadow-lg rounded-lg border border-zinc-800">
        <div className="flex items-center text-white text-lg font-semibold">
          Compose Email
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={to}
            onChange={(e) => handleInputChange(e, "to")}
            placeholder="To"
            required
            className="w-full p-2 bg-[#0d0c0e] border border-zinc-800 rounded"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => handleInputChange(e, "subject")}
            placeholder="Subject"
            required
            className="w-full p-2 border bg-[#0d0c0e] border-zinc-800 rounded"
          />
          <textarea
            value={text}
            onChange={(e) => handleInputChange(e, "text")}
            placeholder="Enter your message here..."
            required
            className="w-full p-2 h-32 border bg-[#0d0c0e] border-zinc-800  rounded resize-none"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowCompose(false)}
              className="px-4 py-2 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] text-white rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeEmail;
