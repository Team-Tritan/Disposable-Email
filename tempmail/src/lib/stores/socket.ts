import { writable } from 'svelte/store';

export const socketStatus = writable({
    isConnected: false,
    imapConnected: false,
});