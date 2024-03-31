<script lang="ts">
    import HeaderBar from "../../components/headerBar.svelte";
    import { writable } from 'svelte/store';
    import ConfirmOverlay from "../../components/confirmOverlay.svelte";
    import { onMount } from 'svelte';
	import { authHandlers, authStore } from "../../store/store";

    const friendRemoveOverlayVis = writable(false);

    let friends: string[] = [];

    // Function to fetch friends list and update the 'friends' array
    async function updateFriendsList(uid: string) {
        try {
            const friendUsernames = await authHandlers.getFriendUsernames(uid, false);
            friends = friendUsernames;
        } catch (error) {
            console.error('Error getting friend usernames:', error);
            friends = [];
        }
    }

	onMount(async () => {
		const { user } = $authStore;
		if (!user) {
			console.error('Unable to grab user id');
			return;
		}
		await updateFriendsList(user.uid);
	});

    async function removeFriend(friend: string){
        const { user } = $authStore;
        if (!user) {
            console.error('Unable to grab user id');
            return;
        }

        const uid = user.uid;
        try {
            await authHandlers.removeFriends(friend, uid, true);
            await updateFriendsList(uid); // Update friends list after removal
        } catch (error: any) {
            console.log(error);
        }

        friendRemoveOverlayVis.set(false);
        console.log('Removed: ', friend);
    }

    let friendOnTheBlock = '';
    let popupText = '';
    function removeHandler(friend: string) {
        friendRemoveOverlayVis.set(true);
        friendOnTheBlock = friend;
        popupText = 'Are you sure you want to unfriend ' + friend;
    }
</script>

<HeaderBar />
<div class="manage-friends">
    <h1>Manage Friends</h1>
    <div class="friends-container">
        <p class="info-text">View and manage your friends!</p>
        <div class ="users-container">
            <ul class="friend-list">
                {#each friends as friend}
                    <li class="friend-item">{friend}<button class="remove-button" on:click={() => removeHandler(friend)}>Remove</button></li>
                {/each}
            </ul>
        </div>
    </div>

    {#if $friendRemoveOverlayVis}
        <ConfirmOverlay 
            header="Confirm Unfriending" 
            onClose={() => {friendRemoveOverlayVis.set(false)}}
            popupText={popupText}
            onCancel={() => friendRemoveOverlayVis.set(false)}
            onConfirm={() => {removeFriend(friendOnTheBlock)}}
        />
    {/if}
</div>

<style>
    @import '../../styles/friendRequestStyles.css';
</style>
