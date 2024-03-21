<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    let errorMessage = "";
    let successMessage = "";

    async function addFriend(){

    // Reset status messages
    errorMessage = "";
    successMessage = "";

    try {
      // Call function that adds the friend here
      successMessage = `Friend added!`
    } catch (error: any) {
      errorMessage = error.message;
    }
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
            {#if successMessage}
                <p class="success-message">{successMessage}</p>
            {/if}        
            <div class ="users-container">
                <p class="friend-name">LitLover911<button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Chris_Morroco <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Bonnie <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button></p>
                <p class="friend-name">Clyde <button class="deny-button" on:click={() => declineRequest()}>&#10006;</button><button class="accept-button" on:click={() => addFriend()}>&#10004;</button> </p>
            </div>
        </div>
    </div>
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>