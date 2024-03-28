<script lang ="ts">
    import logo from '$lib/images/logo.png';
    import ProfileIcon from '~icons/iconoir/profile-circle';
    import LogoutIcon from "~icons/material-symbols/logout-sharp"
    import BurgerMenuIcon from "~icons/material-symbols/menu"
	import { authHandlers } from '../store/store';
	import { onMount } from 'svelte';

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

    async function logout() {
        await authHandlers.logout();
    }
</script>

<nav class="header-bar">
    <div id="left-align">
        <a href="/admin">
            <img src={ logo } alt="WikiClue Logo" />
        </a>
    </div>
    {#if !showBurgerMenu}
        <div class="links-container">
            <a href="/admin/admin-settings">
                <ProfileIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </a>
            <button class="logout-button" on:click={() => logout()}>
                <LogoutIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
            </button>
        </div>
    {:else}
        <button class="burger-menu" on:click={() => toggleBurgerMenu()}>
            <BurgerMenuIcon style="font-size: 1.5rem; color: white; padding-top: 2px"/>
        </button>
        {#if burgerMenuOpen}
            <div class="burger-menu-items">
                <a href="/admin/admin-settings">Gamemaster Settings</a>
                <button on:click={() => logout()}>Logout</button>
            </div>
        {/if}
    {/if}
</nav>

<style>
    @import '../styles/componentStyles/headerBarStyles.css';
</style>