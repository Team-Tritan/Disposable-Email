import { useEffect } from "react";
import { toast } from "react-toastify";
import { IMailboxData } from "@schemas/MailData";

interface Props {
  APIBaseURL: string;
  email: string;
  password: string;
  setMailboxData: React.Dispatch<React.SetStateAction<IMailboxData | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const useFetchMailboxData = ({
  APIBaseURL,
  email,
  password,
  setMailboxData,
  setLoading,
}: Props): void => {
  useEffect(() => {
    const fetchMailboxData = async () => {
      const localStorage = window.localStorage;

      try {
        const response = await fetch(
          APIBaseURL + `/api/mailbox?email=${email}&password=${password}`
        );

        if (!response.ok) {
          return toast.error(
            "Unable to fetch mailbox data, please reload the page."
          );
        }

        setLoading(false);
        setMailboxData(await response.json());
      } catch (error: any) {
        localStorage.removeItem("tritan_tempmail_user");
        localStorage.removeItem("tritan_tempmail_pw");
        return toast.error(error.message);
      }
    };

    const interval = setInterval(fetchMailboxData, 10000);

    return () => clearInterval(interval);
  }, [APIBaseURL, email, password, setMailboxData, setLoading]);
};

export default useFetchMailboxData;
