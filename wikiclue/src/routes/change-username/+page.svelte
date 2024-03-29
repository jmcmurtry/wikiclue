<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import Overlay from "../../components/overlay.svelte";
  import ConfirmOverlay from "../../components/confirmOverlay.svelte";
  import { writable } from "svelte/store";
  import { goto } from '$app/navigation';
  import { authHandlers, authStore } from "../../store/store";
  import { onMount } from "svelte";
  import { auth } from "../../firebase/firebase";


  // When we have the database set up with users, this would need to occur onload
  let currentUsername = "";
  const changeWasClicked = writable(false);
  let newUsername = "";
  let errorMessage = "";
  let successMessage = "";
  
    onMount (async () => {
    	authStore.subscribe(async ({ user }) => {
			  if (!user) {
				  console.error('Unable to grab user id');
				  return;
			  }

			  const uid = user.uid;
        if(user){
          const username = await authHandlers.getUsername(uid);
          currentUsername = username;
          }
            // Would need to use this functionality to pre load levels data with words from database
            // depending on if the user selects easy medium or hard
      });
    });

  async function changeUsernameClicked(){
    if (!newUsername) {
      errorMessage = "Please enter a new username.";
      return;
    }
    if (newUsername === currentUsername) {
      errorMessage = "Cannot enter the same username.";
      return;
    }
    if(!await authHandlers.ensureUniqueUsername(newUsername)){
      errorMessage = "Another user is using this name.";
      return;
    }

    changeWasClicked.set(true);
  }

  async function okClicked(){
    // Would actually update the database here
    try {
      if(await authHandlers.updateUsername(currentUsername, newUsername)){
        currentUsername = newUsername;
        successMessage = "Username changed!"
      }
      else {
        errorMessage = "Could not change username."
      }
    }
    catch(error){
        errorMessage = "Error while changing username";
    }

    changeWasClicked.set(false);
  }
</script>

<HeaderBar />

<div class="change-username-page">
  <h1>Change Username</h1>
  <form>
      {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
      {:else}
        {#if successMessage}
          <p class="success-message">{successMessage}</p>
        {/if}
      {/if}
      <p class ="input-label">Enter new username</p>
      <input type="text" class="change-username-input" placeholder={currentUsername} bind:value={newUsername}/>
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