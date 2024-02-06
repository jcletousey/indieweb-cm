<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.data.title}</title>
</svelte:head>

<main>
  <h1>{$page.data.title}</h1>

  <slot />
</main>
