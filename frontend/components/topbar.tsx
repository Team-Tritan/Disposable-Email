import useUser from "@store/useUser";
import {
  ClipboardDocumentListIcon,
  InboxIcon,
  AtSymbolIcon,
} from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

interface Props {
  toast: typeof toast;
}

const Topbar: React.FC<Props> = ({ toast }) => {
  const { email, showSent } = useUser();

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
    <div className="flex justify-between items-center pb-4 border-b border-zinc-800 p-6">
      <div className="flex items-center">
        {!showSent && <AtSymbolIcon className="h-5 mr-2" />}
        {showSent && <InboxIcon className="h-5 mr-2" />}

        <h2 className="text-md font-semibold text-white">
          {showSent ? "Sent" : "Inbox"}
        </h2>
      </div>
      <div
        className="flex items-center text-purple-400 transition-colors hover:text-purple-200"
        onClick={() => copyToClipboard(email)}
      >
        <ClipboardDocumentListIcon className="h-5 mr-2" />
        <h2 className="text-md font-semibold" style={{ cursor: "pointer" }}>
          {email ? email : "Loading..."}
        </h2>
      </div>
    </div>
  );
};

export default Topbar;
