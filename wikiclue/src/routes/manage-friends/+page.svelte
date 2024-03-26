<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    const friendRemoveOverlayVis = writable(false);

    let friends = ['LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny'];
    function removeFriend(friend: string | undefined){
        //remove friend logic
        console.log('Removed: ', friend);
    }
</script>

<HeaderBar />
<div class="manage-friends">
    <h1>Manage Friends</h1>
    <div class="friends-container">
        <p class="info-text">View and manage your friends!</p>
        <div class ="users-container">
            <ul class="friend-list">
                {#each friends as friend}
                    <li class="friend-item">{friend}<button class="remove-button" on:click={() =>{friendRemoveOverlayVis.set(true)}}>Remove</button></li>
                {/each}
            </ul>
        </div>
    </div>

    {#if $friendRemoveOverlayVis}
        <Overlay header="Confirm Removal"onClose={() => {friendRemoveOverlayVis.set(false)}}>
            <p class="popup-text">Are you sure you want to remove this friend?</p>
            <div class="button-container">
            <button class="popup-button" on:click={() => removeFriend('Kenny')}>Yes</button>
            <button class="popup-button" on:click={() => {friendRemoveOverlayVis.set(false)}}>No</button> 
            </div>
        </Overlay>   
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>