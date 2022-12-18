import { writable } from "svelte/store";
import { socketStatus } from "./socket";

export const mailbox = writable({
	inbox: [],
	email: null,
	password: null,
    currentlySelectedEmail: null,
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
		})
		.catch((err) => {
			console.log(err);
		});
};
