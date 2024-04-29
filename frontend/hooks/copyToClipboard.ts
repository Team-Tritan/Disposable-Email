import { toast } from "react-toastify";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.success("Email copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return toast.error("Failed to copy email to clipboard.");
  }
  return copyToClipboard;
};

export default copyToClipboard;
