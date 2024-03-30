<script lang="ts">
    import Overlay from "./overlay.svelte";
    let distribution = ['correct', 'pass', 'pass', 'correct', 'wrong', 'correct', 'pass', 'pass', 'correct', 'wrong','correct', 'pass', 'pass', 'correct', 'wrong'];

    export let playAgain = () => {};   
    export let returnToMenu = () => {};
    export let streak: number;
</script>


<Overlay header="Rush" onClose={() => {}} displayX={false}>
    <p class="popup-text">Congratulations!</p>
    <p class="popup-text">You completed your rush game with a streak of:</p>
    <h3 class="score">{streak}</h3>
    <p class="popup-text">Guess Distribution</p>
    <div class="distribution-container">
        {#each distribution as guess, index}
            <div class="guess {guess}">
                <h4 class="guess-number">{index + 1}</h4>
            </div>
        {/each}
    </div>
    <div class="bottom-options">
        <button on:click={()=>{playAgain()}}>Play Again</button>
        <button on:click={()=>{returnToMenu()}}>Return to Main Menu</button>
    </div>
    
</Overlay>

<style>
    @import '../styles/componentStyles/endScreenStyles.css';
</style>