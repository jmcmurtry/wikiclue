<script lang="ts">
    import AdminHeader from "../../components/adminHeader.svelte";
    import AdminHeaderBar from "../../components/adminHeaderBar.svelte";
    import LevelsIcon from '~icons/carbon/skill-level-advanced';
    import DailyIcon from '~icons/ion/calendar-outline';
    import RushIcon from '~icons/nimbus/fire';
    import { goto } from '$app/navigation';
</script>

<AdminHeaderBar />

<div class="update-games">
    <AdminHeader header="Gamemaster Dashboard" arrow={false}/>
    <div class="games-container">
        <div class="game-container">
            <h2>Levels</h2>
            <LevelsIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Want to update current levels or add new ones?</p>
            <button class = "play-button" on:click={()=>goto("/admin/levels")}>Edit Levels</button>
        </div>
        <div class="game-container">
            <h2>The Daily</h2>
            <DailyIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Create daily puzzles and view old ones.</p>
            <button class = "play-button" on:click={()=>goto("/admin/daily")}>Edit Daily's</button>
        </div>
        <div class="game-container">
            <h2>Rush</h2>
            <RushIcon style="font-size: 2.5em; color: black; padding-top: 5px"/>
            <p class="game-description">Change rush gameplay settings.</p>
            <button class = "play-button" on:click={()=>goto("/admin/rush")}>Edit Rush</button>
        </div>
    </div>
</div>


<style>
	@import '../../styles/adminPageStyles.css';
</style>