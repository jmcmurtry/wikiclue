<script>
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import DailyIcon from '~icons/ion/calendar-outline'
    import RushIcon from '~icons/nimbus/fire'
    import { goto } from '$app/navigation';
</script>

<HeaderBar />
<div class="home-page">
    <h1>Welcome to WikiClue</h1>
    <div class="games-container">
        <div class="game-container">
            <h2>Levels</h2>
            <LevelsIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Think you can complete 30 levels of increasing difficulty?</p>
            <button>Play Levels</button>
        </div>
        <div class="game-container">
            <h2>The Daily</h2>
            <DailyIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How fast can you solve the daily problem?</p>
            <button>Play The Daily</button>
        </div>
        <div class="game-container">
            <h2>Rush</h2>
            <RushIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How big of a streak can you get?</p>
            <button>Play Rush</button>
        </div>
    </div>
    <div class="buttons-container">
        <button on:click={()=>goto("/add-friends")}>Add Friends</button>
        <button>View Leaderboards</button>
    </div>
</div>

<style>
    @import '../../styles/homePageStyles.css';
</style>