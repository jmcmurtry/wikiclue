<script lang ="ts">
    import ProfileIcon from '~icons/iconoir/profile-circle';
    import AddFriendIcon from '~icons/fluent-mdl2/add-friend';
    import TrophyIcon from '~icons/octicon/trophy-24';
    import MenuIcon from "~icons/material-symbols/menu"
    import LogoutIcon from "~icons/material-symbols/logout-sharp"
	import { authHandlers } from '../store/store';
    import logo from '$lib/images/logo.png';
	import { onMount } from 'svelte';

    async function logout() {
        await authHandlers.logout();
    }
    let showBurgerMenu = false;
    let burgerMenuOpen = false;

    onMount(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        showBurgerMenu = mediaQuery.matches;

        const handler = (event) => {
            showBurgerMenu = event.matches;
        };

        mediaQuery.addListener(handler);

        return () => {
            mediaQuery.removeListener(handler);
        };
    });

    function toggleBurgerMenu() {
        burgerMenuOpen = !burgerMenuOpen;
    }
</script>

<nav class="header-bar">
    
    <div id="left-align">
        <a href="/home">
            <img src={ logo } alt="WikiClue Logo" />
        </a>
    </div>
    
    {#if !showBurgerMenu}
        <div class="links-container">
            <a href="/leaderboard">
                <TrophyIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </a>
            <a href="/add-friends">
                <AddFriendIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </a>
            <a href="/user-settings">
                <ProfileIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </a>
            <button class="logout-button" on:click={() => logout()}>
                <LogoutIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </button>
        </div>
    {:else}
        <button class="burger-menu" on:click={() => toggleBurgerMenu()} aria-label="Toggle navigation">
            <MenuIcon style="font-size: 1.5rem; color: white; padding-top: 2px"/>
        </button>
        {#if burgerMenuOpen}
            <div class="menu-items">
                <a href="/leaderboard">Leaderboard</a>
                <a href="/add-friends">Add Friends</a>
                <a href="/user-settings">User Settings</a>
                <button on:click={() => logout()}>Logout</button>
            </div>
        {/if}
    {/if}
</nav>

<style>
    @import '../styles/componentStyles/headerBarStyles.css';
</style>