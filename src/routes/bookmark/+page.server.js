import { commit, getOid } from '$lib/server/github';
import {
  getItemsPerLocale,
  getFrontmatter,
  sanitize,
  defineCommitChanges,
} from '$lib/server/utils';

// generate the new md file content
const getFileContent = (data) => {
  const { title, link, link_locale, body, tags } = data;
  const date = new Date().toISOString();

  const frontMatter = getFrontmatter({
    title: `"${sanitize(title)}"`,
    date: `"${date}"`,
    lang: `"${link_locale}"`,
    link: `"${link}"`,
    tags: `"${tags}"`,
  });

  let content = frontMatter;
  if (body) {
    content += '\n\n' + sanitize(body);
  }

  return content;
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const bookmarks = getItemsPerLocale(formData.entries());
    const changes = defineCommitChanges('bookmarks', bookmarks, getFileContent);

    const oid = await getOid();
    const commitUrl = await commit(oid, 'Create a new bookmark', changes);
  },
};
