<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";

  let friendEmail = "";
  let errorMessage = "";

  async function addFriend(){
    try {
        console.log(friendEmail);
        friendEmail = "";
    } catch (error: any) {
      errorMessage = error.message;
    }
  }
</script>

<HeaderBar />

<div class="add-friends-page">
  <h1>Add friends</h1>
  <form>
      {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
      {/if}
      <h2>Enter your friend's email</h2>
      <input type="text" class="add-friend-input" bind:value={friendEmail}/>
      <button on:click={() => addFriend()}>Add Friend</button>
  </form>
</div>

<style>
  @import '../../styles/addFriendsPageStyles.css';
</style>
