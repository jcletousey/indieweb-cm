import { getItemsPerLocale } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const bookmarks = getItemsPerLocale(formData.entries());
  },
};
