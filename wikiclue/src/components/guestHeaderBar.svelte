<script>
	import { goto } from "$app/navigation";
</script>

<nav class="header-bar">
    <div class="content-container">
        <p class="name">WikiClue</p>
        <div class="links-container">
            <button on:click={()=>goto('/login')}>Login</button>
        </div>
    </div>
</nav>

<style>
    @import '../styles/componentStyles/headerBarStyles.css';
</style>