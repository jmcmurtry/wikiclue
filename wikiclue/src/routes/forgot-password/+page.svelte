<script lang="ts">
	import { authHandlers } from '../../store/store';
	import { writable } from 'svelte/store';
	import Overlay from '../../components/overlay.svelte';
	import EmailIcon from '~icons/mdi/email-sent-outline'
	import { goto } from '$app/navigation';

	let email = '';
	let errorMessage = '';
	const isOverlayOpen = writable(false);

	async function sendEmail() {
		try {
			if (!email) {
				errorMessage = 'Please ensure that you fill in all fields.';
				return;
			}
			await authHandlers.forgotPasswordEmail(email);
			email = '';
			errorMessage = '';
			isOverlayOpen.set(true);
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				errorMessage = 'User not found. Please check the email address.';
			} else if (error.code === 'auth/invalid-email') {
				errorMessage = 'Invalid email address. Please provide a valid email.';
			} else {
				errorMessage = 'Error sending password reset email:' + error;
			}
		}
	}

	function clearPopup() {
		isOverlayOpen.set(false);
		setTimeout(() => goto('/login'), 0);
	}
</script>

<div class="forgot-password-page">
	<h1>Reset Password</h1>
	<form>
		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}
		{#if $isOverlayOpen}
			<Overlay header="Email Sent" displayX={false}>
				<p class="popup-text">If you don't see the email, please check your junk or spam folder.</p>
				<EmailIcon style="width: 30%; height: 30%; color: black;"/>
				<button  class="popup-button" on:click={() => clearPopup()}>Login</button>
			</Overlay>
		{/if}
		<p class="input-label">Email</p>
		<input type="text" class="email-input" placeholder="Enter your email..." bind:value={email} />
		<button on:click={() => sendEmail()}>Send Email</button>
		<hr />
		<a href="/login">Back to login</a>
	</form>
</div>

<style>
	@import '../../styles/forgotPasswordPageStyles.css';
</style>
