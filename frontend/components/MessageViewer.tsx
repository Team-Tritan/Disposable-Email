import React from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/20/solid";

interface Message {
  date: string;
  from: string;
  subject: string;
  body: string;
}

interface Props {
  selectedMessage: Message | null;
  closeMessageViewer: () => void;
  deleteMailbox: () => void;
}

const MessageViewer: React.FC<Props> = ({
  selectedMessage,
  closeMessageViewer,
  deleteMailbox,
}) => {
  return (
    <div className="w-1/2 bg-[#0d0c0e] p-6 overflow-auto border border-zinc-800">
      {selectedMessage ? (
        <>
          <p className="text-xs font-semibold text-gray-500 mb-1">
            {selectedMessage.date}
          </p>
          <h3 className="text-lg font-semibold text-white">
            {selectedMessage.from}
          </h3>
          <h3 className="text-white text-lg mb-2">{selectedMessage.subject}</h3>
          <div className="bg-black rounded-lg p-4 mt-8 w-[100%]">
            <code className="text-white">
              <p className="mt-2">{selectedMessage.body}</p>
            </code>
          </div>
          <div className="flex items-center justify-left mt-8 space-x-3">
            <button
              className="flex items-center py-2 px-4 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] mt-8 text-white h-8 rounded-xl w-auto"
              onClick={closeMessageViewer}
            >
              <XMarkIcon className="h-5 mr-2" /> Close Email
            </button>

            <button
              className="flex items-center py-2 px-4 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] mt-8 text-white h-8 rounded-xl w-auto"
              onClick={deleteMailbox}
            >
              <TrashIcon className="h-5 mr-2" /> Delete Inbox
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-md font-semibold text-gray-500 text-center w-full">
            Select a message to view
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageViewer;
