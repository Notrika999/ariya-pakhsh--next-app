import SidebarArticleList from "./SidebarArticleList";

export default function PopularArticles({ articles = [] }) {
  return <SidebarArticleList articles={articles} />;
}
