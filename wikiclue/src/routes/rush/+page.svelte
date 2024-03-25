<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import Overlay from "../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { rush } from "../../store/gameplay";
	import { authHandlers } from "../../store/store";

    const isOverlayOpen = writable(false);
    let searchTerm = "";
    let wordsToFind = ["", ""];
    let skipsRemaining: number;
    let timeRemaining: number;
    let streakCount: number;
    let incorrectAnswer = false;
    let gameOver = false;
    let timerInterval: NodeJS.Timeout;
    let correctOverlay = false;
    let skippedOverlay = false;
    let timeAllowed: number;
    let token: string;

    onMount(() => {
        token = sessionStorage.getItem('token') ?? "";
        loadGameplayVariables();
        rush.timeAllowed.subscribe(value => {
            timeAllowed = value;
        });
        startTimer();
        window.addEventListener('beforeunload', handleBeforeUnload); 
    });

    async function loadGameplayVariables() {
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

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        if($isOverlayOpen) {
            rush.timeAllowed.subscribe(value => {
                timeRemaining = value;
                loadNextRound();
            });
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

    async function confirmPressed() {
        incorrectAnswer = false;
        // will need to change the if statement to use actual wikipedia api function
        if (searchTerm.includes(wordsToFind[0]) && searchTerm.includes(wordsToFind[1])) {
            await authHandlers.updateRushWins(wordsToFind, timeAllowed - timeRemaining, "put-real-wikipedia-url-here");
            clearInterval(timerInterval);
            streakCount++;
            isOverlayOpen.set(true);
            correctOverlay = true;
        } else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    async function loadNextRound() {
        rush.timeAllowed.subscribe(value => {
            timeRemaining = value;
        });
        gameOver = false;
        searchTerm = "";
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
        if (event.key === "Enter" && !$isOverlayOpen) {
            confirmPressed();
            return;
        }
    }
</script>

<svelte:window
    on:keydown={onEnterPressed}
/>

<HeaderBar />
<div class="rush-page">
    <h1>Rush Game</h1>
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
    <div class="search-container">
        <p class = "sub-header">Find a Wikipedia page that contains the following words:</p>
        <div class="words-container">
            <p class="search-words">{wordsToFind[0]}</p>
            <p class="search-words">{wordsToFind[1]}</p>
        </div>
        {#if !gameOver}
            <input type="text" class="search-bar" placeholder="Enter the Wikipedia URL here..." bind:value={searchTerm}/>
        {:else}
            <input type="text" class="search-bar" placeholder="Game Over" bind:value={searchTerm} disabled={true}/>
        {/if}
        <p class="incorrect-answer">{incorrectAnswer? "This page does not contain the two words" : "\u00A0"}</p>
    </div>
    <div class="buttons-container">
        {#if skipsRemaining > 0 && !gameOver}
            <button id="skip-button" on:click={()=>skipPressed()}>Skip</button>
        {:else if gameOver}
            <button id="skip-button" disabled={true}>Skip</button>
        {:else}
            <button id="skip-button" disabled={true}>No Skips Left</button>
        {/if}
        <button id="confirm-button" disabled={gameOver} on:click={()=>confirmPressed()}>Confirm Answer</button>
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