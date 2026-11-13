(() => {
  const editor = document.getElementById("post-content");
  const counter = document.getElementById("word-count");
  if (!editor || !counter) return;
  const update = () => { const words = editor.value.trim().split(/\s+/).filter(Boolean).length; counter.textContent = words + (words === 1 ? " word" : " words"); };
  editor.addEventListener("input", update);
  update();
})();