<script lang="ts">
	import HeaderBar from '../../components/headerBar.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Overlay from '../../components/overlay.svelte';
	import { goto } from '$app/navigation';

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
	let statistics = { 'Played': 0, 'Win %': '0%', 'Current Streak': 0, 'Max Streak': 0 };
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
		// Call to db to get daily words
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
			'Played': totalTimesPlayed,
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
	<h1 class="guesses-remaining">Guesses Remaining: {guessesRemaining}</h1>
	<div class="search-container">
		<p class="sub-header">Find a Wikipedia page that contains the following words:</p>
		<div>
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
		<Overlay
			header="Daily Challenge"
			onClose={() => {
				goto('/home');
			}}
		>
			<p class="popup-text">Statistics</p>
			<div class="stats-container">
				{#each Object.entries(statistics) as [key, value]}
					<div class="stat">
						<h3 class="stat-figure">{value}</h3>
						<p class="stat-name">{key}</p>
					</div>
				{/each}
			</div>
			<p class="popup-text">Guess Distribution</p>
			<div class="guess-distribution">
				{#each guessDistribution as amount, index}
					<div class="daily-guess">
						<p class="guess-amount">{index + 1}</p>
						<div class="guess-bar" style="width: calc({amount} / {4} * 80%);">
							<p class="times-guessed">
								{amount}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="bottom-options">
				<button
					on:click={() => {
						goto('/home');
					}}>Return to Main Menu</button
				>
			</div>
		</Overlay>
	{/if}
</div>

<style>
	@import '../../styles/dailyPageStyles.css';
	@import '../../styles/componentStyles/endScreenStyles.css';
</style>
