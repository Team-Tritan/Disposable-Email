import Link from "next/link";

interface Props {
  deleteMailbox: () => void;
  creating: boolean;
  setShowCompose?: any;
}

const Sidebar: React.FC<Props> = ({
  deleteMailbox,
  creating,
  setShowCompose,
}) => {
  return (
    <div className="w-64 bg-[#0d0c0e] text-white flex flex-col justify-between border border-zinc-800">
      <div className="bg-[#0d0c0e] p-4 rounded-xl">
        <div className="text-lg font-semibold mb-1 mt-1 pb-4 text-center text-white border-b border-zinc-800">
          Tritan Disposable Mail
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={deleteMailbox}
          className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#18181f] hover:bg-[#1c1c24] border border-zinc-800 rounded-lg shadow-lg"
          disabled={creating}
        >
          New Inbox
        </button>

        <button
          onClick={() => setShowCompose(true)}
          className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#18181f] hover:bg-[#1c1c24] border border-zinc-800 rounded-lg shadow-lg mt-7"
          disabled={creating}
        >
          Compose Email
        </button>
      </div>

      <div className="mt-auto">
        <div className="text-xs text-gray-300 underline mb-2 px-2">
          <Link href="https://tritan.gg/legal">TOS & Privacy Policy</Link>
        </div>
        <div className="text-xs text-gray-300 underline mb-2 px-2">
          <Link href="https://tritan.gg/contact/new-request?type=abuse_report">
            Report Abuse
          </Link>
        </div>
        <div className="text-xs text-gray-300 mt-6 mb-2 px-2">
          Created by Tritan Internet LLC
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
