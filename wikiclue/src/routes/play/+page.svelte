<script lang="ts">
    import GuestHeaderBar from "../../components/guestHeaderBar.svelte";
    import GameHeader from "../../components/gameHeader.svelte";
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import { onMount } from "svelte";
    import { searchTerm } from "../../store/gameplay";
	import { authHandlers } from "../../store/store";
    import { getWikiPageContent } from '../../store/wiki';
    import RushEnd from '../../components/rushEnd.svelte';
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
    import SearchComponent from '../../components/searchComponent.svelte';

    let endOverlay = false;
    let wordsToFind = ["", ""];
    let skipsRemaining: number;
    let timeRemaining: number;
    let streakCount: number;
    let pageDoesNotExist = false;
    let incorrectAnswer = false;
    let gameOver = false;
    let timerInterval: NodeJS.Timeout;
    let timeAllowed: number;
    let token: string;
    let maxTime: number;
    let maxSkips: number;
    let correctAnswer = false;
    let skipUsed = false;
    let skipPressedClass = '';
    let correctAnswerClass = "";

    onMount(() => {
        searchTerm.set('');
        token = sessionStorage.getItem('token') ?? "";
        if(token === "") {
            window.location.href = "/";
        }
        loadGameplayVariables();
        startTimer();
    });

    async function loadGameplayVariables() {
        const headers = new Headers();
        headers.append("Authorization", token);
        const response = await fetch("/api/rush-variables", { method: "GET", headers: headers });
        const data = await response.json();
        wordsToFind[0] = data.wordsToFind[0];
        wordsToFind[1] = data.wordsToFind[1];
        skipsRemaining = data.skipsRemaining;
        streakCount = data.streakCount;
        timeRemaining = data.timeRemaining;
        maxTime = data.maxTime;
        maxSkips = data.maxSkips;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining -= 1;
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function skipPressed() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
            skipUsed = true;
            skipPressedClass = 'skip-pressed';
            setTimeout(() => {
                skipUsed = false;
                skipPressedClass = '';
            }, 2000);
            clearInterval(timerInterval);
            loadNextRound();
        }
    }

    async function guestRushConfirmFunction() {
        incorrectAnswer = false;
        let pageContent = await getWikiPageContent($searchTerm);
		if (!pageContent){
			pageDoesNotExist = true;
			setTimeout(() => {
				pageDoesNotExist = false;
			}, 2000);
			return;
		}
		if (pageContent.includes(wordsToFind[0].toLowerCase()) && pageContent.includes(wordsToFind[1].toLowerCase())) {
            correctAnswer = true;
            correctAnswerClass = "correct-answer";
            setTimeout(() => {
                correctAnswer = false;
                correctAnswerClass = "";
            }, 2000);
            await authHandlers.updateRushWins(wordsToFind, timeAllowed - timeRemaining, $searchTerm);
            clearInterval(timerInterval);
            streakCount++;
            await loadNextRound();
        }
        else {
            incorrectAnswer = true;
            setTimeout(() => {
                incorrectAnswer = false;
            }, 2000);
        }
    }

    async function loadNextRound() {
        timeRemaining = maxTime;
        gameOver = false;
        searchTerm.set("");
        const response = await fetch("/api/word-generation");
        const words = await response.json();
        wordsToFind[0] = words.word1;
        wordsToFind[1] = words.word2;
        let variables = {
            streakCount: streakCount,
            timeRemaining: timeRemaining,
            skipsRemaining: skipsRemaining,
            maxTime: maxTime,
            maxSkips: maxSkips,
            wordsToFind: [words.word1, words.word2],
        }
        const headers = new Headers();
        headers.append("Authorization", token);
        await fetch('/api/rush-variables', {
			method: 'POST',
            headers: headers,
			body: JSON.stringify({ variables }),
		});
        startTimer();
    }

    function endGame() {
        gameOver = true;
        sessionStorage.clear();
        clearInterval(timerInterval);
        endOverlay = true;
    }

    async function startNewGame() {
        if (browser) {
            timeRemaining = maxTime;
            skipsRemaining = maxSkips;
            const response = await fetch("/api/word-generation");
            const words = await response.json();
            let variables = {
                streakCount: 0,
                timeRemaining: timeRemaining,
                skipsRemaining: skipsRemaining,
                maxTime: maxTime,
                maxSkips: maxSkips,
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
            window.location.reload();
        }
    }
</script>

<GuestHeaderBar />
<div class="rush-page">
    <GameHeader header="Rush" arrow={true} backLink="/"/>
    <div class="info-bar">
        <div class="info-container {correctAnswerClass}">
            <RushIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="streak-text">Current Streak:</span>
                <span class="streak-content">{streakCount !== undefined ? streakCount : 0}</span>
            </p>
        </div>
        <div class="info-container">
            <TimerIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="time-text">Time Remaining:</span>
                <span class="time-content">{timeRemaining !== undefined ? timeRemaining : "00"}</span>
            </p>
        </div>
        <div class="info-container {skipPressedClass}">
            <SkipIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="skips-text">Skips Remaining:</span>
                <span class="skips-content">{skipsRemaining !== undefined ? skipsRemaining : 0}</span>
            </p>
        </div>
    </div>
    <div class="game-container">
        <button class="skip-button" on:click={() => skipPressed()}>Skip</button>
        <p class="game-description">Find A Wiki page with</p>
        <div class="words-container">
            <p class="search-words">{wordsToFind[0]}</p>
            <p class="search-words">{wordsToFind[1]}</p>
        </div>
		<p class="message-container">
            {#if correctAnswer}
                <span class="correct-answer-message">Correct Answer!</span>
            {:else if incorrectAnswer}
                <span class="incorrect-answer">This page does not contain the two words!</span>
            {:else if pageDoesNotExist}
                <span class="page-not-exist">This page does not exist!</span>
            {:else}
                <span class="placeholder">{'\u00A0'}</span>
            {/if}
        </p>
		<SearchComponent gameOver={gameOver} confirmFunction={guestRushConfirmFunction} />
	</div>
    {#if endOverlay}
        <RushEnd
        playAgain={()=>{startNewGame()}} returnToMenu={()=>{goto("/")}} streak={streakCount}/>
    {/if}    
</div>

<style>
    @import '../../styles/rushPageStyles.css';
</style>