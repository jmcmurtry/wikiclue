<script lang="ts">
	import HeaderBar from '../../components/headerBar.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Overlay from '../../components/overlay.svelte';
	import { goto } from '$app/navigation';

	const isOverlayOpen = writable(false);
	let searchTerm = '';
	const wordsToFind = ['York', 'Times']; // this will need to change to actual algo code
	let incorrectAnswer = false;
	let pageDoesNotExist = false;
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
	let searchUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=";
	let contentUrl ="https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=";
	const searchResults = writable([])
	let guess = '';
	let selectedResult = -1;

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
		let savedRemaining = 6; // guesses remaining on daily challenge
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

	async function confirmPressed() {
		incorrectAnswer = false;
		let pageExists = await getData();

		if (!pageExists) return;

		if (guess.includes(wordsToFind[0].toLowerCase()) && guess.includes(wordsToFind[1].toLowerCase())) {
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

	async function onKeyPress() {
		if(searchTerm.replace(/\s/g, "") === ''){
			searchResults.set([]);
		}
		else {
			let url = searchUrl + searchTerm;
			const response = await fetch(url);
      const data = await response.json();
			searchResults.set(data[1]);
			selectedResult = -1;
		}
	}

	function onSelectPage(word: string) {
			searchResults.set([]);
			searchTerm = word;
	}

	async function getData() {
    // Check if the search term contains any non-space characters
    if (!/\S/.test(searchTerm)) {
        return false;
    }

    let url = contentUrl + searchTerm;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.query.pages && !data.query.pages[-1]) {
            let htmlContent = data.query.pages[Object.keys(data.query.pages)[0]].revisions[0]["*"];

						// This is to remove html content from api call
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            let textContent = tempDiv.textContent || tempDiv.innerText || "";
            guess = textContent.replace(/\n/g, ' ').replace(/\s\s+/g, ' ').toLowerCase();
            return true;
        } else {
            throw new Error("Page does not exist.");
        }
    } catch (error) {
        pageDoesNotExist = true;
        setTimeout(() => {
            pageDoesNotExist = false;
        }, 2000);
        storeData();
        return false;
    }
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
			if ((selectedRect.top - selectedRect.height) < containerRect.top) {
				// Scroll up
        container.scrollTop -= (containerRect.top - selectedRect.top + selectedRect.height);

			// Selected bottom is lower than container bottom
      } else if ((selectedRect.bottom + selectedRect.height) > containerRect.bottom) {
				// Scroll down
        container.scrollTop += (selectedRect.bottom - containerRect.bottom + selectedRect.height);
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
					<button class="search-result {index === selectedResult ? 'selected' : ''}" on:click={() => onSelectPage(option)}>
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
