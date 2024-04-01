<script lang="ts">
    import HeaderBar from '../../components/headerBar.svelte';
    import { authHandlers, authStore } from '../../store/store';
    import { onMount } from 'svelte';

    let errorMessage = '';
    let successMessage = '';
    let friends: string[] = [];

    onMount(async () => {
        const { user } = $authStore;
        if (!user) {
            console.error('Unable to grab user id');
            return;
        }
        await updateFriendsList(user.uid);
    });

    async function updateFriendsList(uid: string) {
        try {
            friends = await getFriendsList(uid);
        } catch (error) {
            console.error('Error getting friend usernames:', error);
            friends = [];
        }
    }

    async function getFriendsList(uid: string) {
        return await authHandlers.getFriendUsernames(uid, true);
    }

    async function addFriend(friend: string) {
        const { user } = $authStore;
        if (!user) {
            console.error('Unable to grab user id');
            return;
        }
        const uid = user.uid;
        try {
            await authHandlers.acceptFriendRequest(friend, uid);
            await updateFriendsList(uid);
            successMessage = `Friend added!`;
            setTimeout(() => {
                successMessage = '';
            }, 1500);
        } catch (error: any) {
            errorMessage = error.message;
            setTimeout(() => {
                errorMessage = '';
            }, 1500);
        }
    }

    async function declineRequest(friend: string) {
        const { user } = $authStore;
        if (!user) {
            console.error('Unable to grab user id');
            return;
        }
        const uid = user.uid;
        try {
            await authHandlers.removeFriends(friend, uid, false);
            await updateFriendsList(uid);
        } catch (error: any) {
            errorMessage = error.message;
        }
    }
</script>

<HeaderBar />
<div class="friend-requests">
    <h1>Friend Requests</h1>
    <div class="friends-container">
        <p class="info-text">These users want to be your friend!</p>
        <p class="success-message">
            {successMessage ? successMessage : '\u00A0'}
        </p>
        <div class="users-container">
            <ul class="friend-list">
                {#each friends as friend}
                    <li class="friend-item">
                        <span>{friend}</span>
                        <div class="option-button-container">
                            <button class="deny-button" on:click={() => declineRequest(friend)}>&#10006;</button>
                            <button class="accept-button" on:click={() => addFriend(friend)}>&#10004;</button>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>
