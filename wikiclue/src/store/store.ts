import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	type User
} from 'firebase/auth';
import { isAdmin } from './admin';
import { addDoc, getDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { collection, doc, setDoc, query, where } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { auth, db } from '../firebase/firebase';
import { goto } from '$app/navigation';
import type { theDaily } from './gameplay';

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
		sessionStorage.clear();
	},
	logout: async () => {
		await signOut(auth);
		sessionStorage.clear();
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
	getUserRushData: async (id: string) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);
		try {
			const doc = await getDoc(userDocRef);
			if (doc.exists()) {
				const maxStreak = doc.data().gameinfo.maxstreak;
				return maxStreak;
			} else {
				console.log('No such document!');
			}
		} catch (error) {
			console.log('Error getting document:', error);
		}
	},
	updateUserRushData: async (id: string, maxStreak: number) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);
		try {
			await updateDoc(userDocRef, {
				'gameinfo.maxstreak': maxStreak
			});
		} catch (error) {
			console.error('Error updating document:', error);
		}
	},
	getUsername: async (id: string) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);
		try {
			const doc = await getDoc(userDocRef);
			if (doc.exists()) {
				const username = doc.data().username;
				return username;
			} else {
				console.log('No such document!');
			}
		} catch (error) {
			console.log('Error getting document:', error);
		}
	},
	ensureUniqueUsername: async (username: string) => {
		const userCollection = collection(db, 'users');
		const userReoccurances = await getDocs(
			query(userCollection, where('username', '==', username))
		);
		try {
			if (userReoccurances.size > 0) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			console.error('Error checking username uniqueness:', error);
			return false;
		}
	},
	updateUsername: async (oldUsername: string, newUsername: string) => {
		const userCollection = collection(db, 'users');
		const userInstance = await getDocs(query(userCollection, where('username', '==', oldUsername)));
		try {
			if (userInstance.size === 1) {
				const userDoc = userInstance.docs[0];
				await updateDoc(doc(userCollection, userDoc.id), { username: newUsername });
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Error changing username:', error);
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
	},
	getDailyWords: async () => {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
		const todaysTimeStamp = Timestamp.fromDate(currentDate);
		const dailysCollection = collection(db, 'dailys');

		try {
			const startOfDayTimestamp = new Timestamp(todaysTimeStamp.seconds, 0);
			const endOfDayTimestamp = new Timestamp(todaysTimeStamp.seconds + 86399, 999999999); // 86399 seconds = 23 hours, 59 minutes, 59 seconds
			const dailyQuery = query(
				dailysCollection,
				where('day', '>=', startOfDayTimestamp),
				where('day', '<', endOfDayTimestamp)
			);

			const querySnapshot = await getDocs(dailyQuery);

			if (!querySnapshot.empty) {
				const docData = querySnapshot.docs[0].data();
				return [docData.wordOne, docData.wordTwo];
			} else {
				console.error('No daily words found for the specified date.');
				return [];
			}
		} catch (error) {
			console.error('Error getting daily words: ', error);
			return [];
		}
	},
	getDailyData: async (id: string) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);

		try {
			const docSnap = await getDoc(userDocRef);
			if (docSnap.exists()) {
				const userData = docSnap.data();
				const dailyData: theDaily = {
					maxStreak: userData.gameinfo.maxstreak,
					currentstreak: userData.gameinfo.daily.currentstreak,
					currentGuesses: userData.gameinfo.daily.currentGuesses,
					daily: userData.gameinfo.daily.daily,
					lastplay: userData.gameinfo.daily.lastplay.toDate(),
					lastSolve: userData.gameinfo.daily.lastsolve.toDate(),
					played: userData.gameinfo.daily.played,
					won: userData.gameinfo.daily.won
				};

				return dailyData;
			} else {
				console.error('No such document!');
			}
		} catch (error) {
			console.error('Error getting user daily information', error);
		}

		// Return a default theDaily object
		return {
			maxStreak: 0,
			currentstreak: 0,
			currentGuesses: 0,
			daily: [],
			lastplay: new Date(),
			lastSolve: new Date(),
			played: 0,
			won: 0
		};
	},
	updateDaily: async (userData: theDaily, id: string) => {
		const userCollection = collection(db, 'users');
		const userDocRef = doc(userCollection, id);

		try {
			await updateDoc(userDocRef, {
				'gameinfo.maxstreak': userData.maxStreak,
				'gameinfo.daily.currentGuesses': userData.currentGuesses,
				'gameinfo.daily.currentstreak': userData.currentstreak,
				'gameinfo.daily.daily': userData.daily,
				'gameinfo.daily.lastplay': Timestamp.fromDate(userData.lastplay),
				'gameinfo.daily.lastsolve': Timestamp.fromDate(userData.lastSolve),
				'gameinfo.daily.played': userData.played,
				'gameinfo.daily.won': userData.won
			});
		} catch (error) {
			console.error('Error adding document: ', error);
		}
	}
};
