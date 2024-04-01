<script lang="ts">
    import HeaderBar from "../../../components/headerBar.svelte";
    import GameHeader from "../../../components/gameHeader.svelte";
    import Overlay from "../../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { searchTerm } from '../../../store/gameplay';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { authHandlers } from "../../../store/store";
    import { auth } from "../../../firebase/firebase";
    import { getWikiPageContent } from '../../../store/wiki';
    import SearchComponent from '../../../components/searchComponent.svelte';

    const isOverlayOpen = writable(false);
    const levelOver = writable(false);
    let wordsToFind = [''];
    let incorrectAnswer = false;
	let pageDoesNotExist = false;
    let levelData: any[];
    let currentUserLevel: number;

   // Extract the difficulty slug from url
   const difficulty = $page.params.difficulty;

    onMount(async () => {
        searchTerm.set('');

        await auth.onAuthStateChanged(async (user) => {
            const userData = user;
            if(userData){
                let userLevelsData = await authHandlers.getUserCurrentLevelsData(userData.uid);
                if (userLevelsData && difficulty === "easy"){
                    currentUserLevel = userLevelsData[0];
                }
                else if (userLevelsData && difficulty === "medium"){
                    currentUserLevel = userLevelsData[1];
                }
                else if (userLevelsData && difficulty === "hard"){
                    currentUserLevel = userLevelsData[2];
                }
            }
        });

        levelData = await authHandlers.getLevels(difficulty);
		loadLevelWords();
	});

    function loadLevelWords() {
        // Load the current level words from firebase
        wordsToFind[0] = levelData[currentUserLevel-1].wordOne;
        wordsToFind[1] = levelData[currentUserLevel-1].wordTwo;
    }


    async function levelsConfirmFunction() {
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
            storeData();
			endLevel();
		}

        // Did not find a correct answer
		else {
			incorrectAnswer = true;
			setTimeout(() => {
				incorrectAnswer = false;
			}, 2000);
		}

    }

    function storeData() {
		// Save level data into database
        // Update the current level the user is on
	}

    function endLevel() {
        isOverlayOpen.set(true);
		levelOver.set(true);
	}

    function playNextLevelClicked() {
        // If the current level is updated correctly in storeData, this should work to populate next level data
        window.location.reload();
	}

    function returnToMainMenuClicked() {
        goto('/home');
	}

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $levelOver) {
            playNextLevelClicked()
            return;
        }
    }
</script>

<svelte:window on:keydown={onEnterPressed} />

<HeaderBar />
<div class="levels-page">
    <GameHeader header="Level: {difficulty} {currentUserLevel}" arrow={true} backLink="/home"/>
	<p class="info-text">ahh placeholder</p>

	<div class="game-container">
        <p class="game-description">Find A Wiki page with</p>
        <div class="words-container">
            <p class="search-words">{wordsToFind[0]}</p>
            <p class="search-words">{wordsToFind[1]}</p>
        </div>
		<p class="incorrect-answer">
			{incorrectAnswer ? 'This page does not contain the two words' : '\u00A0'}
			{pageDoesNotExist ? 'This page does not exist' : '\u00A0'}
		</p>
		<SearchComponent gameOver={$levelOver} confirmFunction={levelsConfirmFunction} />
	</div>

    {#if $isOverlayOpen && $levelOver}
        <Overlay header="Level 1" onClose={() => {isOverlayOpen.set(false);}} displayX={false}>

            <p class="popup-text">Congratulations!</p>
            <div class="level-answer">
                <p class="popup-text">You completed level 1:</p>
                <h3 class="score">{wordsToFind[0]}</h3>
                <h3 class="score">{wordsToFind[1]}</h3>
            </div>
            <div class="level-answer">
                <p class="popup-text">With you answer:</p>
                <h3 class="score">{$searchTerm}</h3>
            </div>

            <div class="bottom-options">
                <button class="popup-button" on:click={() => {playNextLevelClicked()}}>Play Next Level</button>
                <hr/>
                <button class="popup-button" on:click={() => {returnToMainMenuClicked()}}>Return to Main Menu</button>
            </div>
        </Overlay>
    {/if}

</div>

<style>
    @import '../../../styles/levelsPageStyles.css';
</style>