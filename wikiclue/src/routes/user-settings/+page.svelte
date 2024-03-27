<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import { goto } from '$app/navigation';
</script>

<HeaderBar />

<div class="user-settings-page">
  <form>
      <h1>Settings</h1>
     
      <p class ="label">Friends:</p>
       <hr/>
      <button on:click={()=>setTimeout(() => goto('/manage-friends'), 0)}>Manage Friends</button>
      <button on:click={()=>setTimeout(() => goto('/friend-requests'), 0)}>Friend Requests</button>
     
      <p class ="label">Account:</p>
      <hr/>
      <button on:click={()=>setTimeout(() => goto('/change-password'), 0)}>Change Password</button>
      <button on:click={()=>setTimeout(() => goto('/change-username'), 0)}>Change Username</button>
  </form>
</div>

<style>
  @import '../../styles/userSettingsPageStyles.css';
</style>
