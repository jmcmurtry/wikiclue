<script lang="ts">
	import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
	import { writable } from "svelte/store";
	import { guestPlay } from "../store/gameplay";
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
	import Overlay from "../components/overlay.svelte";

    const isOverlayOpen = writable(false);
    let timeRemaining: number;
    let skipsRemaining: number;

    async function play() {
        if (browser) {
            guestPlay.timeAllowed.subscribe(value => {
                timeRemaining = value;
            });
            guestPlay.skipsRemaining.subscribe(value => {
                skipsRemaining = value;
            });
            const response = await fetch("/api/word-generation");
            const words = await response.json();
            let variables = {
                streakCount: 0,
                timeRemaining: timeRemaining,
                skipsRemaining: skipsRemaining,
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
            goto("/play");
        }
    }
</script>

<div class="landing-page">
    <h1>Welcome to WikiClue</h1>
    <div class="content-container">
        <button on:click={()=>isOverlayOpen.set(true)}>Play</button>
        <div class="divider-container">
            <div class="divider"/>
                <p class="divider-text">or</p>
            <div class="divider"/>
        </div>
        <div class="buttons-container">
            <button on:click={()=>goto("/login")}>Login</button>
            <button on:click={()=>goto("/signup")}>Sign Up</button>
        </div>
    </div>
    {#if $isOverlayOpen}
        <Overlay header="Play!" onClose={() => {isOverlayOpen.set(false);}}>
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
            <button class="popup-button" on:click={() => play()}>Play Now!</button>
        </Overlay> 
    {/if}
</div>

<style>
    @import '../styles/rootPageStyles.css';
</style>