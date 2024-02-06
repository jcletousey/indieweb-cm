<script>
  import { page } from '$app/stores';

  const params = $page.url.searchParams;
</script>

<svelte:head>
  <style>
    form {
      display: flex;
      flex-direction: column;
      row-gap: 2rem;
    }

    fieldset {
      display: grid;
      padding: 1.5rem;
    }

    label {
      display: grid;
    }

    label + label {
      margin-block-start: 1rem;
    }
  </style>
</svelte:head>

<form method="POST">
  <fieldset>
    <legend>English</legend>
    <label>
      Title
      <input name="en[title]" type="text" value={params.get('title')} />
    </label>
    <label>
      Link
      <input name="en[link]" type="url" value={params.get('url')} />
    </label>
    <label>
      Link locale
      <input name="en[link_locale]" type="text" />
    </label>
    <label>
      Tags
      <input name="en[tags]" type="text" />
    </label>
    <label>
      Content
      <textarea name="en[body]" rows="3">{params.get('body')}</textarea>
    </label>
  </fieldset>

  <fieldset>
    <legend>Français</legend>
    <label>
      Titre
      <input name="fr[title]" type="text" value={params.get('title')} />
    </label>
    <label>
      Lien
      <input name="fr[link]" type="url" value={params.get('url')} />
    </label>
    <label>
      Locale du lien
      <input name="fr[link_locale]" type="text" />
    </label>
    <label>
      Labels
      <input name="fr[tags]" type="text" />
    </label>
    <label>
      Contenu
      <textarea name="fr[body]" rows="3">{params.get('body')}</textarea>
    </label>
  </fieldset>

  <button type="submit">Create the bookmark</button>
</form>
