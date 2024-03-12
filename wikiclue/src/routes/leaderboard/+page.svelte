<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
</script>

<HeaderBar />
<div class="leaderboards">
    <h1>Leaderboards</h1>
    <div class="leaderboard-container">
        <div class="leader-container">
            <h2>Levels</h2>
            <p class="leader-description">Highest Level your friends have reached</p>
        </div>
        <div class="leader-container">
            <h2>The Daily</h2>
            <p class="leader-description">Amount of guess it took your friends to solve The Daily</p>
        </div>
        <div class="leader-container">
            <h2>Rush</h2>
            <p class="leader-description">Longest Rush streak your friends have achieved</p>
        </div>
    </div>
</div>

<style>
    @import '../../styles/leaderboardStyles.css';
</style>