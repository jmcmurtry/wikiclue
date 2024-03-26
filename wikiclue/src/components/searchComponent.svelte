<script lang="ts">
	import { writable } from 'svelte/store';
  import { searchTerm} from '../store/gameplay';
  import { getWikiSearchResults } from '../store/wiki';

  export let confirmFunction = () => {};

  const searchResults = writable([]);
	let selectedResult = -1;

  async function onKeyPress() {
		let newSearchResults = await getWikiSearchResults($searchTerm);
		searchResults.set(newSearchResults);
	}

	function onSelectPage(word: string) {
		searchResults.set([]);
		searchTerm.set(word);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedResult = Math.min(selectedResult + 1, $searchResults.length - 1);
			scrollToSelectedResult();
			return;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedResult = Math.max(selectedResult - 1, 0);
			scrollToSelectedResult();
			return;
		} else if (event.key === 'Enter' && selectedResult !== -1) {
			event.preventDefault();
			searchTerm.set($searchResults[selectedResult]);
			onKeyPress();
			selectedResult = -1;
			return;
		} else if (event.key === 'Enter' && selectedResult === -1) {
			event.preventDefault();
			confirmFunction();
			return;
		}
	}

	function scrollToSelectedResult() {
		const container = document.querySelector('.search-results-container');
		const selectedElement = document.querySelector('.search-result.selected');

		if (container && selectedElement) {
			const containerRect = container.getBoundingClientRect();
			const selectedRect = selectedElement.getBoundingClientRect();

			// Selected top is higher than container top
			if (selectedRect.top - selectedRect.height < containerRect.top) {
				// Scroll up
				container.scrollTop -= containerRect.top - selectedRect.top + selectedRect.height;

				// Selected bottom is lower than container bottom
			} else if (selectedRect.bottom + selectedRect.height > containerRect.bottom) {
				// Scroll down
				container.scrollTop += selectedRect.bottom - containerRect.bottom + selectedRect.height;
			}
		}
	}
</script>

<input
  type="text"
  class="search-bar"
  placeholder="Enter the Wikipedia page title here..."
  bind:value={$searchTerm}
  on:input={() => onKeyPress()}
  on:keydown={(event) => handleKeyDown(event)}
/>
<div class="search-results-container">
  <ul class ="search-results-list">
    {#each $searchResults as option, index}
      <button
        class="search-result {index === selectedResult ? 'selected' : ''}"
        on:click={() => onSelectPage(option)}
      >
        {option}
      </button>
    {/each}
  </ul>
</div>

<style>
	@import '../styles/componentStyles/searchComponentStyles.css';
</style>
