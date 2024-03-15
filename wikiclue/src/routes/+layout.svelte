<script lang="ts">
	import { auth, db } from '../firebase/firebase';
    import '../global.css'
    import { onMount } from 'svelte'
	import { authStore } from '../store/store';
    import { allowOnMount } from '../store/mount';

    const nonAuthRoutes = ['/login', '/signup', '/', '/play', '/forgot-password'];

    

    onMount(() => {
      let unsubscribe: any;
      const unsubscribeStore = allowOnMount.subscribe(value => {
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

              if (user && nonAuthRoutes.includes(currentPath)) {
                  window.location.href = '/home';
                  return;
              }
          });
      });

      return () => {
          unsubscribeStore();
          if (unsubscribe) unsubscribe();
      };
  });
</script>

<slot/>
