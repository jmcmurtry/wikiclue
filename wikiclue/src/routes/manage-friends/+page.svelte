<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    const friendRemoveOverlayVis = writable(false);

    function removeFriend(){
        friendRemoveOverlayVis.set(true);
    }
</script>

<HeaderBar />
<div class="manage-friends">
    <h1>Manage Friends</h1>
    <div class="friendboard-container">
        <div class="friends-container">
            <h3>View and manage your friends!</h3>
            <div class ="users-container">
                <p class="friend-name">LitLover911<button on:click={() => removeFriend()}>Remove</button></p>
                <p class="friend-name">Chris_Morroco <button on:click={() => removeFriend()}>Remove</button></p>
                <p class="friend-name">Bonnie <button on:click={() => removeFriend()}>Remove</button></p>
                <p class="friend-name">Clyde <button on:click={() => removeFriend()}>Remove</button> </p>
            </div>
        </div>
    </div>

    {#if $friendRemoveOverlayVis}
        <Overlay header="Friend Removed"onClose={() => {friendRemoveOverlayVis.set(false)}}>
            <p class="popup-text">This user is no longer your friend</p>
        </Overlay>   
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>