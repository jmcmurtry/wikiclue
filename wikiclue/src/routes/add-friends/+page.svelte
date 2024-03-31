<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
	import { authHandlers, authStore } from "../../store/store";

  let friendEmail = "";
  let errorMessage = "";
  let successMessage = ""

  async function addFriend(){

    // Reset status messages
    errorMessage = "";
    successMessage = ""

    authStore.subscribe(async ({ user }) => {
			if (!user) {
				console.error('Unable to grab user id');
				return;
			}

			const uid = user.uid;
			try {
				await authHandlers.sendFriendRequest(friendEmail, uid);
				successMessage = `Success! A friend request has been sent to ${friendEmail}`
        friendEmail = "";

				setTimeout(() => {
					successMessage = '';
				}, 1500);
			} catch (error: any) {
				errorMessage = error.message;
			}
		});
  }
</script>

<HeaderBar />

<div class="add-friends-page">
  <h1>Add friends</h1>
  <form>
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
      {#if successMessage}
        <p class="success-message">{successMessage}</p>
      {/if}
      <p class="label">Enter your friend's email</p>
      <input type="text" class="add-friend-input" bind:value={friendEmail}/>
      <button on:click={() => addFriend()}>Add Friend</button>
  </form>
</div>

<style>
  @import '../../styles/addFriendsPageStyles.css';
</style>
