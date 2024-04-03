<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import { authHandlers, authStore } from "../../store/store";
    import { onMount } from 'svelte';

    let scores: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
    let easyLevels: Map<string,number> = new Map<string,number>();
    let mediumLevels: Map<string,number> = new Map<string,number>();
    let hardLevels: Map<string,number> = new Map<string,number>();
    let daily: Map<string,number> = new Map<string,number>();
    let rush: Map<string,number> = new Map<string,number>();
    let selectedDifficulty = 'easy';

   async function handleOptionChange(event: { target: any; }) {
        selectedDifficulty = event.target.value;
    }

    async function getFriendsScores(uid: string) {
        try {
            const friendScores = await authHandlers.getScoresForFriends(uid);
            if(friendScores instanceof Map){
            scores = friendScores;
            seperateByScores(scores);
            }
        } catch (error) {
            console.error('Error getting friend scores:', error);
            scores = new Map<string, Map<string, number>>();
        }
    }

    onMount (async () => {
    	authStore.subscribe(async ({ user }) => {
			  if (!user) {
				  console.error('Unable to grab user id');
				  return;
			  }

			  const uid = user.uid;
        if(user){
          getFriendsScores(uid);
          } 
      });
    });

    function seperateByScores(scores: Map<string, Map<string, number>>)
    {
        easyLevels = scores.get("Levels:Easy")|| new Map<string, number>();
        mediumLevels = scores.get("Levels:Medium")|| new Map<string, number>();
        hardLevels = scores.get("Levels:Hard")|| new Map<string, number>();
        daily = scores.get("Daily")|| new Map<string, number>();
        rush = scores.get("Rush") || new Map<string,number>();

        easyLevels = sortByScore(easyLevels);
        mediumLevels = sortByScore(mediumLevels);
        hardLevels = sortByScore(hardLevels);
        daily = sortMapByGuesses(daily);
        rush = sortByScore(rush);
    }

    function sortByScore(map: Map<string, number>): Map<string, number> {
    // Convert the map to an array of key-value pairs
    const sortedArray = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    // Create a new map from the sorted array
    const sortedMap = new Map<string, number>(sortedArray);

    return sortedMap;
}

function sortMapByGuesses(map: Map<string, number>): Map<string, number> {
    // Convert the map to an array of key-value pairs
    const sortedArray = Array.from(map.entries()).sort((a, b) => a[1] - b[1]);

    // Create a new map from the sorted array
    const sortedMap = new Map<string, number>(sortedArray);

    return sortedMap;
}

</script>

<HeaderBar />
<div class="leaderboards">
    <h1>Leaderboards</h1>
    <div class="leaderboard-container">
        <div class="leader-container">
            <h2>Levels</h2>
            <div class="change-difficulty">
                <h3>Difficulty:</h3>
                <div class="select">
                    <select class="dropdown" on:change={handleOptionChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <span class="focus"></span>
                </div>                
            </div>
            <p class="leader-description">Highest Level your friends have reached</p>
            <div class ="users-container">
                <ul class = "list-container">
                    {#if selectedDifficulty === "easy"}
                        {#each easyLevels.entries() as [key, value]}
                        <li class = "leader-name">{key} <span class = "leader-score">{value}</span></li>
                        {/each}
                    {:else if selectedDifficulty === "medium"}
                        {#each mediumLevels.entries() as [key, value]}
                        <li class = "leader-name">{key} <span class = "leader-score">{value}</span></li>
                        {/each}
                    {:else}
                        {#each hardLevels.entries() as [key, value]}
                        <li class = "leader-name">{key} <span class = "leader-score">{value}</span></li>
                        {/each}
                    {/if}
                </ul>
            </div>
        </div>
        <div class="leader-container">
            <h2>The Daily</h2>
            <p class="leader-description">Amount of guess it took your friends to solve The Daily</p>
            <div class ="users-container">
                <ul class = "list-container">
                    {#each daily.entries() as [key, value]}
                        <li class = "leader-name">{key} <span class = "leader-score">{value}</span></li>
                    {/each}
                </ul>
            </div>
        </div>
        <div class="leader-container">
            <h2>Rush</h2>
            <p class="leader-description">Longest Rush Streak your friends have achieved</p>
            <div class ="users-container">
                <ul class = "list-container">
                    {#each rush.entries() as [key, value]}
                        <li class = "leader-name">{key} <span class = "leader-score">{value}</span></li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
    @import '../../styles/leaderboardStyles.css';
</style>