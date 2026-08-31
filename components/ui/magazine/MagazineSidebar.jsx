import SidebarArticleList from "./SidebarArticleList";

function SidebarWidget({ title, titleId, children }) {
  return (
    <section
      aria-labelledby={titleId}
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-custom-dark"
    >
      <h2
        id={titleId}
        className="mb-3 border-b border-gray-100 pb-2 text-base font-bold text-gray-900 dark:border-zinc-800 dark:text-white"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function MagazineSidebar({ popular = [], latest = [] }) {
  return (
    <aside className="flex flex-col gap-5">
      {popular.length ? (
        <SidebarWidget title="پربازدیدترین مطالب" titleId="popular-articles">
          <SidebarArticleList articles={popular} />
        </SidebarWidget>
      ) : null}

      {latest.length ? (
        <SidebarWidget title="جدیدترین مطالب" titleId="newest-articles">
          <SidebarArticleList articles={latest} />
        </SidebarWidget>
      ) : null}
    </aside>
  );
}
