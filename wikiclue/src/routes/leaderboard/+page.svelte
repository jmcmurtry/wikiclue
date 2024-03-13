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
            <div class ="users-container">
                <p class="leader-name">LitLover911 <span class ="leader-score">Hard 77</span></p>
                <p class="leader-name">Chris_Morroco <span class ="leader-score"> Hard 1</span></p>
                <p class="leader-name">Bonnie <span class ="leader-score">Medium 211</span></p>
                <p class="leader-name">Clyde <span class ="leader-score">Easy 5</span></p>
            </div>
        </div>
        <div class="leader-container">
            <h2>The Daily</h2>
            <p class="leader-description">Amount of guess it took your friends to solve The Daily</p>
            <div class ="users-container">
                <p class="leader-name">Chris_Morroco <span class ="leader-score"> 2</span></p>
                <p class="leader-name">Clyde <span class ="leader-score">3</span></p>
                <p class="leader-name">Bonnie <span class ="leader-score">7</span></p>
                <p class="leader-name">LitLover911 <span class ="leader-score">Over 9000</span></p>
            </div>
        </div>
        <div class="leader-container">
            <h2>Rush</h2>
            <p class="leader-description">Longest Rush streak your friends have achieved</p>
            <div class ="users-container">
                <p class="leader-name">Bonnie <span class ="leader-score">211</span></p>
                <p class="leader-name">LitLover911 <span class ="leader-score">77</span></p>
                <p class="leader-name">Clyde <span class ="leader-score">5</span></p>
                <p class="leader-name">Chris_Morroco <span class ="leader-score"> 1</span></p>
            </div>
        </div>
    </div>
</div>

<style>
    @import '../../styles/leaderboardStyles.css';
</style>