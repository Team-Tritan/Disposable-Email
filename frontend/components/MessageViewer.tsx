import React from "react";

interface Message {
  date: string;
  from: string;
  subject: string;
  body: string;
}

interface Props {
  selectedMessage: Message | null;
  deleteMailbox: () => void;
}

const MessageViewer: React.FC<Props> = ({ selectedMessage, deleteMailbox }) => {
  return (
    <div className="w-1/2 bg-[#0d0c0e] p-6 overflow-auto border border-zinc-800">
      {selectedMessage ? (
        <>
          <p className="text-xs font-semibold text-gray-500">
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
          <button
            className="flex items-center py-2 px-4 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] rounded mt-8"
            onClick={deleteMailbox}
          >
            Delete Message
          </button>
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
