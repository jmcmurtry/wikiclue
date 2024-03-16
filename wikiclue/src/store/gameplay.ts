import { writable } from 'svelte/store';

// Guest Gameplay Variables
const guestStreakCount = writable(0);
const guestTimeRemaining = writable(60);
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
const rushStreakCount = writable(0);
const rushTimeRemaining = writable(60);
const rushSkipsRemaining = writable(3);

const guestPlay = {
	streakCount: guestStreakCount,
	timeRemaining: guestTimeRemaining,
	skipsRemaining: guestSkipsRemaining
};

const theDaily = {
	// Insert the daily variables if needed
};

const rush = {
	streakCount: rushStreakCount,
	timeRemaining: rushTimeRemaining,
	skipsRemaining: rushSkipsRemaining
};

export { guestPlay, rush, currentLevel, levelWords, theDaily };
