import axios, { Axios } from "axios";
import { config } from "../config";

interface CreateMailbox {
  domain: string;
  name: string;
  quota: string;
  password: string;
  forcePwUpdate: string;
}

/**
 * @class Mailcow
 * @description Class for interacting with the Mailcow API
 * @param {string} apiKey - The API key for the Mailcow API
 * @param {Axios} axios - The Axios instance
 * @method createMailbox - Create a mailbox
 */
export default class MailcowWrapper {
  private apiKey: string;
  private axios: Axios;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.axios = axios.create({
      baseURL: config.mailcowBaseURL,
      headers: {
        "X-API-Key": config.mailcowAPIKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  /**
   * Creates a mailbox.
   * @param {CreateMailbox} options - The options for creating the mailbox.
   * @returns {Promise<any | null>} - A promise that resolves with the created mailbox data or null if an error occurred.
   */
  async createMailbox({
    domain,
    name,
    quota,
    password,
    forcePwUpdate,
  }: CreateMailbox): Promise<any | null> {
    return await this.axios
      .post("/api/v1/add/mailbox", {
        domain,
        name,
        quota,
        password,
        forcePwUpdate,
        local_part: name,
        password2: password,
        active: "1",
        tls_enforce_in: "0",
        tls_enforce_out: "0",
      })
      .then((res) => {
        const { data, status } = res;

        if (status === 200) {
          return data;
        } else {
          return null;
        }
      })
      .catch((err) => {
        return null;
      });
  }

  /**
   * Deletes a mailbox.
   * @param mailbox - The name of the mailbox to delete.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the mailbox was successfully deleted.
   */
  async deleteMailbox(mailbox: string): Promise<boolean> {
    return await this.axios
      .post("/api/v1/delete/mailbox", [mailbox])
      .then((res) => {
        const { status } = res;

        if (status === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        return false;
      });
  }
}
