import React from "react";
import useUser from "@store/useUser";
import { LineWave } from "react-loader-spinner";

const EmailList: React.FC = () => {
  const { mailboxData, loading, showSent, setSelectedMessage } = useUser();

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {" "}
      {loading && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <LineWave
            visible={true}
            height="100"
            width="100"
            color="white"
            ariaLabel="line-wave-loading"
          />
          <p className="text-white text-center">
            Establishing real-time connection to the server.
          </p>
        </div>
      )}
      {mailboxData && !showSent && mailboxData.inbox.length === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <LineWave
            visible={true}
            height="100"
            width="100"
            color="white"
            ariaLabel="line-wave-loading"
          />
          <p className="text-white text-center">
            Waiting for emails to arrive.
          </p>
        </div>
      )}
      {mailboxData && showSent && mailboxData.sent.length === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <LineWave
            visible={true}
            height="100"
            width="100"
            color="white"
            ariaLabel="line-wave-loading"
          />
          <p className="text-white text-center">
            You haven&apos;t sent any emails yet.
          </p>
        </div>
      )}
      {mailboxData &&
        !showSent &&
        mailboxData.inbox.map((message: any) => (
          <div
            key={message.id}
            className="flex items-start py-4 border-b border-zinc-800 hover:bg-[#111013] cursor-pointer"
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {message.date}
              </p>
              <h3 className="text-lg font-semibold text-white mb-1">
                {message.from}
              </h3>
              <p className="text-sm font-semibold text-white">
                {message.subject}
              </p>
            </div>
          </div>
        ))}
      {showSent &&
        mailboxData &&
        mailboxData.sent.map((message: any) => (
          <div
            key={message.id}
            className="flex items-start py-4 border-b border-zinc-800 hover:bg-[#111013] cursor-pointer"
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {message.date}
              </p>
              <h3 className="text-lg font-semibold text-white mb-1">
                {message.to}
              </h3>
              <p className="text-sm font-semibold text-white">
                {message.subject}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EmailList;