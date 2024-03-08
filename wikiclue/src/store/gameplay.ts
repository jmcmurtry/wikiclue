import { writable } from 'svelte/store';

// Levels Variables
const levelsStreakCount = writable(0);
const levelsTimeRemaining = writable(60);
const levelsSkipsRemaining = writable(3);

// Rush Variables
const rushStreakCount = writable(0);
const rushTimeRemaining = writable(60);
const rushSkipsRemaining = writable(3);

const levels = {
	streakCount: levelsStreakCount,
	timeRemaining: levelsTimeRemaining,
	skipsRemaining: levelsSkipsRemaining
};

const rush = {
	streakCount: rushStreakCount,
	timeRemaining: rushTimeRemaining,
	skipsRemaining: rushSkipsRemaining
};

export { rush, levels };
