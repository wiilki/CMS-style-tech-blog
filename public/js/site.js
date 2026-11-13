(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  try { if (localStorage.getItem("byte-theme") === "dark") root.dataset.theme = "dark"; } catch (_) {}
  if (toggle) {
    toggle.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    toggle.addEventListener("click", () => {
      const dark = root.dataset.theme !== "dark";
      root.dataset.theme = dark ? "dark" : "light";
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      try { localStorage.setItem("byte-theme", dark ? "dark" : "light"); } catch (_) {}
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const search = document.getElementById("article-search");
  const grid = document.getElementById("articles-grid");
  const empty = document.getElementById("search-empty");
  if (!search || !grid) return;
  const stories = Array.from(grid.querySelectorAll(".story-card"));
  const render = () => {
    const query = search.value.toLocaleLowerCase().trim();
    let visible = 0;
    stories.forEach((card) => {
      const matches = (card.dataset.search || "").toLocaleLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (empty) empty.hidden = visible !== 0 || stories.length === 0;
  };
  search.addEventListener("input", render);
  document.getElementById("clear-search")?.addEventListener("click", () => { search.value = ""; render(); search.focus(); });
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-sort]").forEach((item) => { item.classList.toggle("active", item === button); item.setAttribute("aria-pressed", String(item === button)); });
      const dir = button.dataset.sort === "oldest" ? 1 : -1;
      stories.sort((a, b) => dir * (new Date(a.dataset.date).getTime() - new Date(b.dataset.date).getTime())).forEach((card) => grid.append(card));
    });
  });
})();