<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import Overlay from '../../components/overlay.svelte';
    import { writable } from 'svelte/store';

    let errorMessage = "";
    let successMessage = "";

    let friends = ['LitLover911', 'Chris_Morroco', 'Bonnie', 'Clyde', 'Kenny'];
    async function addFriend(friend: string){

    // Reset status messages
    errorMessage = "";
    successMessage = "";

    try {
      // Call function that adds the friend here
      successMessage = `Friend added!`;

      setTimeout(() => {
            successMessage = "";
        }, 1500);
    } catch (error: any) {
      errorMessage = error.message;
    }
  }

    function declineRequest(friend: string){
        //declineFriendRequest
    }
</script>

<HeaderBar />
<div class="friend-requests">
    <h1>Friend Requests</h1>
        <div class="friends-container">
            <p class="info-text">These users want to be your friend!</p>
            <p class="success-message">
                {successMessage ? successMessage : '\u00A0'}
            </p>
            <div class ="users-container">
                <ul class="friend-list">
                    {#each friends as friend}
                        <li class="friend-item">
                            <span>{friend}</span>
                            <div class="option-button-container">
                                <button class="deny-button" on:click={() => declineRequest(friend)}>&#10006;</button>
                                <button class="accept-button" on:click={() => addFriend(friend)}>&#10004;</button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>