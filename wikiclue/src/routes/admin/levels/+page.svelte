<script lang="ts">
    import AdminHeader from "../../../components/adminHeader.svelte";
    import AdminHeaderBar from "../../../components/adminHeaderBar.svelte";
    import Overlay from "../../../components/overlay.svelte";
    import { writable } from "svelte/store";

    const isAddOverlayOpen = writable(false);
    const isEditOverlayOpen = writable(false);
    let selectedDifficulty = '';
    let selectedLevel: number | null = null;
    let wordOne = '';
    let wordTwo = '';


    let levels = Array.from({ length: 30 }, (_, i) => i + 1);

    function handleOptionChange(event: { target: any; }) {
        selectedDifficulty = event.target.value;
        // needs to update sqaures
    }

    function handleAddLevel() {
        isAddOverlayOpen.set(true);
        selectedLevel = 31;
    }

    function viewLevel(level: number) {
        selectedLevel = level;
        isEditOverlayOpen.set(true);
    }
    
</script>
  

<AdminHeaderBar />
<div class="update-level">
    <AdminHeader header="Update Levels" arrow={true}/>

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
        <button class="add-level-button" on:click={handleAddLevel}>
            Add Level +
        </button>
    </div>

    <div class="level-options-container">
        {#each levels as square}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="level" role="button" tabindex={square} on:click={() => viewLevel(square)}>
                {square}
            </div>
        {/each}
    </div>

    {#if $isAddOverlayOpen}
        <Overlay header="Level {selectedLevel}" onClose={() => {isAddOverlayOpen.set(false);}}>
            <p class ="input-label">First Word</p>
            <input type="text" class="word-input" placeholder="Enter the first word ..." bind:value={wordOne}/>
            <p class ="input-label">Second Word</p>
            <input type="text" class="word-input" placeholder="Enter the second word..." bind:value={wordTwo}/>
            <div class="select-difficulty">
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
            <button class="save-button">Create Level</button>
        </Overlay>   
    {/if}

    {#if $isEditOverlayOpen}
        <Overlay header="Level {selectedLevel}" onClose={() => {isEditOverlayOpen.set(false);}}>
            <p class ="input-label">First Word</p>
            <input type="text" class="word-input" bind:value={wordOne}/>
            <p class ="input-label">Second Word</p>
            <input type="text" class="word-input" bind:value={wordTwo}/>
            <button class="save-button">Save Level</button>
        </Overlay>   
    {/if}

    
    
</div>

<style>
	@import '../../../styles/updateLevelPageStyles.css';
</style>