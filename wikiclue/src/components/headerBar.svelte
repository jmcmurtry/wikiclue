<script>
    import ProfileIcon from '~icons/gg/profile';
    import svg from '../../static/assets/logo.svg';
    import Icon from './icon.svelte';
	import { authHandlers } from '../store/store';

    async function logout() {
        await authHandlers.logout();
    }
</script>

<nav class="header-bar">
    
    <div id="left-align">
        <a href="/home">
            <Icon /> 
        </a>
        <h2 class="name">WikiClue</h2>
    </div>
    
    <div class="links-container">
        <a href="/user-settings">
            <ProfileIcon style="font-size: 2em; color: black; padding-top: 5px"/>
        </a>
        <button on:click={() => logout()}>Logout</button>
    </div>
</nav>

<style>
    @import '../styles/componentStyles/headerBarStyles.css';
</style>