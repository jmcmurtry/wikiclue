<script>
    let searchTerm = "";
</script>

<div class="landing-page">
  <h1>Welcome to WikiClue</h1>
  <p class = "sub-header">Find a Wikipedia page that contains the following words!</p>
  <div class="words-container">
    <p class="search-words">Sample</p>
    <p class="search-words">Words</p>
  </div>
  <input type="text" class="search-bar" placeholder="Start typing to play..." bind:value={searchTerm}/>
  <div class="buttons-container">
    <button on:click={()=>console.log("button clicked")}>Login</button>
    <button on:click={()=>console.log("button clicked")}>Sign Up</button>
  </div>
</div>

<style>



.landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 5rem;
}
h1 {
    font-size: 2rem;
}
.sub-header {
    font-size: 1.5rem;
    text-align: center;
    margin-right: 2rem;
    margin-left: 2rem;
}  
.words-container {
    display: flex;
    gap: 5rem;
    margin: 1rem 0;
}

.search-words {
    font-size: 2rem;
}
.search-bar {
    width: 65%;
    padding: 0.5rem;
    font-size: 1.5rem;
    margin: 1rem 0;
    border: 1px solid #000;
    background-color: #F1EFEF;
}

.buttons-container {
    display: flex;
    flex-wrap: wrap; /* Allow buttons to wrap to the next line */
    justify-content: center; /* Center buttons horizontally */
    margin: 1rem 0;
}

button {
    background-color: #CCC8AA;
    width: 14rem;
    height: 3rem;
    border: 0px;
    margin-right: 5rem;
    margin-left: 5rem;
    margin-top: 2rem;
}

button:hover {
    background-color: #E0D8B8;
}

.buttons-container button {
    font-size: 1.3rem;
    cursor: pointer;
}
</style>
