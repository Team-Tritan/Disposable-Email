import { writable } from "svelte/store";
import NewAccount from "../Models/NewAccount.svelte";

export const models = writable({
	currentModel: null,
});

export const ShowModel = (model: any) => {
	models.update((i) => ({ ...i, currentModel: model }));
};
