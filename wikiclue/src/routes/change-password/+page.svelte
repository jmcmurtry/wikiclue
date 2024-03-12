<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import Overlay from "../../components/overlay.svelte";
  import { authHandlers } from "../../store/store";
  import { writable } from "svelte/store";

  let currentPassword = "";
  let newPassword = "";
  let confirmNewPassword = "";
  let errorMessage = "";
  let recentLoginEmail = "";
  let recentLoginPassword = "";
  const needRecentLogin = writable(false);

  async function changePasswordClicked(){
    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
          errorMessage = "Please ensure that you fill in all fields.";
          return;
      }
      if (newPassword !== confirmNewPassword) {
          errorMessage = "Your new passwords do not match. Please try again.";
          return;
      }
      await authHandlers.changePassword(newPassword);
      currentPassword = "";
      newPassword = "";
      confirmNewPassword = "";
      errorMessage = "";
    } catch (error: any) {
      if (error.message === "Firebase: Error (auth/weak-password)"){
        errorMessage = "Password Reset Failed - Weak Password";
      } else if (error.message === "Firebase: Error (auth/requires-recent-login)."){
        needRecentLogin.set(true);
        // errorMessage = "Invalid email, try again.";
      } else {
          errorMessage = error.message;
      }
    }
  }
</script>

<HeaderBar />

<div class="change-password-page">
  <h1>Change Password</h1>
  <form>
      {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
      {/if}
      <p class ="input-label">Current Password</p>
      <input type="password" class="change-password-input" placeholder="Enter your current password..." bind:value={currentPassword}/>
      <p class ="input-label">New Password</p>
      <input type="password" class="change-password-input" placeholder="Enter your new password..." bind:value={newPassword}/>
      <p class ="input-label">Confirm New Password</p>
      <input type="password" class="change-password-input" placeholder="Enter your new password again..." bind:value={confirmNewPassword}/>
      <button on:click={() => changePasswordClicked()}>Change Password</button>
  </form>
  {#if $needRecentLogin}
    <Overlay header="Verify yourself by logging in" onClose={() => {needRecentLogin.set(false);}}>
        <p class ="input-label">Email</p>
        <input type="text" class="login-input" placeholder="Enter your email..." bind:value={recentLoginEmail}/>
        <p class ="input-label">Password</p>
        <input type="password" class="login-input" placeholder="Enter your password..." bind:value={recentLoginPassword}/>
        <button class="popup-button">Kill me :)</button>
    </Overlay>
  {/if}
</div>

<style>
  @import '../../styles/changePasswordPageStyles.css';
</style>
