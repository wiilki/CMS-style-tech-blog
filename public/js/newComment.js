document.querySelector(".comment-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const body = form.elements["comment-body"].value.trim();
  const message = form.querySelector(".form-message");
  const button = form.querySelector('button[type="submit"]');
  const post_id = window.location.pathname.split("/").filter(Boolean).pop();
  if (body.length < 2) { message.textContent = "Please write at least two characters."; message.hidden = false; return; }
  button.disabled = true; message.hidden = true;
  try {
    const response = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id, body }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to post comment.");
    window.location.reload();
  } catch (error) { message.textContent = error.message; message.hidden = false; button.disabled = false; }
});