<script lang="ts">
    import BackIcon from '~icons/ion/arrow-back';

    export let header = "";
    export let arrow: boolean;
</script>

<div class="header-container">
    {#if arrow}
        <a href="/admin">
            <BackIcon style="font-size: 1.5em; color: black"/>
        </a>
    {/if}
    <h1 class="update-header {arrow ? 'extra-spacing' : ''}">{header}</h1>
</div>

<style>
	@import '../styles/componentStyles/adminHeaderStyles.css';
</style>