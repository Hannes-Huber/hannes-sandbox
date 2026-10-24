export function tagToPath(tag) {
  return encodeURIComponent(tag.toLowerCase());
}

export function tagsToPath(tags) {
  return tags.map(tagToPath).join(",");
}

export function pathToTag(pathTag) {
  return decodeURIComponent(pathTag);
}

export function pathToTags(pathTags) {
  if (!pathTags) return [];

  return pathTags
    .split(",")
    .map((tag) => pathToTag(tag.trim()))
    .filter(Boolean);
}

export function postHasTag(post, routeTag) {
  return post.tags.some((tag) => tag.toLowerCase() === routeTag.toLowerCase());
}

export function postHasAnyTag(post, routeTags) {
  return routeTags.some((routeTag) => postHasTag(post, routeTag));
}

export function getDisplayTag(posts, routeTag) {
  if (!routeTag) return null;

  return (
    posts
      .flatMap((post) => post.tags)
      .find((tag) => tag.toLowerCase() === routeTag.toLowerCase()) || routeTag
  );
}

export function getDisplayTags(posts, routeTags) {
  return routeTags.map((routeTag) => getDisplayTag(posts, routeTag));
}

export function toggleTagSelection(selectedTags, tag) {
  const isSelected = selectedTags.some(
    (selectedTag) => selectedTag.toLowerCase() === tag.toLowerCase(),
  );

  if (isSelected) {
    return selectedTags.filter(
      (selectedTag) => selectedTag.toLowerCase() !== tag.toLowerCase(),
    );
  }

  return [...selectedTags, tag];
}
