<script lang="ts">
    import GuestHeaderBar from "../../components/guestHeaderBar.svelte";
    import RushIcon from '~icons/nimbus/fire';
    import TimerIcon from '~icons/material-symbols/timer-outline';
    import SkipIcon from '~icons/bi/skip-forward';
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
    let timeAllowed = 100;

    onMount(() => {
        loadStreakCount();
        loadTimeRemaining();
        loadSkipsRemaining();
        loadWordsToFind();
        rush.timeAllowed.subscribe(value => {
            timeAllowed = value;
        });
        startTimer();
        window.addEventListener('beforeunload', handleBeforeUnload); 
    });

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        if($isOverlayOpen) {
            rush.timeAllowed.subscribe(value => {
                timeRemaining = value;
                loadNextRound();
            });
        }
    }

    function loadStreakCount() {
        if (browser) {
            const savedStreakCount = sessionStorage.getItem('streakCount');
            if (savedStreakCount !== null) {
                streakCount = JSON.parse(savedStreakCount);
            }
        }
    }

    function loadTimeRemaining() {
        if (browser) {
            const savedTimeRemaining = sessionStorage.getItem('timeRemaining');
            if (savedTimeRemaining !== null) {
                timeRemaining = JSON.parse(savedTimeRemaining);
            }
        }
    }

    function loadSkipsRemaining() {
        if (browser) {
            const savedSkipsRemaining = sessionStorage.getItem('skipsRemaining');
            if (savedSkipsRemaining !== null) {
                skipsRemaining = JSON.parse(savedSkipsRemaining);
            }
            else {
                skipsRemaining = 0;
            }
        }
    }

    function loadWordsToFind() {
        if (browser) {
            const savedFirstWord = sessionStorage.getItem('firstWord');
            const savedSecondWord = sessionStorage.getItem('secondWord');
            if (savedFirstWord !== null && savedSecondWord !== null) {
                wordsToFind[0] = JSON.parse(savedFirstWord);
                wordsToFind[1] = JSON.parse(savedSecondWord);
            }
        }
    }

    function setWordsToFind() {
        sessionStorage.setItem('firstWord', JSON.stringify(wordsToFind[0]));
        sessionStorage.setItem('secondWord', JSON.stringify(wordsToFind[1]));
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

    $: if (browser && streakCount) sessionStorage.setItem('streakCount', JSON.stringify(streakCount));
    $: if (browser && timeRemaining >= 0) sessionStorage.setItem('timeRemaining', JSON.stringify(timeRemaining));
    $: if (browser && skipsRemaining >= 0) sessionStorage.setItem('skipsRemaining', JSON.stringify(skipsRemaining));

    function skipPressed() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
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
        setWordsToFind();
        startTimer();
    }

    function endGame() {
        if (!$isOverlayOpen) {
            gameOver = true;
            // Show end of game pop up and take user back to home page
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

<GuestHeaderBar />
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
            <button on:click={()=>skipPressed()}>Skip</button>
        {:else if gameOver}
            <button disabled={true}>Skip</button>
        {:else}
            <button disabled={true}>No Skips Left</button>
        {/if}
        {#if gameOver}
            <button disabled={true}>Confirm Answer</button>
        {:else}
            <button on:click={()=>confirmPressed()}>Confirm Answer</button>
        {/if}
    </div>
    {#if $isOverlayOpen && correctOverlay}
        <Overlay header="Correct!" onClose={() => {loadNextRound(); isOverlayOpen.set(false); correctOverlay = false}}>
            <p class="popup-description">You found a page that contains the two words! Keep it up!</p>
            <div class="popup-container">
                <RushIcon style="font-size: 2rem; color: black;"/>
                <p class="popup-text">Current Streak: {streakCount}</p>
            </div>
            <button class="button-text" on:click={() => {loadNextRound(); isOverlayOpen.set(false); correctOverlay = false}}>Next Round</button>
        </Overlay>
    {/if}
    {#if $isOverlayOpen && skippedOverlay}
        <Overlay header="Skipped!" onClose={() => {loadNextRound(); isOverlayOpen.set(false); skippedOverlay = false}}>
            <p class="popup-description">You have skipped this round!</p>
            <div class="popup-container">
                <SkipIcon style="font-size: 2rem; color: black;"/>
                <p class="popup-text">Skips Remaining: {skipsRemaining}</p>
            </div>
            <button class="button-text" on:click={() => {loadNextRound(); isOverlayOpen.set(false); skippedOverlay = false}}>Next Round</button>
        </Overlay>
    {/if}
</div>

<style>
    @import '../../styles/rushPageStyles.css';
</style>