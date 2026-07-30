document.querySelectorAll("form.js-delete").forEach((form) => {
  form.addEventListener("submit", (event) => {
    const confirmed = window.confirm("Delete this book from your log?");
    if (!confirmed) {
      event.preventDefault();
    }
  });
});

const params = new URLSearchParams(window.location.search);
const currentSort = params.get("sort") || "recency";

document.querySelectorAll(".sort-tab").forEach((tab) => {
  if (tab.dataset.sort === currentSort) {
    tab.classList.add("is-active");
  }
});
