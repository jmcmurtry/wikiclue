<script lang="ts">
    import GuestHeaderBar from "../../components/guestHeaderBar.svelte";
    import GameHeader from "../../components/gameHeader.svelte";
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import Overlay from "../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { rush, searchTerm } from "../../store/gameplay";
	import { authHandlers } from "../../store/store";
    import { getWikiPageContent } from '../../store/wiki';
    import SearchComponent from '../../components/searchComponent.svelte';

    const isOverlayOpen = writable(false);
    let wordsToFind = ["", ""];
    let skipsRemaining: number;
    let timeRemaining: number;
    let streakCount: number;
    let pageDoesNotExist = false;
    let incorrectAnswer = false;
    let gameOver = false;
    let timerInterval: NodeJS.Timeout;
    let correctOverlay = false;
    let skippedOverlay = false;
    let timeAllowed: number;
    let token: string;
    let maxTime: number;

    onMount(() => {
        searchTerm.set('');
        token = sessionStorage.getItem('token') ?? "";
        if(token === "") {
            window.location.href = "/";
        }
        loadGameplayVariables();
        startTimer();
        window.addEventListener('beforeunload', handleBeforeUnload); 
    });

    async function loadGameplayVariables() {
        let rushData = await authHandlers.getRushSettings();
        maxTime = rushData?.timeAllowed;
        const headers = new Headers();
        headers.append("Authorization", token);
        const response = await fetch("/api/rush-variables", { method: "GET", headers: headers });
        const data = await response.json();
        wordsToFind[0] = data.wordsToFind[0];
        wordsToFind[1] = data.wordsToFind[1];
        skipsRemaining = data.skipsRemaining;
        streakCount = data.streakCount;
        timeRemaining = data.timeRemaining;
    }

    async function handleBeforeUnload(event: BeforeUnloadEvent) {
        if($isOverlayOpen) {
            timeRemaining = maxTime;
            await loadNextRound();
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining -= 1;
            } else {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function skipPressed() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
            clearInterval(timerInterval);
            isOverlayOpen.set(true);
            skippedOverlay = true;
        }
    }

    async function guestRushConfirmFunction() {
        incorrectAnswer = false;
        let pageContent = await getWikiPageContent($searchTerm);
		if (!pageContent){
			pageDoesNotExist = true;
			setTimeout(() => {
				pageDoesNotExist = false;
			}, 2000);
			return;
		}

        // Found a correct answer
		if (pageContent.includes(wordsToFind[0].toLowerCase()) && pageContent.includes(wordsToFind[1].toLowerCase())) {
            await authHandlers.updateRushWins(wordsToFind, timeAllowed - timeRemaining, $searchTerm);
            clearInterval(timerInterval);
            streakCount++;
            isOverlayOpen.set(true);
            correctOverlay = true;
        }

        // Did not find a correct answer
        else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    async function loadNextRound() {
        timeRemaining = maxTime;
        gameOver = false;
        searchTerm.set("");
        const response = await fetch("/api/word-generation");
        const words = await response.json();
        wordsToFind[0] = words.word1;
        wordsToFind[1] = words.word2;
        let variables = {
            streakCount: streakCount,
            timeRemaining: timeRemaining,
            skipsRemaining: skipsRemaining,
            wordsToFind: [words.word1, words.word2],
        }
        const headers = new Headers();
        headers.append("Authorization", token);
        await fetch('/api/rush-variables', {
			method: 'POST',
            headers: headers,
			body: JSON.stringify({ variables }),
		});
        startTimer();
    }

    function endGame() {
        if (!$isOverlayOpen) {
            gameOver = true;
            // Show end of game pop up and take user back to home page
            // Also check for refresh logic if user refreshes when end game overlay is open
        }
    }

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $isOverlayOpen) {
            loadNextRound();
            isOverlayOpen.set(false);
            return;
        }
    }
</script>

<svelte:window on:keydown={onEnterPressed} />

<GuestHeaderBar />
<div class="rush-page">
    <GameHeader header="Rush" arrow={true} backLink="/"/>
    <div class="info-bar">
        <div class="info-container">
            <RushIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="streak-text">Current Streak:</span>
                <span class="streak-content">{streakCount !== undefined ? streakCount : 0}</span>
            </p>
        </div>
        <div class="info-container">
            <TimerIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="time-text">Time Remaining:</span>
                <span class="time-content">{timeRemaining !== undefined ? timeRemaining : "00"}</span>
            </p>
        </div>
        <div class="info-container">
            <SkipIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="skips-text">Skips Remaining:</span>
                <span class="skips-content">{skipsRemaining !== undefined ? skipsRemaining : 0}</span>
            </p>
        </div>
    </div>
    <div class="game-container">
        <button class="skip-button" on:click={() => skipPressed()}>Skip</button>
        <p class="game-description">Find A Wiki page with</p>
        <div class="words-container">
            <p class="search-words">{wordsToFind[0]}</p>
            <p class="search-words">{wordsToFind[1]}</p>
        </div>
		<p class="incorrect-answer">
			{incorrectAnswer ? 'This page does not contain the two words' : '\u00A0'}
			{pageDoesNotExist ? 'This page does not exist' : '\u00A0'}
		</p>
		<SearchComponent gameOver={gameOver} confirmFunction={guestRushConfirmFunction} />
	</div>
    {#if $isOverlayOpen && correctOverlay}
        <Overlay header="Correct!" onClose={() => {loadNextRound(); isOverlayOpen.set(false); correctOverlay = false}}>
            <div class="popup-info-container">
                <p class="popup-description">You found a page that contains the two words! Keep it up!</p>
                <div class="streak-container">
                    <RushIcon style="font-size: 3.5rem;"/>
                    <p class="popup-text">Current Streak: {streakCount}</p>
                </div>
            </div>
            <button class="popup-button" on:click={() => {loadNextRound(); isOverlayOpen.set(false); correctOverlay = false}}>Next Round</button>
        </Overlay>
    {/if}
    {#if $isOverlayOpen && skippedOverlay}
        <Overlay header="Skipped!" onClose={() => {loadNextRound(); isOverlayOpen.set(false); skippedOverlay = false}}>
            <div class="popup-info-container">
                <p class="popup-description">You have skipped this round!</p>
                <div class="streak-container">
                    <SkipIcon style="font-size: 3.5rem; color: black;"/>
                    <p class="popup-text">Skips Remaining: {skipsRemaining}</p>
                </div>
            </div>
            
            <button class="popup-button" on:click={() => {loadNextRound(); isOverlayOpen.set(false); skippedOverlay = false}}>Next Round</button>
        </Overlay>
    {/if}
</div>

<style>
    @import '../../styles/rushPageStyles.css';
    @import '../../styles/componentStyles/endScreenStyles.css';
</style>