document.querySelector(".signup-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const username = document.getElementById("username-signup").value.trim();
  const password = document.getElementById("password-signup").value;
  const message = form.querySelector(".form-message");
  const button = form.querySelector('button[type="submit"]');
  if (!/^[A-Za-z0-9_-]{3,30}$/.test(username) || password.length < 8) { message.textContent = "Choose a username (3–30 letters, numbers, _ or -) and a password of at least 8 characters."; message.hidden = false; return; }
  button.disabled = true; message.hidden = true;
  try {
    const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not create your account.");
    window.location.assign("/dashboard");
  } catch (error) { message.textContent = error.message; message.hidden = false; button.disabled = false; }
});