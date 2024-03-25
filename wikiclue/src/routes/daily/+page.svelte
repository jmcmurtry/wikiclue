<script lang="ts">
	import HeaderBar from '../../components/headerBar.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Overlay from '../../components/overlay.svelte';
	import { goto } from '$app/navigation';
	import { authHandlers, authStore } from '../../store/store';
	import type { theDaily } from '../../store/gameplay';
	import { getWikiPageContent, getWikiSearchResults } from '../../store/wiki';

	const isOverlayOpen = writable(false);
	let searchTerm = '';
	let wordsToFind = ['', '']; // this will need to change to actual algo code
	let incorrectAnswer = false;
	let pageDoesNotExist = false;
	let gameOver = false;
	const MAX_GUESSES = 6;
	const MIN_GUESSES = 0;
	let guessesRemaining = MAX_GUESSES;
	let today = new Date();
	let userData: theDaily;
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
	let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=';
	let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=';
	const searchResults = writable([]);
	let guess = '';
	let selectedResult = -1;

	onMount(() => {
		loadDailyWords();
		getUserInfo();
	});

	async function loadDailyWords() {
		wordsToFind = await authHandlers.getDailyWords();
	}

	async function getUserInfo() {
		authStore.subscribe(async ({ user }) => {
			if (!user) {
				console.error('Unable to grab user id');
				return;
			}

			const uid = user.uid;
			try {
				userData = await authHandlers.getDailyData(uid);

				if (!userData) {
					console.error('No daily data found for the user');
					return;
				}

				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);

				if (isSameDate(userData.lastplay, today)) {
					if (userData.currentGuesses === MIN_GUESSES) {
						endGame();
					}
					guessesRemaining = userData.currentGuesses;
				} else {
					if (!isSameDate(userData.lastSolve, yesterday)) {
						userData.currentstreak = MIN_GUESSES;
					}
					userData.played++;
					userData.currentGuesses = MAX_GUESSES;
					userData.lastplay = today;
					storeData();
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		});
	}

	function isSameDate(date1: Date, date2: Date) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	async function confirmPressed() {
		incorrectAnswer = false;
		let pageContent = await getWikiPageContent(searchTerm);

		if (!pageContent){
			pageDoesNotExist = true;
			setTimeout(() => {
				pageDoesNotExist = false;
			}, 2000);
			return;
		}

		// Found a correct answer
		if (guess.includes(wordsToFind[0].toLowerCase()) && guess.includes(wordsToFind[1].toLowerCase())) {
			userData.currentstreak++;
			userData.won++;
			userData.daily[6 - guessesRemaining]++;
			if (userData.currentstreak > userData.maxStreak) userData.maxStreak = userData.currentstreak;
			guessesRemaining = userData.currentGuesses = MIN_GUESSES;
			userData.lastSolve = today;
			storeData();
			endGame();
		}

		// Out of guesses
		else if (guessesRemaining <= 1) {
			guessesRemaining = userData.currentGuesses = MIN_GUESSES;
			userData.currentstreak = 0;
			storeData();
			endGame();
		}

		// Did not find a correct answer
		else {
			incorrectAnswer = true;
			guessesRemaining--;
			userData.currentGuesses--;
			setTimeout(() => {
				incorrectAnswer = false;
			}, 2000);
			storeData();
		}
	}

	function storeData() {
		authStore.subscribe(async ({ user }) => {
			if (user) {
				const uid = user.uid;
				await authHandlers.updateDaily(userData, uid);
			} else {
				console.error('Unable to grab user id');
			}
		});
	}

	function formatOverlay() {
		const winPercentage = ((userData.won / userData.played) * 100).toFixed(0);
		statistics = {
			'Played': userData.played,
			'Win %': winPercentage + '%',
			'Current Streak': userData.currentstreak,
			'Max Streak': userData.maxStreak
		};
	}

	async function onKeyPress() {
		let newSearchResults = await getWikiSearchResults(searchTerm);
		searchResults.set(newSearchResults);
	}

	function onSelectPage(word: string) {
		searchResults.set([]);
		searchTerm = word;
	}

	function endGame() {
		formatOverlay();
		isOverlayOpen.set(true);
		gameOver = true;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedResult = Math.min(selectedResult + 1, $searchResults.length - 1);
			scrollToSelectedResult();
			return;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedResult = Math.max(selectedResult - 1, 0);
			scrollToSelectedResult();
			return;
		} else if (event.key === 'Enter' && selectedResult !== -1) {
			event.preventDefault();
			searchTerm = $searchResults[selectedResult];
			onKeyPress();
			selectedResult = -1;
			return;
		} else if (event.key === 'Enter' && selectedResult === -1) {
			event.preventDefault();
			confirmPressed();
			return;
		}
	}

	function scrollToSelectedResult() {
		const container = document.querySelector('.search-results-container');
		const selectedElement = document.querySelector('.search-result.selected');

		if (container && selectedElement) {
			const containerRect = container.getBoundingClientRect();
			const selectedRect = selectedElement.getBoundingClientRect();

			// Selected top is higher than container top
			if (selectedRect.top - selectedRect.height < containerRect.top) {
				// Scroll up
				container.scrollTop -= containerRect.top - selectedRect.top + selectedRect.height;

				// Selected bottom is lower than container bottom
			} else if (selectedRect.bottom + selectedRect.height > containerRect.bottom) {
				// Scroll down
				container.scrollTop += selectedRect.bottom - containerRect.bottom + selectedRect.height;
			}
		}
	}
</script>

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
		<p class="incorrect-answer">
			{incorrectAnswer ? 'This page does not contain the two words' : '\u00A0'}
			{pageDoesNotExist ? 'This page does not exist' : '\u00A0'}
		</p>
		<input
			type="text"
			class="search-bar"
			placeholder="Enter the Wikipedia page title here..."
			bind:value={searchTerm}
			on:input={() => onKeyPress()}
			on:keydown={(event) => handleKeyDown(event)}
		/>
		<div class="search-results-container">
			<ul>
				{#each $searchResults as option, index}
					<button
						class="search-result {index === selectedResult ? 'selected' : ''}"
						on:click={() => onSelectPage(option)}
					>
						{option}
					</button>
				{/each}
			</ul>
		</div>
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
				{#each userData.daily as amount, index}
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
