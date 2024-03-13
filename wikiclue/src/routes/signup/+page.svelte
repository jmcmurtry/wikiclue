<script lang="ts">
    import { goto } from '$app/navigation';
    import { authHandlers } from "../../store/store";
    import { allowOnMount } from '../../store/mount';
    let email = "";
    let name = "";
    let password = "";
    let confirmPassword = "";
    let errorMessage = "";

    async function signUp(){
        try {
            if (!email || !name || !password || !confirmPassword) {
                errorMessage = "Please ensure that you fill in all fields.";
                return;
            }
            if (password !== confirmPassword) {
                errorMessage = "Your passwords do not match. Please try again.";
                password = "";
                confirmPassword = "";
                return;
            }
            allowOnMount.set(false);
            const userCredential = await authHandlers.signup(email, password);
            goto('/home');
            await authHandlers.setUser(userCredential.user.uid, email, name);
            allowOnMount.set(true);
            errorMessage = "";
            
        } catch (error: any) {
            if (error.message === "Firebase: Error (auth/invalid-email)."){
                errorMessage = "Please enter a valid email address.";
                email = "";
            } else if (error.message === "Firebase: Error (auth/email-already-in-use)."){
                errorMessage = "This email is already in use. Please try another email.";
                email = "";
            } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                errorMessage = "Your password is too short. Please enter a password that is at least 6 characters long.";
                password = "";
                confirmPassword = "";
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
        <p class ="input-label">name</p>
        <input type="text" class="signup-input" placeholder="Enter name..." bind:value={name}/>
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