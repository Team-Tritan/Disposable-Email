import { useState } from "react";
import useUser from "@store/useUser";
import { OutgoingEmail } from "@schemas/outgoingMail";
import { toast } from "react-toastify";

interface Props {
  toast: typeof toast;
}

const ComposeEmail: React.FC<Props> = ({ toast }) => {
  // Get global state from the store so we don't have to pass it to each component
  const { email, password, setShowCompose } = useUser();

  // Local state for the new email
  const [newEmail, setNewEmail] = useState<OutgoingEmail>({
    to: "",
    subject: "",
    body: "",
  });

  // Handle email sending
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      OutgoingEmail.parse(newEmail);

      e.preventDefault();

      fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": email,
          "X-Auth-Token": password,
        },
        body: JSON.stringify(newEmail),
      }).then((res) => {
        if (res.status !== 200) {
          return toast.info("Failed to send email, please try again.");
        }

        toast.success("Email sent successfully!");
      });

      setShowCompose(false);
    } catch {
      return toast.error("Failed to send email, please try again.");
    }
  };

  // Handle input changes on compose form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof OutgoingEmail
  ) => {
    setNewEmail({ ...newEmail, [key]: e.target.value });
  };

  // Destructure the new email object
  const { to, subject, body } = newEmail;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-[#0d0c0e] opacity-50" />
      <div className="relative w-1/3 p-4 bg-[#0d0c0e] shadow-lg rounded-lg border border-zinc-800">
        <div className="flex items-center text-white text-lg font-semibold">
          Compose Email
        </div>
        <div className="w-full mt-4 p-2 bg-[#0d0c0e] border border-zinc-800 rounded">
          From: {email}
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
            value={body}
            onChange={(e) => handleInputChange(e, "body")}
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
