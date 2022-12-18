import { writable } from 'svelte/store';
import NewAccount from '../Models/NewAccount.svelte';

export const models = writable({
    currentModel: NewAccount
});