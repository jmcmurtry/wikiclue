import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	type User
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { auth, db } from '../firebase/firebase';
import { goto } from '$app/navigation';

export const authStore = writable<{ user: User | null }>({
	user: null
});

export const authHandlers = {
	signup: async (email: string, password: string) => {
		return await createUserWithEmailAndPassword(auth, email, password);
	},
	login: async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
		goto('/home');
	},
	logout: async () => {
		await signOut(auth);
		goto('/');
	},
	forgotPasswordEmail: async (email: string) => {
		await sendPasswordResetEmail(auth, email);
	},
	setUser: async (id: string, email: string, name: string) => {
		const userCollection = collection(db, 'users');

		const userDocRef = doc(userCollection, id);
		console.log(userDocRef);
		await setDoc(userDocRef, {
			email,
			name,
			gameinfo: {
				currentstreak: 0,
				daily: [0, 0, 0, 0, 0, 0, 0],
				gamesplayed: 0,
				lastsolve: Timestamp.fromDate(new Date()),
				levels: 1,
				maxstreak: 0,
				rush: 0
			}
		});
	}
};
