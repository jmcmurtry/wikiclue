import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	type User
} from 'firebase/auth';
import { isAdmin } from './admin';
import { addDoc, getDoc, Timestamp } from 'firebase/firestore';
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
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const userClaims = await userCredential.user.getIdTokenResult();
		isAdmin.set(userClaims.claims.user_id == import.meta.env.VITE_FIREBASE_ADMIN_ID);
	},
	logout: async () => {
		await signOut(auth);
		goto('/');
	},
	forgotPasswordEmail: async (email: string) => {
		await sendPasswordResetEmail(auth, email);
	},
	setUser: async (id: string, email: string, username: string) => {
		const userCollection = collection(db, 'users');

		const userDocRef = doc(userCollection, id);
		await setDoc(userDocRef, {
			email,
			username,
			gameinfo: {
				daily: {
					currentstreak: 0,
					daily: [0, 0, 0, 0, 0, 0],
					played: 0,
					won: 0,
					lastsolve: Timestamp.fromDate(new Date()),
					lastplay: Timestamp.fromDate(new Date(new Date().getTime() - 86400000)),
					currentGuesses: 6
				},
				currenteasylevel: 1,
				currentmediumlevel: 1,
				currenthardlevel: 1,
				totallevels: 0,
				maxstreak: 0,
				rush: 0
			}
		});
	},
	getUserCurrentLevelsData: async (id: string) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);
		try {
			const doc = await getDoc(userDocRef);
			if (doc.exists()) {
				const { currenteasylevel, currentmediumlevel, currenthardlevel } = doc.data().gameinfo;
				return [currenteasylevel, currentmediumlevel, currenthardlevel];
			} else {
				console.log('No such document!');
			}
		} catch (error) {
			console.log('Error getting document:', error);
		}
	},
	verifyLogin: async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
	},
	changePassword: async (password: string) => {
		const user = auth.currentUser;
		if (user) {
			await updatePassword(user, password);
			goto('/login');
		} else {
			console.error('No user is currently signed in.');
		}
	},
	updateRushWins: async (words: string[], timeTaken: number, url: string) => {
		try {
			await addDoc(collection(db, 'rush-wins'), {
				words,
				timeTaken,
				url
			});
		} catch (error) {
			console.error('Error adding document: ', error);
		}
	}
};
