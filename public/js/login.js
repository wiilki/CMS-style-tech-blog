document.querySelector(".login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const username = document.getElementById("username-login").value.trim();
  const password = document.getElementById("password-login").value;
  const message = form.querySelector(".form-message");
  const button = form.querySelector('button[type="submit"]');
  if (!username || !password) { message.textContent = "Enter both your username and password."; message.hidden = false; return; }
  button.disabled = true; message.hidden = true;
  try {
    const response = await fetch("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not log in.");
    window.location.assign("/dashboard");
  } catch (error) { message.textContent = error.message; message.hidden = false; button.disabled = false; }
});