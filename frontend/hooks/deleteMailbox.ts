import { toast } from "react-toastify";

interface Props {
  APIBaseURL: string;
  email: string;
  password: string;
  setMailboxData: React.Dispatch<React.SetStateAction<any>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<any>>;
  createTemporaryEmail: () => void;
}

const useDeleteMailbox = ({
  APIBaseURL,
  email,
  password,
  setMailboxData,
  setSelectedMessage,
  createTemporaryEmail,
}: Props) => {
  const deleteMailbox = async () => {
    try {
      let response = await fetch(
        `${APIBaseURL}/api/mailbox/delete?email=${email}&password=${password}`,
        {
          method: "POST",
        }
      );

      if (response.status !== 200) {
        toast.error("Failed to delete mailbox.");
      }

      setMailboxData(null);
      setSelectedMessage(null);
      localStorage.removeItem("tritan_tempmail_user");
      localStorage.removeItem("tritan_tempmail_pw");
      createTemporaryEmail();

      toast.info("Mailbox destroyed successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return deleteMailbox;
};

export default useDeleteMailbox;
