<script lang="ts">
	import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
	import { guestPlay } from "../store/gameplay";

    function play() {
        if (browser) {
            guestPlay.streakCount.subscribe(value => {
                sessionStorage.setItem('streakCount', JSON.stringify(value));
            });
            guestPlay.timeRemaining.subscribe(value => {
                sessionStorage.setItem('timeRemaining', JSON.stringify(value));
            });

            guestPlay.skipsRemaining.subscribe(value => {
                sessionStorage.setItem('skipsRemaining', JSON.stringify(value));
            });
            // Will need to change this to some function that actually generates random words
            sessionStorage.setItem('firstWord', JSON.stringify("First"));
            sessionStorage.setItem('secondWord', JSON.stringify("Second"));
            //
            goto("/play");
        }
    }
</script>

<div class="landing-page">
    <h1>Welcome to WikiClue</h1>
    <div class="content-container">
        <button on:click={()=>play()}>Play</button>
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
</div>

<style>
    @import '../styles/rootPageStyles.css';
</style>