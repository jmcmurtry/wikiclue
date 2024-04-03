<script lang="ts">
	import { auth } from '../firebase/firebase';
    import '../global.css'
    import { onMount } from 'svelte'
	import { authStore } from '../store/store';
    import { allowOnMount } from '../store/mount';
    import Spinner from '../components/spinner.svelte';

    const nonAuthRoutes = ['/login', '/signup', '/', '/play', '/forgot-password'];
    const adminRoutes = ['/admin', '/admin/rush', '/admin/admin-settings', '/admin/change-password', '/admin/change-username', '/admin/daily', '/admin/levels'];
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

                if (user && adminRoutes.some(route => currentPath.startsWith(route))) {
                    const isAdminUser = await isAdminUserCheck(user);
                    if (!isAdminUser && !isRedirected) {
                        window.location.href = '/home';
                        isRedirected = true;
                        return;
                    }
                }

                if (user && nonAuthRoutes.includes(currentPath)) {
                    console.log("aquie");
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