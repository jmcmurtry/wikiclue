<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    const friendRemoveOverlayVis = writable(false);

    function removeFriend(){
        //remove friend logic
    }
</script>

<HeaderBar />
<div class="manage-friends">
    <h1>Manage Friends</h1>
    <div class="friendboard-container">
        <div class="friends-container">
            <h3>View and manage your friends!</h3>
            <div class ="users-container">
                <p class="friend-name">LitLover911<button on:click={() =>{friendRemoveOverlayVis.set(true)}}>Remove</button></p>
                <p class="friend-name">Chris_Morroco <button on:click={() => {friendRemoveOverlayVis.set(true)}}>Remove</button></p>
                <p class="friend-name">Bonnie <button on:click={() => {friendRemoveOverlayVis.set(true)}}>Remove</button></p>
                <p class="friend-name">Clyde <button on:click={() => {friendRemoveOverlayVis.set(true)}}>Remove</button> </p>
            </div>
        </div>
    </div>

    {#if $friendRemoveOverlayVis}
        <Overlay header="Confirm Removal"onClose={() => {friendRemoveOverlayVis.set(false)}}>
            <p class="popup-text">Are you sure you want to remove this friend?</p>
            <div class="button-container">
            <button class="popup-button" button on:click={() => removeFriend()}>Yes</button>
            <button class="popup-button" button on:click={() => {friendRemoveOverlayVis.set(false)}}>No</button> 
            </div>
        </Overlay>   
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>