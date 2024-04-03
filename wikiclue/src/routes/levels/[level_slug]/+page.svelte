<script lang="ts">
    import HeaderBar from "../../../components/headerBar.svelte";
    import GameHeader from "../../../components/gameHeader.svelte";
    import Overlay from "../../../components/overlay.svelte";
	import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { searchTerm, searchResults } from '../../../store/gameplay';
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
    let userData: any;
    let userLevelsData: any;

   // Extract the level slug from url
   const level_slug = $page.params.level_slug;
   const [difficulty, levelStr] = level_slug.split("-");
   const levelNumber = parseInt(levelStr);

    onMount(async () => {
        await setupLevel();
	});

    async function setupLevel(){
        searchTerm.set('');
        searchResults.set([]);

        // await new Promise<void>((resolve) => {
        //     auth.onAuthStateChanged(async (user) => {
        //         userData = user;
        //         if(userData){
        //             userLevelsData = await authHandlers.getUserCurrentLevelsData(userData.uid);
        //             if (userLevelsData && difficulty === "easy"){
        //                 currentUserLevel = userLevelsData[0];
        //             }
        //             else if (userLevelsData && difficulty === "medium"){
        //                 currentUserLevel = userLevelsData[1];
        //             }
        //             else if (userLevelsData && difficulty === "hard"){
        //                 currentUserLevel = userLevelsData[2];
        //             }
        //         }
        //         resolve();
        //     });
        // });

        levelData = await authHandlers.getLevels(difficulty);
		loadLevelWords();
    }

    function loadLevelWords() {
        wordsToFind[0] = levelData[levelNumber-1].wordOne;
        wordsToFind[1] = levelData[levelNumber-1].wordTwo;
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

    async function endLevel() {
		// Save level data into database
        isOverlayOpen.set(true);
		levelOver.set(true);
        // await authHandlers.updateUserLevelsData(userData.uid, difficulty, currentUserLevel + 1);
	}

    async function playNextLevelClicked() {
        // Restart page so that the updated data is used
        isOverlayOpen.set(false);
        await setupLevel();
        levelOver.set(false);
	}

    function returnToMainMenuClicked() {
        goto('/home');
	}

    function onEnterPressed(event: KeyboardEvent) {
        if (event.key === "Enter" && $levelOver && !$isOverlayOpen) {
            playNextLevelClicked()
            return;
        }
    }
</script>

<svelte:window on:keydown={onEnterPressed} />

<HeaderBar />
<div class="levels-page">
    <GameHeader header="Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {levelNumber}" arrow={true} backLink="/levels"/>

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
        <Overlay header="Level {currentUserLevel}" displayX={false}>

            <p class="popup-text">Congratulations!</p>
            <div class="level-answer">
                <p class="popup-text">You completed level {currentUserLevel}:</p>
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