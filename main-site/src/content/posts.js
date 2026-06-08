const postModules = import.meta.glob("./posts/*.mdx", { eager: true });

export const posts = Object.values(postModules)
  .map((module) => ({
    ...module.meta,
    Content: module.default,
  }))
  .sort((firstPost, secondPost) => {
    return new Date(secondPost.date) - new Date(firstPost.date);
  });
