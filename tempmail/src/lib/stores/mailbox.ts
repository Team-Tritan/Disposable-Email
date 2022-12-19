import { writable } from "svelte/store";
import { socketStatus } from "./socket";
import md5 from "blueimp-md5";

export const mailbox = writable({
	inbox: [],
	email: null,
	password: null,
	currentlySelectedEmail: null,
	mailboxNumber: 0,
});

export const GeneratePerminentMailbox = () => {
	socketStatus.update((i) => ({
		imapConnected: false,
		isConnected: false,
	}));

	fetch(`http://localhost:4000/api/mailbox`, {
		method: "POST",
	})
		.then(async (res) => {
			const body = await res.json();

			mailbox.update((i) => ({
				...i,
				email: body.email,
				password: body.password,
			}));

			socketStatus.update((i) => ({
				imapConnected: true,
				isConnected: true,
			}));

			SaveAddress({
				username: body.email,
				password: body.password,
				encryptAccount: false
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const SaveAddress = ({ encryptAccount = false, username, password }) => {
	let accounts = localStorage.getItem("accounts");

	let accountObject = {
		email: username,
		password: password,
	};

	if (encryptAccount) {
		accountObject.password = md5(accountObject.password);
	}

	try {
		let parsed = JSON.parse(accounts);

		parsed.push(accountObject);

		localStorage.setItem("accounts", JSON.stringify(parsed));
	} catch (e) {
		localStorage.setItem("accounts", JSON.stringify([accountObject]));
	}
};

export const FetchMailboxs = () => {
	let accounts = localStorage.getItem("accounts");

	try {
		let parsed = JSON.parse(accounts);

		if(!parsed)
			return [];

		return parsed;
	} catch (err) {
		return [];
	}
};

export const FetchMailboxFromStorage = (i: number = 0) => {

	const mailboxes = FetchMailboxs();

	return mailboxes[0];
};

export const SetMailbox = ({
	username,
	password,
	mailboxNumber
}: {
	username: string;
	password: string;
	mailboxNumber: number;
}) => {
	mailbox.update((e) => ({
		...e,
		email: username,
		password: password,
		inbox: [],
		mailboxNumber: mailboxNumber
	}));
};
