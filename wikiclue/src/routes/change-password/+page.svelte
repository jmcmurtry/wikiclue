<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import Overlay from "../../components/overlay.svelte";
  import { authHandlers } from "../../store/store";
  import { writable } from "svelte/store";

  let currentPassword = "";
  let newPassword = "";
  let confirmNewPassword = "";
  let errorMessage = "";

  const needRecentLogin = writable(false);
  let recentLoginEmail = "";
  let recentLoginPassword = "";
  let recentLoginErrorMessage = "";

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
      if (currentPassword === newPassword){
        errorMessage = "Cannot use your current password.";
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
      } else {
        errorMessage = error.message;
      }
    }
  }

  async function recentLogin(){
    try {
      if (!recentLoginEmail || !recentLoginPassword) {
        errorMessage = "Please ensure that you fill in all fields.";
        return;
      }
      await authHandlers.verifyLogin(recentLoginEmail, recentLoginPassword);
      recentLoginEmail = "";
      recentLoginPassword = "";
      recentLoginErrorMessage = "";
      needRecentLogin.set(false);
      currentPassword = "";
      newPassword = "";
      confirmNewPassword = "";
      errorMessage = "";
    } catch (error: any) {
      if (error.message === "Firebase: Error (auth/invalid-credential)."){
        recentLoginErrorMessage = "Invalid password, try again.";
      } else if (error.message === "Firebase: Error (auth/invalid-email)."){
        recentLoginErrorMessage = "Invalid email, try again.";
      } else if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
        recentLoginErrorMessage = "Too many unsuccessful login attempts, this account is temporarily locked.";
      } else {
        recentLoginErrorMessage = error.message;
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
        <input type="password" class="change-password-input" placeholder="Current Password..." bind:value={currentPassword}/>
        <p class ="input-label">New Password</p>
        <input type="password" class="change-password-input" placeholder="New Password..." bind:value={newPassword}/>
        <p class ="input-label">Confirm New Password</p>
        <input type="password" class="change-password-input" placeholder="New Password..." bind:value={confirmNewPassword}/>
        <button on:click={() => changePasswordClicked()}>Change Password</button>
    </form>
  {#if $needRecentLogin}
    <Overlay header="Verify yourself by logging in" onClose={() => {needRecentLogin.set(false);}}>
        {#if recentLoginErrorMessage}
          <p class="error-message">{recentLoginErrorMessage}</p>
        {/if}
        <p class ="input-label">Email</p>
        <input type="text" class="login-input" placeholder="Enter your email..." bind:value={recentLoginEmail}/>
        <p class ="input-label">Password</p>
        <input type="password" class="login-input" placeholder="Enter your password..." bind:value={recentLoginPassword}/>
        <button on:click={() => recentLogin()}>Verify Me!</button>
    </Overlay>
  {/if}
</div>

<style>
  @import '../../styles/changePasswordPageStyles.css';
</style>
