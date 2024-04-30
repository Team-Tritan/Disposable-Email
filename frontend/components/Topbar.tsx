import {
  ClipboardDocumentListIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";

interface Props {
  email: string;
  copyToClipboard: (email: string) => void;
}

const Topbar: React.FC<Props> = ({ email, copyToClipboard }) => {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-zinc-800 p-6">
      <div className="flex items-center">
        <EnvelopeIcon className="h-5 mr-2" />
        <h2 className="text-md font-semibold text-white">Inbox</h2>
      </div>
      <div className="flex items-center">
        <ClipboardDocumentListIcon className="h-5 mr-2" />
        <h2
          className="text-md font-semibold text-purple-400 hover:text-purple-200"
          onClick={() => copyToClipboard(email)}
          style={{ cursor: "pointer" }}
        >
          {email ? email : "Loading..."}
        </h2>
      </div>
    </div>
  );
};

export default Topbar;
