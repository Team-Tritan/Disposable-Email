import axios, { Axios } from "axios";
import { config } from "../config";

interface CreateMailbox {
  name: string;
  email: string;
  passwordPlaintext: string;
  disabled?: boolean;
  superAdmin?: boolean;
  redirectTo?: string[];
  referenceId?: string;
}

/**
 * @class PosteIOWrapper
 * @description Class for interacting with the Poste.io API
 */
export class PosteIOWrapper {
  private axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: config.posteIOBaseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      auth: {
        username: config.posteIOUsername,
        password: config.posteIOPassword,
      },
    });
  }

  /**
   * Creates a mailbox.
   * @param {CreateMailbox} options - The options for creating the mailbox.
   * @returns {Promise<any | null>} - A promise that resolves with the created mailbox data or null if an error occurred.
   */
  async createMailbox(options: CreateMailbox): Promise<any | null> {
    return await this.axios
      .post("/api/v1/boxes", options)
      .then((res) => {
        console.log(options);

        console.log(res.data);
        const { data, status } = res;
        if (status === 200) {
          return {
            email: options.email,
            password: options.passwordPlaintext,
          };
        } else {
          return null;
        }
      })
      .catch(() => {
        return null;
      });
  }

  /**
   * Deletes a mailbox by email.
   * @param email - The email address of the mailbox to delete.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the mailbox was successfully deleted.
   */
  async deleteMailbox(email: string): Promise<boolean> {
    return await this.axios
      .delete(`/api/v1/boxes/${email}`)
      .then((res) => {
        console.log("Response:", res);
        return res.status === 200;
      })
      .catch((err) => {
        console.error("Error:", err.response || err.message);
        return false;
      });
  }
}

export default new PosteIOWrapper();
