<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";

    function addFriend(){
        //addFriend
    }
    function declineRequest(){
        //declineFriendRequest
    }
</script>

<HeaderBar />
<div class="friend-requests">
    <h1>Friend Requests</h1>
    <div class="friendboard-container">
        <div class="friends-container">
            <h3>These users want to be your friend!</h3>
            <div class ="users-container">
                <p class="friend-name">LitLover911<button class="deny-button" on:click={() => onClose()}>&#10006;</button><button class="accept-button" on:click={() => onClose()}>&#10004;</button></p>
                <p class="friend-name">Chris_Morroco <button class="deny-button" on:click={() => onClose()}>&#10006;</button><button class="accept-button" on:click={() => onClose()}>&#10004;</button></p>
                <p class="friend-name">Bonnie <button class="deny-button" on:click={() => onClose()}>&#10006;</button><button class="accept-button" on:click={() => onClose()}>&#10004;</button></p>
                <p class="friend-name">Clyde <button class="deny-button" on:click={() => onClose()}>&#10006;</button><button class="accept-button" on:click={() => onClose()}>&#10004;</button> </p>
            </div>
        </div>
    </div>
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>