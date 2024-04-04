<script lang="ts">
	import { auth } from '../firebase/firebase';
    import '../global.css'
    import { onMount } from 'svelte'
	import { authStore } from '../store/store';
    import { allowOnMount } from '../store/mount';
    import Spinner from '../components/spinner.svelte';

    const nonAuthRoutes = ['/login', '/signup', '/', '/play', '/forgot-password'];
    let isPageReady = false;
    let isRedirected = false;

    onMount(() => {
        let unsubscribe: any;
        const unsubscribeStore = allowOnMount.subscribe((value: any) => {

            if (!value) {
                if (unsubscribe) unsubscribe();
                return;
            }

            unsubscribe = auth.onAuthStateChanged(async (user) => {
                authStore.update(() => ({
                    user: user || null
                }));

                const currentPath = window.location.pathname;

                if (!user && !nonAuthRoutes.includes(currentPath)) {
                    window.location.href = '/login';
                    return;
                }

                if (user && currentPath.startsWith("/admin")) {
                    const isAdminUser = await isAdminUserCheck(user);
                    if (!isAdminUser && !isRedirected) {
                        window.location.href = '/home';
                        isRedirected = true;
                        return;
                    }
                }

                if (user && nonAuthRoutes.includes(currentPath)) {
                    window.location.href = '/home';
                    return;
                }

                isPageReady = true;
            });
        });

        return () => {
            unsubscribeStore();
            if (unsubscribe) unsubscribe();
        };
    });

    async function isAdminUserCheck(user: any) {
        const userClaims = await user.getIdTokenResult();
        return userClaims.claims.user_id === import.meta.env.VITE_FIREBASE_ADMIN_ID;
    }
</script>

<Spinner isLoading={!isPageReady} />

{#if isPageReady}
    <slot/>
{/if}