<script lang="ts">
    import AdminHeader from "../../../components/adminHeader.svelte";
    import AdminHeaderBar from "../../../components/adminHeaderBar.svelte";
    import { rush } from "../../../../src/store/gameplay";
    import { writable } from 'svelte/store';

    let skips: number;
    let timeAllowed: number;
    const isButtonEnabled = writable(false);

    rush.skipsRemaining.subscribe(value => {
        skips = value;
    });

    rush.timeAllowed.subscribe(value => {
        timeAllowed = value;
    });

    function handleUpdateSettings() {
        console.log('Update settings code will go here')
    }
    

</script>
  

<AdminHeaderBar />
<div class="update-rush">
    <AdminHeader header="Rush Settings" arrow={true}/>
    <div class = "card-container">
        <div class = "settings-card">
            <form class="settings-container">
                <p class ="input-label">Skips</p>
                <input type="text" class="rush-settings-input" bind:value={skips}/>
                <p class ="input-label">Time Allowed (s)</p>
                <input type="text" class="rush-settings-input" bind:value={timeAllowed}/>
                <button class="save-changes" on:click={() => handleUpdateSettings()}>Save Changes</button>
            </form>
        </div>
    </div>
</div>

<style>
	@import '../../../styles/updateRushPageStyles.css';
</style>
