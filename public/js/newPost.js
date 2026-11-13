document.querySelector(".new-post-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.elements["post-title"].value.trim();
  const description = form.elements["post-content"].value.trim();
  const message = form.querySelector(".form-message");
  const button = form.querySelector('button[type="submit"]');
  if (title.length < 3 || description.length < 10) { message.textContent = "Please add a title (3+ characters) and story (10+ characters)."; message.hidden = false; return; }
  button.disabled = true; message.hidden = true;
  try {
    const response = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unable to publish the story.");
    window.location.assign("/dashboard");
  } catch (error) { message.textContent = error.message; message.hidden = false; button.disabled = false; }
});