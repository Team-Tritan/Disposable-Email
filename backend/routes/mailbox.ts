import { Router } from "express";
import { randomBytes } from "crypto";
import randomWords from "random-words";
import Mailcow from "../lib/mailcow";
import ImapWrapper from "../lib/imap";

const Route = Router();
const usernameRegex = /[A-Za-z-_0-9]/gm;

/**
 * Makes a new mailbox
 * POST: /api/mailbox
 */
Route.post("/", async (req, res) => {
	const username = req.body.username
		? req.body.username
		: `${randomWords(1)}${randomBytes(5).toString("hex")}`;
	const password = req.body.password
		? req.body.password
		: `${randomBytes(22).toString("hex")}`;

	if(!usernameRegex.test(username) || username.length > 64)
		return res.status(400).json({
			error: true,
			validation_field: "username",
			message: "Username invalid!"
		});

	if(password.length > 128)
		return res.status(400).json({
			error: true,
			validation_field: "password",
			message: "Password is too long!"
		});

	const mailcow = new Mailcow(process.env.MAILCOW_API_KEY as string);
	const domain = "suckmail.co";

	const mailcowRes = await mailcow.createMailbox({
		domain: domain,
		name: username,
		password: password,
		quota: "40",
		forcePwUpdate: "0",
	});

	if (!mailcowRes)
		return res.status(500).json({
			error: true,
			message: "internal server error!",
		});

	return res.json({
		email: `${username}@${domain}`,
		password: password,
	});
});

Route.get("/", async (req, res) => {
	const auth = req.headers.authorization;

	if (!auth)
		return res.status(401).json({
			error: true,
			message: "Unathorized!",
		});

	const decodedAuth = Buffer.from(auth as string, "base64")
		.toString("utf-8")
		.split(":");

	if (
		decodedAuth.length < 0 ||
		typeof decodedAuth[0] == "undefined" ||
		typeof decodedAuth[1] == "undefined"
	)
		return res.status(401).json({
			error: true,
			message: "Unathorized!",
		});

	let username = decodedAuth[0];
	let password = decodedAuth[1];

	const imap = new ImapWrapper(username, password);

	imap.on("ready", async (cli) => {
		const messages = await cli
			.fetchMessagesSync()
			.then((res) => res)
			.catch((err) => {
				return null;
			});

		imap.imap.end();

		if (messages == null) return res.status(200).send({ messages: [] });

		return res.json({
			messages,
		});
	});

	imap.on("error", () => {
		return res.status(401).json({
			error: true,
			message: "Unathorized!",
		});
	});
});

export default Route;
