import express from "express";
import { config } from "./config";
import { initDB } from "./lib/db";
import MailboxRoutes from "./routes/mailbox";
import EmailRoutes from "./routes/email";
import cors from "cors";

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
app.use("/api/email", EmailRoutes);

app.all("*", (_, res) => {
  res.status(404).json({
    error: true,
    status: 404,
    message: "Route not found",
  });
});

app.listen(config.port, () => {
  console.log(`> API started on port ${config.port}`);
});
