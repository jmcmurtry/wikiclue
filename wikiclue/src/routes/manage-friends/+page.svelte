<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import { writable } from 'svelte/store';
    import ConfirmOverlay from "../../components/confirmOverlay.svelte";

    const friendRemoveOverlayVis = writable(false);

    let friends = ['LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny', 'LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny'];
    function removeFriend(friend: string | undefined){
        friendRemoveOverlayVis.set(false);
        console.log('Removed: ', friend);
    }

    let friendOnTheBlock = '';
    let popupText = '';
    function removeHandler(friend: string) {
        friendRemoveOverlayVis.set(true);
        friendOnTheBlock = friend;
        popupText = 'Are you sure you want to unfriend ' + friend;
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
                    <li class="friend-item">{friend}<button class="remove-button" on:click={() => removeHandler(friend)}>Remove</button></li>
                {/each}
            </ul>
        </div>
    </div>

    {#if $friendRemoveOverlayVis}
        <ConfirmOverlay 
            header="Confirm Unfriending" 
            onClose={() => {friendRemoveOverlayVis.set(false)}}
            popupText={popupText}
            onCancel={() => removeFriend(friendOnTheBlock)}
            onConfirm={() => {removeFriend(friendOnTheBlock)}}
        />
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>