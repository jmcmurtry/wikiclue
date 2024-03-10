<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import LevelEnd from '../../components/levelEnd.svelte';
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { levels } from '../../store/gameplay';

    // export const currentLevel = writable(1);
    const levelOver = writable(false);
    let wordsToFind = ["",""];
    let searchTerm = "";
    let incorrectAnswer = false;
    let currentLevel = 1

    onMount(() => {
		loadLevelWords(currentLevel);
	});

    function loadLevelWords(currentLevel: number) {
        // Load the current level words from firebase, it's just in store/gameplay for now
        wordsToFind[0] = levels.levelWords[currentLevel-1][0];
        wordsToFind[1] = levels.levelWords[currentLevel-1][1];
    }


    function confirmPressed() {
        incorrectAnswer = false;
        // will need to change the if statement to use actual wikipedia api function
        if (searchTerm.includes(wordsToFind[0]) && searchTerm.includes(wordsToFind[1])) {
			storeData();
			endLevel();
        } else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    function storeData() {
		// save into database
	}

    function endLevel() {
		levelOver.set(true);
	}

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $levelOver) {
            levelOver.set(false);
            return;
        }
        if (event.key === "Enter" && !$levelOver) {
            confirmPressed();
            return;
        }
    }
</script>

<svelte:window on:keydown={onEnterPressed} />

<HeaderBar />
<div class="levels-page">
    <h1>Level Mode</h1>
    <div class="info-bar">
        <div class="info-container">
            <LevelsIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="level-text">Current Level:</span>
                <span class="streak-content">{currentLevel}</span>
            </p>
        </div>
    </div>
    <div class="search-container">
        <p class = "sub-header">Find a Wikipedia page that contains the following words:</p>
        <div class="words-container">
            <p class="search-words">{wordsToFind[0]}</p>
            <p class="search-words">{wordsToFind[1]}</p>
        </div>
        {#if !$levelOver}
            <input type="text" class="search-bar" placeholder="Enter the Wikipedia URL here..." bind:value={searchTerm}/>
        {:else}
            <input type="text" class="search-bar" placeholder="Level Over" bind:value={searchTerm} disabled={true}/>
        {/if}
        <p class="incorrect-answer">{incorrectAnswer? "This page does not contain the two words" : "\u00A0"}</p>
    </div>
    <div class="buttons-container">
        {#if $levelOver}
            <button disabled={true}>Confirm Answer</button>
        {:else}
            <button on:click={()=>confirmPressed()}>Confirm Answer</button>
        {/if}
    </div>
    {#if $levelOver}
        <LevelEnd currentLevel={currentLevel} levelWords={wordsToFind} userAnswer={searchTerm}/>
    {/if}
</div>

<style>
    @import '../../styles/levelsPageStyles.css';
</style>