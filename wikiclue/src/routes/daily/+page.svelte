<script lang="ts">
	import HeaderBar from '../../components/headerBar.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import DailyEnd from '../../components/dailyEnd.svelte';

	const isOverlayOpen = writable(false);
	let searchTerm = '';
	const wordsToFind = ['Sample', 'Words']; // this will need to change to actual algo code
	let incorrectAnswer = false;
	let gameOver = false;
	let guessesRemaining = 6;
	let today = new Date();
	let maxStreak = 0;
	let currentStreak = 0;
	let totalWins = 0;
	let totalTimesPlayed = 0;
	let guessDistribution: number[] = [];
	let statistics = { Played: 0, 'Win %': '0%', 'Current Streak': 0, 'Max Streak': 0 };
	let monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	onMount(() => {
		loadDailyWords();
		getUserInfo();
	});

	function loadDailyWords() {
		// Load daily words from firebase
		if (browser) {
			const savedFirstWord = sessionStorage.getItem('firstWord');
			const savedSecondWord = sessionStorage.getItem('secondWord');
			if (savedFirstWord !== null && savedSecondWord !== null) {
				wordsToFind[0] = JSON.parse(savedFirstWord);
				wordsToFind[1] = JSON.parse(savedSecondWord);
			}
		}
	}

	function getUserInfo() {
		// Get user info from firebase
		let lastDate = new Date(); // last date completed daily challenge
		let savedRemaining = 2; // guesses remaining on daily challenge
		maxStreak = 7;
		currentStreak = 5;
		totalWins = 30;
		totalTimesPlayed = 50;
		guessDistribution = [4, 1, 3, 3, 4, 1];
		// all above is from api call

		if (
			lastDate.getFullYear() === today.getFullYear() &&
			lastDate.getMonth() === today.getMonth() &&
			lastDate.getDate() === today.getDate()
		) {
			if (savedRemaining === 0) {
				endGame();
			}
			guessesRemaining = savedRemaining;
		} else {
			totalTimesPlayed++;
			storeData();
		}
	}

	function confirmPressed() {
		incorrectAnswer = false;
		// will need to change the if statement to use actual wikipedia api function
		if (searchTerm.includes(wordsToFind[0]) && searchTerm.includes(wordsToFind[1])) {
			currentStreak++;
			totalWins++;
			guessDistribution[6 - guessesRemaining]++;
			if (currentStreak > maxStreak) maxStreak = currentStreak;
			guessesRemaining = 0;
			storeData();
			endGame();
		} else if (guessesRemaining <= 1) {
			guessesRemaining = 0;
			currentStreak = 0;
			storeData();
			endGame();
		} else {
			incorrectAnswer = true;
			guessesRemaining--;
			setTimeout(() => {
				incorrectAnswer = false;
			}, 2000);
			storeData();
		}
	}

	function storeData() {
		// save into database
		// lastDate = today
		// guesses_remaing = guessesRemaining
		// max_streak = maxStreak
		// current_streak = currentStreak
		// total_wins = totalWins
		// total_times_played = totalTimesPlayed
		// guesses_distribution = guessesDistribution
	}

	function formatOverlay() {
		const winPercentage = ((totalWins / totalTimesPlayed) * 100).toFixed(0);
		statistics = {
			Played: totalTimesPlayed,
			'Win %': winPercentage + '%',
			'Current Streak': currentStreak,
			'Max Streak': maxStreak
		};
	}

	function endGame() {
		formatOverlay();
		isOverlayOpen.set(true);
		gameOver = true;
	}

	function onEnterPressed(event: KeyboardEvent) {
		if (event.key === 'Enter' && $isOverlayOpen) {
			isOverlayOpen.set(false);
			return;
		}
		if (event.key === 'Enter' && !$isOverlayOpen) {
			confirmPressed();
			return;
		}
	}
</script>

<svelte:window on:keydown={onEnterPressed} />

<HeaderBar />
<div class="daily-page">
	<h1 class="daily-title">{monthNames[today.getMonth()]} {today.getDate()} Daily Challenge</h1>
	<div class="search-container">
		<p class="sub-header">Find a Wikipedia page that contains the following words:</p>
		<div>
			<h1>Guesses Remaining: {guessesRemaining}</h1>
			<div class="words-container">
				<p class="search-words">{wordsToFind[0]}</p>
				<p class="search-words">{wordsToFind[1]}</p>
			</div>
		</div>
		<input
			type="text"
			class="search-bar"
			placeholder="Enter the Wikipedia URL here..."
			bind:value={searchTerm}
		/>
		<p class="incorrect-answer">
			{incorrectAnswer ? 'This page does not contain the two words' : '\u00A0'}
		</p>
	</div>
	<div class="buttons-container">
		{#if gameOver}
			<button disabled={true}>Confirm Answer</button>
		{:else}
			<button on:click={() => confirmPressed()}>Confirm Answer</button>
		{/if}
	</div>
	{#if $isOverlayOpen && gameOver}
		<DailyEnd {statistics} distribution={guessDistribution} />
	{/if}
</div>

<style>
	@import '../../styles/dailyPageStyles.css';
</style>
