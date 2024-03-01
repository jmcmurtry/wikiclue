import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	type User
} from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from '../firebase/firebase';
import { goto } from "$app/navigation";

export const authStore = writable<{ user: User | null }>({
	user: null
});

export const authHandlers = {
	signup: async (email: string, password: string) => {
		await createUserWithEmailAndPassword(auth, email, password);
	},
	login: async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
		goto("/home");
	},
	logout: async () => {
		await signOut(auth);
	}
};
