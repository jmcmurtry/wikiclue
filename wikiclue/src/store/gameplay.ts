import { writable } from 'svelte/store';

const searchTerm = writable('');
const searchResults = writable([]);

// Guest Gameplay Variables
const guestTimeAllowed = writable(60);
const guestSkipsRemaining = writable(3);

// Levels Variables if needed

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

export { guestPlay, rush, searchTerm, searchResults };
export type {theDaily}
