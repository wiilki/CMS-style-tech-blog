document.querySelector(".delete-post-btn")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  if (!window.confirm("Permanently delete this story and all its comments? This cannot be undone.")) return;
  button.disabled = true;
  try {
    const response = await fetch("/api/posts/" + encodeURIComponent(button.dataset.postId), { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || "Unable to delete the story."); }
    window.location.assign("/dashboard");
  } catch (error) { alert(error.message); button.disabled = false; }
});