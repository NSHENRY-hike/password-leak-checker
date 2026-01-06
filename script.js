async function checkPassword() {
  const password = document.getElementById("passwordInput").value;
  const resultDiv = document.getElementById("result");

  if (!password) {
    resultDiv.innerHTML = "⚠️ Please enter a password.";
    return;
  }

  resultDiv.innerHTML = "🔍 Checking password...";

  const hash = await sha1(password);
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    const data = await response.text();

    const lines = data.split("\n");
    for (let line of lines) {
      const [hashSuffix, count] = line.split(":");
      if (hashSuffix === suffix) {
        resultDiv.innerHTML = `❌ This password has appeared in breaches <strong>${count}</strong> times.<br>Do NOT use it.`;
        return;
      }
    }

    resultDiv.innerHTML =
      "✅ Good news! This password was NOT found in known breaches.";
  } catch (error) {
    resultDiv.innerHTML = "⚠️ Error checking password. Try again later.";
  }
}

async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
