<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import Overlay from "../../components/overlay.svelte";
  import ConfirmOverlay from "../../components/confirmOverlay.svelte";
  import { writable } from "svelte/store";
  import { goto } from '$app/navigation';

  // When we have the database set up with users, this would need to occur onload
  const currentUsername = writable("Mr Kenny");

  const changeWasClicked = writable(false);
  let newUsername = "";
  let errorMessage = "";

  async function changeUsernameClicked(){
    if (!newUsername) {
      errorMessage = "Please enter a new username.";
      return;
    }
    if (newUsername === $currentUsername) {
      errorMessage = "Cannot enter the same username";
      return;
    }
    // More error checking that we decide on for usernames

    currentUsername.set(newUsername);
    changeWasClicked.set(true);
  }

  function okClicked(){
    // Would actually update the database here
    currentUsername.set(newUsername);
    setTimeout(() => goto('/home'), 0);
  }
</script>

<HeaderBar />

<div class="change-username-page">
  <h1>Change Username</h1>
  <form>
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
      <p class ="input-label">Enter new username</p>
      <input type="text" class="change-username-input" placeholder={$currentUsername} bind:value={newUsername}/>
      <button on:click={() => changeUsernameClicked()}>Change</button>
  </form>

  {#if $changeWasClicked}
    <ConfirmOverlay 
      header="Confirm new username" 
      onClose={() => {changeWasClicked.set(false);}}
      popupText={"Confirm you would like to change username to: " + newUsername}
      onCancel={() => {changeWasClicked.set(false);}}
      onConfirm={() => okClicked()}
    />
  {/if}
</div>

<style>
  @import '../../styles/changeUsernamePageStyles.css';
</style>