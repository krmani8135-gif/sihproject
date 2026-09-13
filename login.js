// login.js - KrishiLink Login Page

let selectedRole = "farmer";

const farmerTab = document.getElementById("farmerTab");
const buyerTab = document.getElementById("buyerTab");
const submitBtn = document.getElementById("submitBtn");

farmerTab.addEventListener("click", () => setRole("farmer"));
buyerTab.addEventListener("click", () => setRole("buyer"));

function setRole(role) {
  selectedRole = role;
  farmerTab.classList.toggle("active", role === "farmer");
  buyerTab.classList.toggle("active", role === "buyer");
  submitBtn.textContent = role === "farmer" ? "Continue as Farmer" : "Continue as Buyer";
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!name || !phone || !location) {
    document.getElementById("loginMessage").innerText = "Please fill all fields.";
    return;
  }

  // Save session locally (demo only — replace with real auth + backend later)
  const user = { name, phone, location, role: selectedRole };
  localStorage.setItem("krishilink_user", JSON.stringify(user));

  document.getElementById("loginMessage").innerText = "Logging in...";

  // Redirect based on role
  setTimeout(() => {
    if (selectedRole === "farmer") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html"; // buyer view — replace with a buyer dashboard later
    }
  }, 500);
});
