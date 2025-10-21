// Replace with your Hugging Face API key
const HF_API_KEY = "YOUR_HUGGINGFACE_API_KEY";
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

const promptInput = document.getElementById("prompt");
const resultEl = document.getElementById("result");
const checkBtn = document.getElementById("checkBtn");
const loadingEl = document.getElementById("loading");
const pingSound = document.getElementById("ping");
const appBox = document.getElementById("app");

// Function to check prompt
checkBtn.addEventListener("click", async () => {
  const text = promptInput.value.trim();
  if (!text) return alert("Please enter a prompt.");

  resultEl.innerText = "";
  loadingEl.classList.remove("hidden");
  document.body.style.background = "#222";
  appBox.style.boxShadow = "0 0 25px rgba(255, 255, 255, 0.1)";

  try {
    const response = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${HF_API_KEY}`, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ inputs: text, parameters: { candidate_labels: ["create", "guide"] } })
    });

    const data = await response.json();
    loadingEl.classList.add("hidden");

    const topLabel = data.labels[0];
    const score = (data.scores[0] * 100).toFixed(1);

    resultEl.innerText = `Detected: ${topLabel.toUpperCase()} (${score}%)`;
    pingSound.play();

    if (topLabel === "create") {
      document.body.style.background = "linear-gradient(120deg, #ff4d4d, #990000)";
      appBox.style.boxShadow = "0 0 40px rgba(255, 77, 77, 0.7)";
    } else {
      document.body.style.background = "linear-gradient(120deg, #33cc33, #006600)";
      appBox.style.boxShadow = "0 0 40px rgba(51, 204, 51, 0.7)";
    }

  } catch (err) {
    loadingEl.classList.add("hidden");
    resultEl.innerText = "Error: Could not analyze prompt.";
    console.error(err);
  }
});

// Submit on Enter key
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    checkBtn.click();
  }
});
