<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import GameHeader from "../../components/gameHeader.svelte";
  import { goto } from '$app/navigation';
  import { writable } from "svelte/store";
  import { authHandlers } from "../../store/store";
  import { onMount } from "svelte";

  let selectedDifficulty = 'easy';
  let levelData: any[];

  onMount (async () => {
      levelData = await authHandlers.getLevels('easy');
  });

  async function handleOptionChange(event: { target: any; }) {
      selectedDifficulty = event.target.value;
      levelData = await authHandlers.getLevels(selectedDifficulty);
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
              <button class="level" on:click={() => handleLevelClick(index)}>
                {index + 1}
              </button>
          {/each}
      {:else}
          <p>Loading...</p>
      {/if}
  </div>
</div>

<style>
  @import '../../styles/selectLevelPageStyles.css';
</style>