<script lang="ts">
    import Overlay from "./overlay.svelte";
    import RushIcon from '~icons/nimbus/fire'

    export let playAgain = () => {};   
    export let returnToMenu = () => {};
    export let streak: number;
    export let maxStreak: number;
</script>


<Overlay header="Rush" onClose={() => {}} displayX={false}>
    <p class="popup-text">Game Over!</p>
    <p class="popup-text">You completed your rush game with a streak of:</p>
    <h3 class="score">
        <RushIcon style="font-size: 2rem; color: black; padding-right: 10px"/>
        <p>{streak}</p>
    </h3>
    <p class="popup-text">Rush All Time Record: {maxStreak}</p>
    <div class="bottom-options">
        <button class="popup-button" on:click={()=>{playAgain()}}>Play Again</button>
        <button class="popup-button" on:click={()=>{returnToMenu()}}>Return to Main Menu</button>
    </div>
</Overlay>

<style>
    @import '../styles/componentStyles/rushEndStyles.css';
</style>