<script lang="ts">
    import { fade } from "svelte/transition";

    export let header = "";
    export let onClose = () => {};
</script>
  

<div class="overlay" on:click={() => onClose()} on:keydown={() => onClose()} role="button" tabindex="0" transition:fade>
    <div class="popup" on:click|stopPropagation on:keydown|stopPropagation role="button" tabindex="0">
        <button class="close-button" on:click={() => onClose()}>&times;</button>
        <h2 class="popup-title">{header}</h2>
        <slot></slot>
    </div>
</div>

<style>
    @import '../styles/componentStyles/overlayStyles.css';
</style>