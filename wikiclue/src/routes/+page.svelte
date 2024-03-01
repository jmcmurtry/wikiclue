<script lang="ts">
    let searchTerm = "";
    import { goto } from "$app/navigation";
</script>

<div class="landing-page">
    <h1>Welcome to WikiClue</h1>
    <p class = "sub-header">Find a Wikipedia page that contains the following words!</p>
    <div class="words-container">
        <p class="search-words">Sample</p>
        <p class="search-words">Words</p>
    </div>
    <input type="text" class="search-bar" placeholder="Start typing to play..." bind:value={searchTerm}/>
    <div class="buttons-container">
        <button on:click={()=>goto("/login")}>Login</button>
        <button on:click={()=>goto("/signup")}>Sign Up</button>
    </div>
</div>

<style>
    @import '../styles/rootPageStyles.css';
</style>