<script lang="ts">
  import HeaderBar from "../../components/headerBar.svelte";
  import { authHandlers } from "../../store/store";

  let currentPassword = "";
  let newPassword = "";
  let confirmNewPassword = "";
  let errorMessage = "";

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
      // See if there is a change password function in firebase
      currentPassword = "";
      newPassword = "";
      confirmNewPassword = "";
      errorMessage = "";
    } catch (error: any) {
      errorMessage = error.message;
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
</div>

<style>
  @import '../../styles/changePasswordPageStyles.css';
</style>
