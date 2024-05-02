import "dotenv/config";
import express from "express";
import cors from "cors";
import MailboxRoutes from "./routes/mailbox";
import EmailRoutes from "./routes/emails";
import { config } from "./config";
import { initDB } from "./lib/db";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

initDB();

app.disable("x-powered-by");
app.use(express.json());

app.use("/api/mailbox", MailboxRoutes);
app.use("/api/emails", EmailRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({
    error: true,
    status: 404,
    message: "Route not found",
  });
});

const server = app.listen(config.port, () => {
  console.log("> API started on port 4000");
});
