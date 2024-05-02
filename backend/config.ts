interface IConfig {
  mailcowAPIKey: string;
  mailcowBaseURL: string;
  domains: string[];
  imapServer: string;
  imapPort: string;
  smtpServer: string;
  smtpPort: string;
  port: number;
  dbURI: string;
}

export const config: IConfig = {
  mailcowAPIKey: "2833E3-2E0327-0494DF-69F03B-061A98",
  mailcowBaseURL: "https://mail.as393577.net",
  imapServer: "mail.as393577.net",
  domains: ["pain.network", "bigcock.tech"],
  imapPort: "143",
  smtpServer: "mail.as393577.net",
  smtpPort: "587",
  port: 4000,
  dbURI: "mongodb://data.myinfra.lol:27017/TempMail",
};
