import { writable } from 'svelte/store';

// Levels Variables if needed

// The Daily Variables if needed

// Rush Variables
const rushStreakCount = writable(0);
const rushTimeRemaining = writable(60);
const rushSkipsRemaining = writable(3);

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

export { rush, levels, theDaily };
