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
  let levelData: any[];
  let userData: any;
  let userLevelsData: any;
  let maxLevel: number;

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

    // Default to easy
    maxLevel = userLevelsData[0];
    levelData = await authHandlers.getLevels('easy');
  });

  async function handleOptionChange(event: { target: any; }) {
      selectedDifficulty = event.target.value;
      levelData = await authHandlers.getLevels(selectedDifficulty);
      if (selectedDifficulty === "easy"){
          maxLevel = userLevelsData[0];
      }
      else if (selectedDifficulty === "medium"){
          maxLevel = userLevelsData[1];
      }
      else if (selectedDifficulty === "hard"){
          maxLevel = userLevelsData[2];
      }
      console.log(maxLevel);
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
      {#if levelData}
          {#each Object.keys(levelData) as level, index}
              {#if index < maxLevel}
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