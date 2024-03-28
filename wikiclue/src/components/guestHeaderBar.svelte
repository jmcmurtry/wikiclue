<script lang ="ts">
    import logo from '$lib/images/logo.png';
    import LoginIcon from "~icons/material-symbols/login-sharp"
</script>

<nav class="header-bar">
    <div id="left-align">
        <a href="/">
            <img src={ logo } alt="WikiClue Logo" />
        </a>
    </div>
    <div class="links-container">
        <a href="/login">
            <LoginIcon style="font-size: 1.5rem; color: white; padding-top: 5px"/>
        </a>
    </div>
</nav>

<style>
    @import '../styles/componentStyles/guestHeaderBarStyles.css';
</style>