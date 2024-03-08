<script lang="ts">
	import { auth, db } from '../firebase/firebase';
    import '../global.css'
    import { onMount } from 'svelte'
	import { authStore } from '../store/store';

    const nonAuthRoutes = ['/login', '/signup', '/', '/forgot-password']

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            authStore.update(() => ({
                user: user || null
            }));

            const currentPath = window.location.pathname;

            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = '/login';
                return;
            }

            if (user && nonAuthRoutes.includes(currentPath)) {
                window.location.href = '/home';
                return;
            }
        });
        return unsubscribe;
    });
</script>

<slot/>
