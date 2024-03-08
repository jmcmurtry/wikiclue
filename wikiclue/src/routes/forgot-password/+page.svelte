<script lang="ts">
	import { authHandlers } from '../../store/store';
	import { writable } from 'svelte/store';
	import Overlay from '../../components/overlay.svelte';
	import Icon from '@iconify/svelte';

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
		window.location.href = '/login';
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
				<Icon style="width: 25%; height: 10%;" icon="mingcute:mail-send-fill" />
				<button on:click={() => clearPopup()}>Close</button>
			</Overlay>
		{/if}
		<p class="input-label">Email</p>
		<input type="text" class="email-input" placeholder="Enter your email..." bind:value={email} />
		<button on:click={() => sendEmail()}>Send Email</button>
		<a href="/login">Back to login</a>
	</form>
</div>

<style>
	@import '../../styles/forgot-passwordPageStyles.css';
</style>
