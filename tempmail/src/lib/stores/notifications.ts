import type { SvelteComponentTyped } from "svelte";
import { writable } from "svelte/store";

export const notifications = writable<{ value: string, timeout: number, icon: any }[]>([]);