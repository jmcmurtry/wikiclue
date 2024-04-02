<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import GameHeader from "../../components/gameHeader.svelte";
    import RushIcon from '~icons/nimbus/fire'
    import TimerIcon from '~icons/material-symbols/timer-outline'
    import SkipIcon from '~icons/bi/skip-forward'
    import { onMount } from "svelte";
    import { searchTerm, searchResults } from "../../store/gameplay";
	import { authHandlers } from "../../store/store";
    import { getWikiPageContent } from '../../store/wiki';
    import SearchComponent from '../../components/searchComponent.svelte';
    import RushEnd from '../../components/rushEnd.svelte';
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import { auth } from "../../firebase/firebase";

    let wordsToFind = ["", ""];
    let skipsRemaining: number;
    let timeRemaining: number;
    let streakCount: number;
    let pageDoesNotExist = false;
    let incorrectAnswer = false;
    let gameOver = false;
    let timerInterval: NodeJS.Timeout;
    let endOverlay = false;
    let timeAllowed: number;
    let token: string;
    let maxTime: number;
    let maxSkips: number;
    let userData: any;
    let rushMaxStreak: number;
    let correctAnswer = false;
    let skipPressedClass = '';
    let correctAnswerClass = "";
    let skipButtonPressed = false;
    let autoSkipUsed = false;

    onMount(async () => {
        await auth.onAuthStateChanged(async (user) => {
            userData = user;
        });
        searchTerm.set('');
        token = sessionStorage.getItem('token') ?? "";
        if(token === "") {
            window.location.href = "/home";
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
                if (skipsRemaining > 0) {
                    autoSkipUsed = true;
                    setTimeout(() => {
                        autoSkipUsed = false;
                    }, 2000);
                    skipPressed();
                } else {
                    gameOver = true;
                    clearInterval(timerInterval);
                    endGame();
                }
            }
        }, 1000);
    }

    function skipPressed() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
            skipPressedClass = 'skip-pressed';
            setTimeout(() => {
                skipPressedClass = '';
            }, 2000);
            clearInterval(timerInterval);
            loadNextRound();
        } else {
            skipButtonPressed = true;
            setTimeout(() => {
                skipButtonPressed = false;
            }, 2000);
        }
    }

    async function rushConfirmFunction() {
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
        if (!gameOver){
            timeRemaining = maxTime;
            gameOver = false;
            searchTerm.set('');
            searchResults.set([]);
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
    }

    async function endGame() {
        gameOver = true;
        sessionStorage.clear();
        clearInterval(timerInterval);
        rushMaxStreak = await authHandlers.getUserRushData(userData.uid);
        if (streakCount > rushMaxStreak) {
            await authHandlers.updateUserRushData(userData.uid, streakCount);
            rushMaxStreak = streakCount;
        }
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

<HeaderBar />
<div class="rush-page">
    <GameHeader header="Rush" arrow={true} backLink="/home"/>
    <div class="info-bar">
        <div class="info-container {correctAnswerClass}">
            <RushIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="streak-text">Current Streak:</span>
                <span class="streak-content">{streakCount !== undefined ? streakCount : ""}</span>
            </p>
        </div>
        <div class="info-container">
            <TimerIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="time-text">Time Remaining:</span>
                <span class="time-content">{timeRemaining !== undefined ? timeRemaining : ""}</span>
            </p>
        </div>
        <div class="info-container {skipPressedClass}">
            <SkipIcon style="font-size: 2rem; color: black;"/>
            <p class="info-text">
                <span class="skips-text">Skips Remaining:</span>
                <span class="skips-content">{skipsRemaining !== undefined ? skipsRemaining : ""}</span>
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
            {:else if autoSkipUsed}
                <span class="auto-skip-message">Round automatically skipped!</span>
            {:else if incorrectAnswer}
                <span class="incorrect-answer">This page does not contain the two words!</span>
            {:else if pageDoesNotExist}
                <span class="page-not-exist">This page does not exist!</span>
            {:else if skipButtonPressed && skipsRemaining <= 0}
                <span class="no-skips">You have no skips remaining!</span>
            {:else}
                <span class="placeholder">{'\u00A0'}</span>
            {/if}
        </p>
		<SearchComponent gameOver={gameOver} confirmFunction={rushConfirmFunction} />
	</div>
    {#if endOverlay}
        <RushEnd
        playAgain={()=>{startNewGame()}} returnToMenu={()=>{goto("/home")}} streak={streakCount} maxStreak={rushMaxStreak}/>
    {/if}
</div>

<style>
    @import '../../styles/rushPageStyles.css';
</style>