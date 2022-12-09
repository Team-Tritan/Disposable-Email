import { Router } from 'express';
import { randomBytes } from 'crypto';
import randomWords from 'random-words';
import Mailcow from '../lib/mailcow';

const Route = Router();

/**
 * Makes a new mailbox
 * POST: /api/mailbox
 */
Route.post("/", async (req, res) => {
    const username  = `${randomWords(1)}${randomBytes(5).toString("hex")}`;
    const password = `${randomBytes(22).toString("hex")}`;

    const mailcow = new Mailcow(process.env.MAILCOW_API_KEY as string);

    const mailcowRes = await mailcow.createMailbox({
        domain: "",
        name: username,
        password: password,
        quota: "3072",
        forcePwUpdate: "0",
    });

    if(!mailcowRes)
        return res.status(500).json({
            error: true,
            message: "internal server error!"
        });

    return res.json({
        username: username,
        password: password,
    });
});

export default Route;