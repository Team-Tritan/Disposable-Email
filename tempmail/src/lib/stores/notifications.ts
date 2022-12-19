import type { SvelteComponentTyped } from "svelte";
import { writable } from "svelte/store";

export const notifications = writable<{ value: string, timeout: number, icon: any }[]>([]);

export const AddNotification = (n: { value: string, timeout: number, icon: any }) => {
    notifications.update(i => [...i, n ]);
};