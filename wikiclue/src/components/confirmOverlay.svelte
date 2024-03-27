<script lang="ts">
    import { fade } from "svelte/transition";

    export let header = "";
    export let onClose = () => {};
    export let onCancel = () => {};
    export let onConfirm= () => {};
    export let displayX = true;
    export let popupText = "";
</script>
  

<div class="overlay" on:click={() => onClose()} on:keydown={() => onClose()} role="button" tabindex="0" transition:fade>
    <div class="popup" on:click|stopPropagation on:keydown|stopPropagation role="button" tabindex="0">
        {#if displayX}
            <button class="close-button" on:click={() => onClose()}>&times;</button>
        {/if}
        <h2 class="popup-title">{header}</h2>
        <p class="popup-text">{popupText}</p>
        <div class="button-container">
            <button class="cancel-button" on:click={onCancel}>Cancel</button>
            <button class="confirm-button" on:click={onConfirm}>Confirm</button>
        </div>
    </div>
</div>

<style>
    @import '../styles/componentStyles/confirmOverlayStyles.css';
</style>