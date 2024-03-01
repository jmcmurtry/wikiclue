<script>
    import ProfileIcon from '~icons/gg/profile'
	import { authHandlers } from '../store/store';

    async function logout() {
        await authHandlers.logout();
    }
</script>

<nav class="header-bar">
    <div class="content-container">
        <p class="name">WikiClue</p>
        <div class="links-container">
            <a href="/profile">
                <ProfileIcon style="font-size: 1.5em; color: black; padding-top: 5px"/>
            </a>
            <button on:click={() => logout()}>Logout</button>
        </div>
    </div>
</nav>

<style>
    @import '../styles/componentStyles/headerBarStyles.css';
</style>