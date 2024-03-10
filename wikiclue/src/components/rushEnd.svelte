<script lang="ts">
    import Overlay from "./overlay.svelte";
	import { writable } from "svelte/store";
    export let rushOpen = false;
    let distribution = ['correct', 'pass', 'pass', 'correct', 'wrong', 'correct', 'pass', 'pass', 'correct', 'wrong','correct', 'pass', 'pass', 'correct', 'wrong'];

    const isOverlayOpen = writable(false);
</script>


<Overlay header="Rush" onClose={() => {isOverlayOpen.set(false); rushOpen = false;}}>
    <p class="popup-text">Congratulations!</p>
    <p class="popup-text">You completed your rush game with a streak of:</p>
    <h3 class="score">5</h3>
    <p class="popup-text">Guess Distribution</p>
    <div class="distribution-container">
        {#each distribution as guess, index}
            <div class="guess {guess}">
                <h4 class="guess-number">{index + 1}</h4>
            </div>
        {/each}
    </div>
    <div class="bottom-options">
        <button>Play Again</button>
        <button>Return to Main Menu</button>
    </div>
    
</Overlay>

<style>
    @import '../styles/componentStyles/endScreenStyles.css';
</style>