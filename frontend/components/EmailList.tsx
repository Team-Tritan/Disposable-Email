import { IMailboxData } from "@schemas/MailData";
import { LineWave } from "react-loader-spinner";

interface IEmailListProps {
  loading: boolean;
  mailboxData: IMailboxData;
  setSelectedMessage: (message: any) => void;
}

const EmailList: React.FC<IEmailListProps> = ({
  loading,
  mailboxData,
  setSelectedMessage,
}) => {
  return (
    <>
      {loading && (
        <div>
          <div className="flex items-center justify-center">
            <LineWave
              visible={true}
              height="100"
              width="100"
              color="white"
              ariaLabel="line-wave-loading"
            />
          </div>
          <div className="flex items-center justify-center">
            <p className="text-white text-center">
              Establishing real-time connection to the server.
            </p>
          </div>
        </div>
      )}

      {mailboxData && mailboxData.messages.length === 0 && (
        <div>
          <div className="flex items-center justify-center">
            <LineWave
              visible={true}
              height="100"
              width="100"
              color="white"
              ariaLabel="line-wave-loading"
            />
          </div>
          <div className="flex items-center justify-center">
            <p className="text-white text-center">
              Waiting for emails to arrive.
            </p>
          </div>
        </div>
      )}

      {mailboxData &&
        mailboxData.messages.map((message: any) => (
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
    </>
  );
};

export default EmailList;
