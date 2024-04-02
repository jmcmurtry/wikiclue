<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import GameHeader from "../../components/gameHeader.svelte";
  import { writable } from "svelte/store";
  import { authHandlers } from "../../store/store";
  import { onMount } from "svelte";

  const isAddOverlayOpen = writable(false);
  const isEditOverlayOpen = writable(false);
  let selectedDifficulty = 'easy';
  let selectedLevel: number;
  let levelData: any[];
  let wordOne = '';
  let wordTwo = '';

  onMount (async () => {
      levelData = await authHandlers.getLevels('easy');
  });

  async function handleOptionChange(event: { target: any; }) {
      selectedDifficulty = event.target.value;
      levelData = await authHandlers.getLevels(selectedDifficulty);
  }

  function handleAddLevel() {
      wordOne = '';
      wordTwo = '';
      isAddOverlayOpen.set(true);
  }

  async function handleCreateLevel() {
      await authHandlers.updateLevel(selectedDifficulty, levelData.length, {wordOne, wordTwo});
      isAddOverlayOpen.set(false);
      levelData = await authHandlers.getLevels(selectedDifficulty);
  }

  async function handleChangeLevel() {
      await authHandlers.updateLevel(selectedDifficulty, selectedLevel - 1, {wordOne, wordTwo});
      isEditOverlayOpen.set(false);
      levelData = await authHandlers.getLevels(selectedDifficulty);
  }

  function viewLevel(level: number) {
      wordOne = '';
      wordTwo = '';
      selectedLevel = level;
      isEditOverlayOpen.set(true);
      const levelWords = levelData[level - 1];
      wordOne = levelWords.wordOne;
      wordTwo = levelWords.wordTwo;
  }

</script>


<HeaderBar />
<div class="select-level-page">
  <GameHeader header="Pick a level to play" arrow={true} backLink="/home"/>

  <div class="options-container">

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
  </div>

  <div class="level-options-container">
      {#if levelData}
          {#each Object.keys(levelData) as level, index}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="level" role="button" tabindex={index} on:click={() => viewLevel(index + 1)}>
                  {index + 1}
              </div>
          {/each}
      {:else}
          <p>Loading...</p>
      {/if}
  </div>
</div>

<style>
  @import '../../styles/selectLevelPageStyles.css';
</style>