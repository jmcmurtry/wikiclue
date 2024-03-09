<script lang="ts">
    import { authHandlers } from "../../store/store";

    let email = "";
    let username = "";
    let password = "";
    let confirmPassword = "";
    let errorMessage = "";

    async function signUp(){
        try {
            if (!email || !username || !password || !confirmPassword) {
                errorMessage = "Please ensure that you fill in all fields.";
                return;
            }
            if (password !== confirmPassword) {
                errorMessage = "Your passwords do not match. Please try again.";
                return;
            }
            await authHandlers.signup(email, password);
            email = "";
            username = "";
            password = "";
            confirmPassword = "";
            errorMessage = "";
        } catch (error: any) {
            if (error.message === "Firebase: Error (auth/invalid-email)."){
                errorMessage = "Please enter a valid email address.";
            } else if (error.message === "Firebase: Error (auth/email-already-in-use)."){
                errorMessage = "This email is already in use. Please try another email.";
            } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                errorMessage = "Your password is too short. Please enter a password that is at least 6 characters long.";
            } else {
                errorMessage = error.message;
            }
        }
    }
</script>

<div class="signup-page">
    <h1>Create an Account</h1>
    <form>
        {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
        {/if}
        <p class ="input-label">Email</p>
        <input type="text" class="signup-input" placeholder="Enter email..." bind:value={email}/>
        <p class ="input-label">Username</p>
        <input type="text" class="signup-input" placeholder="Enter username..." bind:value={username}/>
        <p class ="input-label">Password</p>
        <input type="password" class="signup-input" placeholder="Enter password..." bind:value={password}/>
        <p class ="input-label">Confirm</p>
        <input type="password" class="signup-input" placeholder="Enter password again..." bind:value={confirmPassword}/>
        <button on:click={() => signUp()}>Sign Up</button>
        <a href="/login">Already have an account? Login</a>
    </form>
</div>

<style>
    @import '../../styles/signupPageStyles.css';
</style>