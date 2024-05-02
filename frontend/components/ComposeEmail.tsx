import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  setShowCompose: any;
  toast: any;
}

const ComposeEmail: React.FC<Props> = ({ setShowCompose, toast }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch("/api/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-email": localStorage.getItem("tritan_tempmail_user") || "",
        "x-auth-token": localStorage.getItem("tritan_tempmail_pw") || "",
      },
      body: JSON.stringify({ to, subject, text: body }),
    }).then((res) => {
      if (res.status !== 200) {
        return toast.info("Failed to send email, please try again.");
      }

      toast.info("Email sent successfully!");
    });

    setShowCompose(false);
  };

  // WIP, shut up
  return (
    <div className="absolute right-0 bottom-0 w-1/3 p-4 bg-[#0d0c0e] shadow-lg transform translate-x-[-6rem]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          required
          className="w-full p-2 border bg-[#0d0c0e] border-gray-300 rounded"
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
          className="w-full p-2 border bg-[#0d0c0e] border-gray-300 rounded"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter your message here..."
          required
          className="w-full p-2 h-32 border bg-[#0d0c0e] border-gray-300 rounded resize-none"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-[#1d1d25] hover:bg-[#24242e]"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ComposeEmail;
