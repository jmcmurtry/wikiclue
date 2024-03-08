<script lang="ts">
    import { authHandlers } from "../../store/store";

    let email = "";
    let password = "";
    let errorMessage = "";

    async function login(){
        try {
            if (!email || !password) {
                errorMessage = "Please ensure that you fill in all fields.";
                return;
            }
            await authHandlers.login(email, password);
            email = "";
            password = "";
            errorMessage = "";
        } catch (error: any) {
            if (error.message === "Firebase: Error (auth/invalid-credential)."){
                errorMessage = "Invalid password, try again.";
            } else if (error.message === "Firebase: Error (auth/invalid-email)."){
                errorMessage = "Invalid email, try again.";
            } else if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
                errorMessage = "Too many unsuccessful login attempts, this account is temporarily locked.";
            } else {
                errorMessage = error.message;
            }
        }
    }
</script>

<div class="login-page">
    <h1>Log in to Your Account</h1>
    <form>
        {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
        {/if}
        <p class ="input-label">Email</p>
        <input type="text" class="login-input" placeholder="Enter your email..." bind:value={email}/>
        <p class ="input-label">Password</p>
        <input type="password" class="login-input" placeholder="Enter your password..." bind:value={password}/>
        <button on:click={() => login()}>Login</button>
        <a href="/forgot-password">Forgot your password?</a>
        <a href="/signup">Dont have an account? Sign up</a>
    </form>
</div>

<style>
    @import '../../styles/loginPageStyles.css';
</style>