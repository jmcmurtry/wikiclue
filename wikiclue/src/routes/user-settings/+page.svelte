<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import { goto } from '$app/navigation';
</script>

<HeaderBar />

<div class="user-settings-page">
  <form>
      <h1>User Settings</h1>
      <button on:click={()=>setTimeout(() => goto('/change-password'), 0)}>Change Password</button>
      <button on:click={()=>setTimeout(() => goto('/change-username'), 0)}>Change Username</button>
  </form>
</div>

<style>
  @import '../../styles/userSettingsPageStyles.css';
</style>
