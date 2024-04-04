<script>
    export let isLoading = false;
</script>
  
{#if isLoading}
    <div class="spinner-overlay">
        <div class="spinner"></div>
    </div>
{/if}
  
<style>
    @import '../styles/componentStyles/spinnerStyles.css';
</style>