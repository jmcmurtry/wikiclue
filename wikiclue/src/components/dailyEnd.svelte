<script lang="ts">
	import { goto } from '$app/navigation';
	import Overlay from './overlay.svelte';
	import { writable } from 'svelte/store';
	export let levelOpen = false;

	export let statistics = { Played: 24, 'Win %': '85%', 'Current Streak': 3, 'Max Streak': 7 };
	export let distribution = [4, 1, 3, 3, 4, 1];
	let max = 4;
	const isOverlayOpen = writable(false);
</script>

<Overlay
	header="Daily Challenge"
	onClose={() => {
		isOverlayOpen.set(false);
		levelOpen = false;
		goto('/home');
	}}
>
	<p class="popup-text">Statistics</p>
	<div class="stats-container">
		{#each Object.entries(statistics) as [key, value]}
			<div class="stat">
				<h3 class="stat-figure">{value}</h3>
				<p class="stat-name">{key}</p>
			</div>
		{/each}
	</div>
	<p class="popup-text">Guess Distribution</p>
	<div class="guess-distribution">
		{#each distribution as amount, index}
			<div class="daily-guess">
				<p class="guess-amount">{index + 1}</p>
				<div class="guess-bar" style="width: calc({amount} / {max} * 80%);">
					<p class="times-guessed">
						{amount}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="bottom-options">
		<button
			on:click={() => {
				goto('/home');
			}}>Return to Main Menu</button
		>
	</div>
</Overlay>

<style>
	@import '../styles/componentStyles/endScreenStyles.css';
</style>
