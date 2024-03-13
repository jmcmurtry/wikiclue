<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import Overlay from "../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { currentLevel, levelWords } from '../../store/gameplay';
    import { goto } from '$app/navigation';

    const isOverlayOpen = writable(false);
    const levelOver = writable(false);

    let wordsToFind = ["",""];
    let searchTerm = "";
    let incorrectAnswer = false;

    onMount(() => {
        // When we use the database we need to get the user's current level instead
		loadLevelWords();
	});

    function loadLevelWords() {
        // Load the current level words from firebase, it's just in store/gameplay for now
        wordsToFind[0] = levelWords[$currentLevel-1][0];
        wordsToFind[1] = levelWords[$currentLevel-1][1];
    }


    function confirmPressed() {
        incorrectAnswer = false;
        // will need to change the if statement to use actual wikipedia api function
        if (searchTerm.includes(wordsToFind[0]) && searchTerm.includes(wordsToFind[1])) {
			endLevel();
        } else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    function storeData() {
		// Save level data into database
	}

    function endLevel() {
        storeData;
        isOverlayOpen.set(true);
		levelOver.set(true);
	}

    function playNextLevelClicked() {
        // Reset when we get to the end for now
        if ($currentLevel === 10) {
            currentLevel.set(1);
        } else {
            currentLevel.update(n => n + 1);
        }
        loadLevelWords();
        searchTerm= "";
        levelOver.set(false);
        isOverlayOpen.set(false);
	}

    function returnToMainMenuClicked() {
        currentLevel.set(1);
        goto('/home');
	}

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $levelOver) {
            playNextLevelClicked()
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
                <span class="streak-content">{$currentLevel}</span>
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
            <input type="text" class="search-bar" placeholder="Enter the Wikipedia page title here..." bind:value={searchTerm}/>
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
    {#if $isOverlayOpen && $levelOver}
        <Overlay header="Level {$currentLevel}" onClose={() => {isOverlayOpen.set(false);}} displayX={false}>

            <p class="popup-text">Congratulations!</p>
            <div class="level-answer">
                <p class="popup-text">You completed level {$currentLevel}:</p>
                <h3 class="score">{wordsToFind[0]}</h3>
                <h3 class="score">{wordsToFind[1]}</h3>
            </div>
            <div class="level-answer">
                <p class="popup-text">With you answer:</p>
                <h3 class="score">{searchTerm}</h3>
            </div>

            <div class="bottom-options">
                <button on:click={() => {playNextLevelClicked()}}>Play Next Level</button>
                <button on:click={() => {returnToMainMenuClicked()}}>Return to Main Menu</button>
            </div>
        </Overlay>
    {/if}
</div>

<style>
    @import '../../styles/levelsPageStyles.css';
</style>