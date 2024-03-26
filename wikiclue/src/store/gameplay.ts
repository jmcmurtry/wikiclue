import { writable } from 'svelte/store';

const searchTerm = writable('');

// Guest Gameplay Variables
const guestTimeAllowed = writable(60);
const guestSkipsRemaining = writable(3);

// Levels Variables if needed
// levelWords is only needed for now until the db is setup
const levelWords = [
	['apple', 'banana'],
	['cat', 'dog'],
	['sun', 'moon'],
	['tree', 'flower'],
	['coffee', 'tea'],
	['book', 'pen'],
	['mountain', 'river'],
	['cake', 'cookie'],
	['music', 'art'],
	['computer', 'phone']
];
const currentLevel = writable(1);

// The Daily Variables if needed

// Rush Variables
const rushTimeAllowed = writable(60);
const rushSkipsRemaining = writable(3);

const guestPlay = {
	timeAllowed: guestTimeAllowed,
	skipsRemaining: guestSkipsRemaining
};

type theDaily = {
    maxStreak: number;
    currentstreak: number;
    currentGuesses: number;
    played: number;
    won: number;
    lastplay: Date;
	lastSolve: Date;
    daily: number[];
};


const rush = {
	timeAllowed: rushTimeAllowed,
	skipsRemaining: rushSkipsRemaining
};

export { guestPlay, rush, currentLevel, levelWords, searchTerm };
export type {theDaily}
