<script lang="ts">
  import AdminHeaderBar from "../../../components/adminHeaderBar.svelte";
  import { goto } from '$app/navigation';
</script>

<AdminHeaderBar />

<div class="user-settings-page">
  <form>
      <h1>Settings</h1>
      <p class ="label">Account:</p>
      <hr/>
      <button on:click={()=>setTimeout(() => goto('/admin/change-password'), 0)}>Change Password</button>
      <button on:click={()=>setTimeout(() => goto('/admin/change-username'), 0)}>Change Username</button>
  </form>
</div>

<style>
  @import '../../../styles/userSettingsPageStyles.css';
</style>
