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
