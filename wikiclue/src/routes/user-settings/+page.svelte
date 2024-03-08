<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
</script>

<HeaderBar />

<div class="user-settings-page">
  <form>
      <h1>User Settings</h1>
      <button on:click={()=>console.log("dummy button, replace")}>Change Password</button>
      <button on:click={()=>console.log("dummy button, replace")}>Change Username</button>
  </form>
</div>

<style>
  @import '../../styles/userSettingsPageStyles.css';
</style>
