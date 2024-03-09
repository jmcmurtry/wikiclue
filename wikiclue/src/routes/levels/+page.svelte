<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import Overlay from "../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { levels } from "../../store/gameplay";

    const isOverlayOpen = writable(false);
    let searchTerm = "";
    const wordsToFind = ["Sample", "Words"]; // this will need to change to actual algo code
    let incorrectAnswer = false;
    let gameOver = false;
    let correctOverlay = false;

    onMount(() => {
        loadWordsToFind();
        // window.addEventListener('beforeunload', handleBeforeUnload);
    });

    // function handleBeforeUnload(event: BeforeUnloadEvent) {
    //     if($isOverlayOpen) {
    //         rush.timeRemaining.subscribe(value => {
    //             loadNextRound();
    //         });
    //     }
    // }

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

    function confirmPressed() {
        incorrectAnswer = false;
        // will need to change the if statement to use actual wikipedia api function
        if (searchTerm.includes(wordsToFind[0]) && searchTerm.includes(wordsToFind[1])) {
            isOverlayOpen.set(true);
            correctOverlay = true;
        } else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    function loadNextLevel() {
        gameOver = false;
        searchTerm = "";
        // need to use actual function to generate new words
        wordsToFind[0] = "New";
        wordsToFind[1] = "Round";
        //
        setWordsToFind();
    }

    function endGame() {
        if (!$isOverlayOpen) {
            gameOver = true;
            // Show end of game pop up and take user back to home page
        }
    }

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $isOverlayOpen) {
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
<div class="levels-page">
    <h1>Level Mode</h1>
    <div class="info-bar">
        <div class="info-container">
            <LevelsIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="level-text">Current Level:</span>
                <span class="streak-content">69</span>
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
        {#if gameOver}
            <button disabled={true}>Confirm Answer</button>
        {:else}
            <button on:click={()=>confirmPressed()}>Confirm Answer</button>
        {/if}
    </div>
    {#if $isOverlayOpen && correctOverlay}
        <Overlay header="Correct!" onClose={() => {isOverlayOpen.set(false); correctOverlay = false}}>
            <p class="popup-description">You found a page that contains the two words! Keep it up!</p>
            <p class="popup-description">Switch this to use colin's end level!</p>
        </Overlay>
    {/if}
</div>

<style>
    @import '../../styles/levelsPageStyles.css';
</style>