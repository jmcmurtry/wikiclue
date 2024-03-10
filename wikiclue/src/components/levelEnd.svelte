<script lang="ts">
    import Overlay from "./overlay.svelte";
    import { goto } from '$app/navigation';
	import { writable } from "svelte/store";

    export let currentLevel;
    export let levelWords;
    export let userAnswer;
    const isOverlayOpen = writable(false);
</script>


<Overlay header="Level {currentLevel}" onClose={() => {isOverlayOpen.set(false);}}>
    <p class="popup-text">Congratulations!</p>
    <div class="level-answer">
        <p class="popup-text">You completed level {currentLevel}:</p>
        <h3 class="score">{levelWords[0]}</h3>
        <h3 class="score">{levelWords[1]}</h3>
    </div>
    <div class="level-answer">
        <p class="popup-text">With you answer:</p>
        <h3 class="score">{userAnswer}</h3>
    </div>

    <div class="bottom-options">
        <!-- <button>Play Next Level</button> -->
        <button on:click={() => {goto('/levels');}}>Play Next Level</button>

        <!-- <button>Return to Main Menu</button> -->
        <button on:click={() => {goto('/home');}}>Return to Main Menu</button>
    </div>
</Overlay>

<style>
    @import '../styles/componentStyles/endScreenStyles.css';
</style>