interface Props {
  setCreating: React.Dispatch<React.SetStateAction<boolean>>;
  generateRandomCredentials: () => string;
  APIBaseURL: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  toast: any;
}

const useCreateTemporaryEmail = ({
  setCreating,
  generateRandomCredentials,
  APIBaseURL,
  setEmail,
  setPassword,
  toast,
}: Props) => {
  const createTemporaryEmail = async () => {
    const localStorage = window.localStorage;

    setCreating(true);

    const randomUsername = generateRandomCredentials();
    const randomPassword = generateRandomCredentials();

    try {
      const response = await fetch(APIBaseURL + "/api/mailbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: randomUsername,
          password: randomPassword,
        }),
      });

      if (!response.ok) {
        return toast.error(
          "Failed to create temporary email, please try again."
        );
      }

      const data = await response.json();
      setEmail(data.email);
      setPassword(data.password);

      localStorage.setItem("tritan_tempmail_user", data.email);
      localStorage.setItem("tritan_tempmail_pw", data.password);

      setCreating(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return createTemporaryEmail;
};

export default useCreateTemporaryEmail;
