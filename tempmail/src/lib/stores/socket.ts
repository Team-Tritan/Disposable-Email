import { writable } from 'svelte/store';

export const socketStatus = writable({
    isConnected: false,
    imapConnected: false,
});

export const SetConnected = () => {
    socketStatus.update((e) => ({
        isConnected: true,
        imapConnected: true
    }));
}