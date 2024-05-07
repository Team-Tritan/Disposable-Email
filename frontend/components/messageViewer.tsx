import React from "react";
import useUser from "@store/useUser";
import { XMarkIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

// Function to delete a message
const deleteMessage = async (id: string, email: string, password: string) => {
  try {
    const response = await fetch(`/api/email`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Email": email,
        "X-Auth-Token": password,
        "X-Message-ID": id,
      },
    });

    if (!response.ok) {
      return toast.error("Failed to delete message, please try again.");
    }

    return toast.success("Message deleted successfully.");
  } catch (e: any) {
    return toast.error(e.message);
  }
};

const MessageViewer: React.FC = () => {
  // Get global state from the store so we don't have to pass it to each component
  const { setSelectedMessage, selectedMessage, showSent, email, password } =
    useUser();

  const closeMessageViewer = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="w-1/2 bg-[#0d0c0e] p-6 overflow-auto border border-zinc-800">
      {selectedMessage ? (
        <>
          <p className="text-xs font-semibold text-gray-500 mb-1">
            {selectedMessage.date}
          </p>
          <h3 className="text-lg font-semibold text-white">
            {showSent ? selectedMessage.to : selectedMessage.from}
          </h3>
          <h3 className="text-white text-lg mb-2">{selectedMessage.subject}</h3>
          <div className="bg-black rounded-lg p-4 mt-8 w-[100%]">
            <code className="text-white">
              <p className="mt-2">{selectedMessage.body}</p>
            </code>
          </div>
          <div className="flex items-center justify-left mt-2 space-x-3">
            <button
              className="flex items-center py-2 px-3 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] mt-8 text-white h-8 rounded-xl w-auto"
              onClick={closeMessageViewer}
            >
              <XMarkIcon className="h-6 mr-2" /> Close
            </button>
            {!showSent && (
              <button
                className="flex items-center py-2 px-3 text-sm font-semibold bg-[#1d1d25] hover:bg-[#24242e] mt-8 text-white h-8 rounded-xl w-auto"
                onClick={() => {
                  deleteMessage(selectedMessage.id, email, password);
                  closeMessageViewer();
                }}
              >
                <TrashIcon className="h-5 mr-2" /> Delete
              </button>
            )}
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
