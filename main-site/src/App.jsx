import "./App.css";
import ProjectPage from "./composables/ProjectPage";
import Shell from "./composables/Shell";
import useRoute from "./composables/useRoute";
import { posts } from "./content/posts";
import { projects } from "./content/projects";
import AboutPage from "./pages/About";
import BlogListPage from "./pages/BlogList";
import BlogPostPage from "./pages/BlogPost";
import CreativeCodePage from "./pages/CreativeCode";
import HomePage from "./pages/Home";
import NotFound from "./pages/NotFound";

function getPageFromRoute(route, prefix) {
  const value = Number(route.replace(prefix, ""));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function App() {
  const route = useRoute();
  const cleanRoute = route.replace(/\/$/, "") || "/";
  let page = <HomePage />;

  if (cleanRoute === "/blog") {
    page = <BlogListPage page={1} />;
  } else if (cleanRoute.startsWith("/blog/page/")) {
    page = <BlogListPage page={getPageFromRoute(cleanRoute, "/blog/page/")} />;
  } else if (cleanRoute.startsWith("/blog/")) {
    page = (
      <BlogPostPage
        post={posts.find((post) => `/blog/${post.slug}` === cleanRoute)}
      />
    );
  } else if (cleanRoute === "/creative-code") {
    page = <CreativeCodePage page={1} />;
  } else if (cleanRoute.startsWith("/creative-code/page/")) {
    page = (
      <CreativeCodePage
        page={getPageFromRoute(cleanRoute, "/creative-code/page/")}
      />
    );
  } else if (cleanRoute.startsWith("/creative-code/")) {
    page = (
      <ProjectPage
        project={projects.find(
          (project) => `/creative-code/${project.slug}` === cleanRoute,
        )}
      />
    );
  } else if (cleanRoute === "/about") {
    page = <AboutPage />;
  } else if (cleanRoute !== "/") {
    page = <NotFound />;
  }

  return <Shell route={cleanRoute}>{page}</Shell>;
}

export default App;
