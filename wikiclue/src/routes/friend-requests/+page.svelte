<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    const friendAddOverlayVis = writable(false);

    function addFriend(){
        friendAddOverlayVis.set(true);
    }
    function declineRequest(){
        //declineFriendRequest
    }
</script>

<HeaderBar />
<div class="friend-requests">
    <h1>Friend Requests</h1>
    <div class="friendboard-container">
        <div class="friends-container">
            <h3>These users want to be your friend!</h3>
            <div class ="users-container">
                <p class="friend-name">LitLover911<button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Chris_Morroco <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Bonnie <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Clyde <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button> </p>
            </div>
        </div>
    </div>

    {#if $friendAddOverlayVis}
        <Overlay header="New Friend!" onClose={() => {friendAddOverlayVis.set(false)}}>
            <p class="popup-text">Friend Added!</p>
        </Overlay>   
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>