interface IConfig {
  mailcowAPIKey: string;
  mailcowBaseURL: string;
  imapServer: string;
  domains: string[];
  imapPort: string;
  port: number;
}

export const config: IConfig = {
  mailcowAPIKey: "2833E3-2E0327-0494DF-69F03B-061A98",
  mailcowBaseURL: "https://mail.as393577.net",
  imapServer: "mail.as393577.net",
  domains: ["pain.network", "bigcock.tech"],
  imapPort: "143",
  port: 4000,
};
