import { useEffect, useState } from "react";
import WordPressContext from "./WordPressContext";

const apiRoot = (import.meta.env.VITE_WORDPRESS_API_URL || "").replace(/\/$/, "");

function htmlToText(html) {
  const document = new DOMParser().parseFromString(html, "text/html");
  return document.body.textContent || "";
}

function toPost(item) {
  const terms = item._embedded?.["wp:term"]?.flat() || [];
  const tags = terms
    .filter((term) => term.taxonomy === "post_tag")
    .map((term) => term.name);
  const plainText = item.content?.rendered?.replace(/<[^>]*>/g, " ") || "";
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  return {
    id: item.id,
    slug: item.slug,
    title: htmlToText(item.title?.rendered || "Ohne Titel"),
    date: item.date,
    readingTime: `${Math.max(1, Math.ceil(words / 200))} min`,
    excerpt: htmlToText(item.excerpt?.rendered || ""),
    tags,
    html: item.content?.rendered || "",
  };
}

function toPage(item) {
  return {
    id: item.id,
    slug: item.slug,
    title: htmlToText(item.title?.rendered || "Ohne Titel"),
    html: item.content?.rendered || "",
  };
}

export default function WordPressProvider({ children }) {
  const [data, setData] = useState({
    posts: [],
    pages: [],
    status: apiRoot ? "loading" : "unconfigured",
    error: "",
  });

  useEffect(() => {
    if (!apiRoot) return undefined;

    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([
      fetch(`${apiRoot}/wp/v2/posts?per_page=100&_embed`, options),
      fetch(`${apiRoot}/wp/v2/pages?per_page=100`, options),
    ])
      .then(async ([postsResponse, pagesResponse]) => {
        if (!postsResponse.ok || !pagesResponse.ok) {
          throw new Error("WordPress konnte die Inhalte nicht laden.");
        }
        const [postItems, pageItems] = await Promise.all([
          postsResponse.json(),
          pagesResponse.json(),
        ]);
        setData({
          posts: postItems
            .map(toPost)
            .sort((a, b) => new Date(b.date) - new Date(a.date)),
          pages: pageItems.map(toPage),
          status: "ready",
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setData({ posts: [], pages: [], status: "error", error: error.message });
        }
      });

    return () => controller.abort();
  }, []);

  return <WordPressContext.Provider value={data}>{children}</WordPressContext.Provider>;
}
