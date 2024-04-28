import axios, { Axios } from "axios";
import { config } from "../config";

interface CreateMailbox {
  domain: string;
  name: string;
  quota: string;
  password: string;
  forcePwUpdate: string;
}

export default class Mailcow {
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

  async createMailbox({
    domain,
    name,
    quota,
    password,
    forcePwUpdate,
  }: CreateMailbox) {
    console.log(name, password);
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
        const data = res.data;

        if (res.status == 200) {
          return data;
        } else {
          return null;
        }
      })
      .catch((err) => {
        return null;
      });
  }

  async deleteMailbox(mailbox: string) {
    return await this.axios.post("/api/v1/delete/mailbox", [mailbox]);
  }
}
