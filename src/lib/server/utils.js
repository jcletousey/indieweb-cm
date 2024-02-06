import { encode } from 'js-base64';

export const getItemsPerLocale = (entries) => {
  const items = {};
  for (const [key, value] of entries) {
    const reg = new RegExp('([a-z-_]+)\\[(\\w+)\\]');
    const match = key.match(reg);
    if (match) {
      const locale = match[1];
      const property = match[2];
      if (value) {
        if (!(locale in items)) {
          items[locale] = {};
        }
        if (!(property in items[locale])) {
          items[locale][property] = value;
        }
      }
    }
  }
  return items;
};

export const defineCommitChanges = (type, items, getFileContent) => {
  const changes = new Array();
  for (const locale in items) {
    const path = `src/content/${locale}/${type}/${getFileName(items[locale]?.title)}`;
    const content = getFileContent(items[locale]);
    const encodedContent = encode(content);
    changes.push({ path: path, contents: encodedContent });
  }
  return changes;
};

export const slugify = (str) => {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};

// Helper function to clean strings for frontmatter
export const sanitize = (str) => {
  // replace endash and emdash with hyphens
  str = str.replace(/–/g, '-');
  str = str.replace(/—/g, '-');

  // replace double quotes and apostrophes
  str = str.replace(/"/g, "'");
  str = str.replace(/“/g, "'");
  str = str.replace(/”/g, "'");
  str = str.replace(/’/g, "'");

  return str.trim();
};

// generate the frontmatter string
export const getFrontmatter = (yaml) => {
  let fm = new Array();
  fm.push('---');
  Object.keys(yaml).forEach((key) => {
    if (yaml[key] && yaml[key].constructor == String) {
      fm.push(`${key}: ${yaml[key]}`);
    } else if (typeof yaml[key] === 'boolean') {
      fm.push(`${key}: ${String(yaml[key])}`);
    }
  });
  fm.push('---');
  return fm.join('\n');
};

// generate the new md file name
export const getFileName = (title) => {
  const date = new Date();
  const unixSeconds = date.getTime();
  let filename = formatDate(date);

  if (!title) {
    filename = `${filename}/${unixSeconds}`;
  } else {
    const slug = slugify(title);
    filename += slug.length > 1 ? `/${slug}` : `/${unixSeconds}`;
  }

  return `${filename}.md`;
};

/** https://bobbyhadz.com/blog/javascript-format-date-dd-mm-yyyy#format-a-date-as-ddmmyyyy-in-javascript */

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
    '/',
  );
}
