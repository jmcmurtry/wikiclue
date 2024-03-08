import { writable } from 'svelte/store';

// Guest Gameplay Variables
const guestStreakCount = writable(0);
const guestTimeRemaining = writable(60);
const guestSkipsRemaining = writable(3);

// Levels Variables if needed

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

const levels = {
	// Insert levels variables if needed
};

const theDaily = {
	// Insert the daily variables if needed
};

const rush = {
	streakCount: rushStreakCount,
	timeRemaining: rushTimeRemaining,
	skipsRemaining: rushSkipsRemaining
};

export { guestPlay, rush, levels, theDaily };
