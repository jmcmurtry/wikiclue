<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import GameHeader from "../../components/gameHeader.svelte";
    import LockIcon from '~icons/carbon/locked';
    import { goto } from '$app/navigation';
    import { writable } from "svelte/store";
    import { auth } from "../../firebase/firebase";
    import { authHandlers } from "../../store/store";
    import { onMount } from "svelte";

    let selectedDifficulty = 'easy';
    let difficultyInt = 0;
    let levelData: any[] = [undefined, undefined, undefined];
    let userData: any;
    let userLevelsData: any;

    onMount (async () => {
        await new Promise<void>((resolve) => {
            auth.onAuthStateChanged(async (user: any) => {
                userData = user;
                if(userData){
                    userLevelsData = await authHandlers.getUserCurrentLevelsData(userData.uid);
                }
                resolve();
            });
        });

        // Load all level data
        levelData[0] = await authHandlers.getLevels('easy');
        levelData[1] = await authHandlers.getLevels('medium');
        levelData[2] = await authHandlers.getLevels('hard');
    });

    async function handleOptionChange(event: { target: any; }) {
        selectedDifficulty = event.target.value;
        if (selectedDifficulty === "easy"){
            difficultyInt = 0;
        }
        else if (selectedDifficulty === "medium"){
            difficultyInt = 1;
        }
        else if (selectedDifficulty === "hard"){
            difficultyInt = 2;
        }
    }

    function handleLevelClick(level: number) {
        goto(`/levels/${selectedDifficulty}-${level+1}`);
    }

</script>


<HeaderBar />
<div class="select-level-page">
    <GameHeader header="Pick a level" arrow={true} backLink="/home"/>

        <div class="change-difficulty">
            <h3>Difficulty:</h3>
            <div class="select">
                <select class="dropdown" on:change={handleOptionChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <span class="focus"></span>
            </div>
        </div>

    <div class="level-options-container">
        {#if levelData[difficultyInt]}
            {#each Object.keys(levelData[difficultyInt]) as level, index}
                {#if index <= userLevelsData[difficultyInt]}
                    <button class="level" on:click={() => handleLevelClick(index)}>
                        {index+1}
                    </button>
                {:else}
                    <button class="level" disabled={true}>
                        <LockIcon style="font-size: 1.5rem; color: black" />
                    </button>
                {/if}
            {/each}
        {:else}
            <p>Loading...</p>
        {/if}
    </div>
</div>

<style>
    @import '../../styles/selectLevelPageStyles.css';
</style>