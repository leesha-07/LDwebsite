const form = document.getElementById("lead-form");
const statusEl = document.getElementById("status");
const runButton = document.getElementById("run-button");

// Paste your Make webhook URL here
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/3om5n8fsst735ygn2bvzzx3fw3w9wy1l";

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b91c1c" : "#374151";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!MAKE_WEBHOOK_URL) {
    setStatus("Webhook URL not set. Update app.js and try again.", true);
    return;
  }

  const formData = new FormData(form);
  const payload = {
    location: formData.get("location")?.trim(),
    employee_range: formData.get("employee_range")?.trim(),
    industry: formData.get("industry")?.trim(),
  };

  if (!payload.location || !payload.employee_range) {
    setStatus("Please fill in required fields.", true);
    return;
  }

  runButton.disabled = true;
  setStatus("Running... please wait");

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Request failed");
    }

    setStatus("Success. Check Google Sheets for results.");
    form.reset();
  } catch (error) {
    setStatus(`Error: ${error.message}`, true);
  } finally {
    runButton.disabled = false;
  }
});
