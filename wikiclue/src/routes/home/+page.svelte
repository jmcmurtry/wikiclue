<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import DailyIcon from '~icons/ion/calendar-outline'
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import Overlay from "../../components/overlay.svelte";
	import { writable } from "svelte/store";

    export let levelsOpen = false;
    export let dailyOpen = false;
    export let rushOpen = false;

    const isOverlayOpen = writable(false);
</script>

<HeaderBar />
<div class="home-page">
    <h1>Welcome to WikiClue</h1>
    <div class="games-container">
        <div class="game-container">
            <h2>Levels</h2>
            <LevelsIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Think you can complete 30 levels of increasing difficulty?</p>
            <button on:click={() => {isOverlayOpen.set(true); levelsOpen = true;}}>Play Levels</button>
        </div>
        <div class="game-container">
            <h2>The Daily</h2>
            <DailyIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How fast can you solve the daily problem?</p>
            <button on:click={() => {isOverlayOpen.set(true); dailyOpen = true;}}>Play The Daily</button>
        </div>
        <div class="game-container">
            <h2>Rush</h2>
            <RushIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How big of a streak can you get?</p>
            <button on:click={() => {isOverlayOpen.set(true); rushOpen = true;}}>Play Rush</button>
        </div>
    </div>
    <div class="buttons-container">
        <button>Add Friends</button>
        <button>View Leaderboards</button>
    </div>
    {#if $isOverlayOpen && levelsOpen}
        <Overlay header="Levels" onClose={() => {isOverlayOpen.set(false); levelsOpen = false;}}>
            <p class="popup-description">In this game mode you will have unlimited time to try and complete 30 levels of increasing difficulty! Are you ready for the challenge?</p>
            <LevelsIcon style="font-size: 4rem; color: black; margin-bottom: 10%"/>
            <button>Play Now!</button>
        </Overlay>   
    {/if}
    {#if $isOverlayOpen && dailyOpen}
        <Overlay header="Daily" onClose={() => {isOverlayOpen.set(false); dailyOpen = false;}}>
            <p class="popup-description">Solve the daily problem as fast as possible! Come back everyday to build your streak!</p>
            <DailyIcon style="font-size: 4rem; color: black; margin-bottom: 10%"/>
            <button>Play Now!</button>
        </Overlay>   
    {/if}
    {#if $isOverlayOpen && rushOpen}
        <Overlay header="Rush" onClose={() => {isOverlayOpen.set(false); rushOpen = false;}}>
            <div class="popup-row">
                <RushIcon style="font-size: 2.5em; color: black"/>
                <p class="popup-text">Try to achieve the longest streak you can</p>
            </div>
            <div class="popup-row">
                <TimerIcon style="font-size: 2.5em; color: black"/>
                <p class="popup-text">You are allowed 3 skips per game</p>
            </div>
            <div class="popup-row">
                <SkipIcon style="font-size: 2.5em; color: black"/>
                <p class="popup-text">You have up to 3 minutes per round</p>
            </div>
            <button>Play Now!</button>
        </Overlay>   
    {/if}
</div>

<style>
    @import '../../styles/homePageStyles.css';
</style>