<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced'
    import DailyIcon from '~icons/ion/calendar-outline'
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import Overlay from "../../components/overlay.svelte";
    import { goto } from '$app/navigation';
	import { writable } from "svelte/store";
    import { browser } from '$app/environment';
    import { authHandlers } from "../../store/store";

    let levelsOpen = false;
    let dailyOpen = false;
    let rushOpen = false;
    const isOverlayOpen = writable(false);
    let timeRemaining: number;
    let skipsRemaining: number;

    async function playRush() {
        if (browser) {
            let rushData = await authHandlers.getRushSettings();
            skipsRemaining = rushData?.skips;
            timeRemaining = rushData?.timeAllowed;
            const response = await fetch("/api/word-generation");
            const words = await response.json();
            let variables = {
                streakCount: 0,
                timeRemaining: timeRemaining,
                skipsRemaining: skipsRemaining,
                maxTime: timeRemaining,
                maxSkips: skipsRemaining,
                wordsToFind: [words.word1, words.word2],
            }
            const postResponse = await fetch('/api/rush-variables', {
            method: 'POST',
            body: JSON.stringify({ variables }),
            });
            if (postResponse.ok) {
                const responseData = await postResponse.json();
                const token = responseData.token;
                sessionStorage.setItem('token', token);
            } else {
                console.error('Failed to store token:', postResponse.statusText);
            }
            goto("/rush");
        }
    }
</script>

<HeaderBar />
<div class="home-page">
    <h1>Welcome to WikiClue</h1>
    <!-- <div class="buttons-container">
        <button on:click={()=>goto("/add-friends")}>Add Friends</button>
        <button on:click={()=>goto("/leaderboard")}>View Leaderboards</button>
    </div>-->
    <div class="games-container">
        <div class="game-container">
            <h2>Levels</h2>
            <LevelsIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Think you can complete 30 levels of increasing difficulty?</p>
            <button class="play-button" on:click={() => {isOverlayOpen.set(true); levelsOpen = true;}}>Play Levels</button>
        </div>
        <div class="game-container">
            <h2>The Daily</h2>
            <DailyIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How fast can you solve the daily problem?</p>
            <button class="play-button" on:click={() => {isOverlayOpen.set(true); dailyOpen = true;}}>Play The Daily</button>
        </div>
        <div class="game-container">
            <h2>Rush</h2>
            <RushIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">How big of a streak can you get?</p>
            <button class="play-button" on:click={() => {isOverlayOpen.set(true); rushOpen = true;}}>Play Rush</button>
        </div>
    </div>

    {#if $isOverlayOpen && levelsOpen}
        <Overlay header="Levels" onClose={() => {isOverlayOpen.set(false); levelsOpen = false;}}>
            <p class="popup-description">In this game mode you will have unlimited time to try and complete 30 levels of increasing difficulty! Are you ready for the challenge?</p>
            <LevelsIcon style="font-size: 5.0rem; color: black; margin: 5%"/>
            <button class="popup-button" on:click={()=>goto("/levels")}>Play Now!</button>
        </Overlay>
    {/if}
    {#if $isOverlayOpen && dailyOpen}
        <Overlay header="The Daily" onClose={() => {isOverlayOpen.set(false); dailyOpen = false;}}>
            <p class="popup-description">Solve the daily problem as fast as possible! Come back everyday to build your streak!</p>
            <DailyIcon style="font-size: 6rem; color: black; margin: 10%"/>
            <button class="popup-button" on:click={()=>goto("/daily")}>Play Now!</button>
        </Overlay>
    {/if}
    {#if $isOverlayOpen && rushOpen}
        <Overlay header="Rush" onClose={() => {isOverlayOpen.set(false); rushOpen = false;}}>
            <div class="popup-row">
                <div class="icon-container">
                    <RushIcon style="font-size: 2.5em; color: black"/>
                </div>
                <p class="popup-text">Try to achieve the longest streak you can</p>
            </div>
            <div class="popup-row">
                <div class="icon-container">
                    <TimerIcon style="font-size: 2.5em; color: black"/>
                </div>
                <p class="popup-text">You are allowed 3 skips per game</p>
            </div>
            <div class="popup-row">
                <div class="icon-container">
                    <SkipIcon style="font-size: 2.5em; color: black"/>
                </div>
                <p class="popup-text">You have up to 3 minutes per round</p>
            </div>
            <button class="popup-button" on:click={() => playRush()}>Play Now!</button>
        </Overlay>
    {/if}
</div>

<style>
	@import '../../styles/homePageStyles.css';
</style>
