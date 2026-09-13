// frontend/script.js - KrishiLink
const API_BASE = "http://localhost:5000/api";

// ---------------------------------------------
// 1. Load Mandi Prices
// ---------------------------------------------
async function loadPrices() {
  try {
    const res = await fetch(`${API_BASE}/prices`);
    const data = await res.json();

    let html = `
      <table>
        <tr>
          <th>Crop</th><th>Mandi</th><th>District</th><th>Price (₹)</th><th>Unit</th><th>Date</th>
        </tr>
    `;
    data.forEach(item => {
      html += `
        <tr>
          <td>${item.crop}</td>
          <td>${item.mandi}</td>
          <td>${item.district}</td>
          <td>₹${item.price}</td>
          <td>${item.unit}</td>
          <td>${item.date}</td>
        </tr>
      `;
    });
    html += "</table>";

    document.getElementById("priceTableContainer").innerHTML = html;

    // Build chart from this data
    renderChart(data);
  } catch (err) {
    document.getElementById("priceTableContainer").innerHTML =
      "⚠️ Could not load prices. Is the backend server running on port 5000?";
    console.error(err);
  }
}

// ---------------------------------------------
// 2. Render Price Chart
// ---------------------------------------------
function renderChart(data) {
  const ctx = document.getElementById("priceChart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(item => item.crop),
      datasets: [{
        label: "Price (₹ per quintal)",
        data: data.map(item => item.price),
        backgroundColor: "#2e7d32",
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
}

// ---------------------------------------------
// 3. Handle Farmer Listing Form Submit
// ---------------------------------------------
document.getElementById("listingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    farmerName: document.getElementById("farmerName").value,
    crop: document.getElementById("crop").value,
    quantity: document.getElementById("quantity").value,
    location: document.getElementById("location").value,
    expectedPrice: document.getElementById("expectedPrice").value,
  };

  try {
    const res = await fetch(`${API_BASE}/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      document.getElementById("formMessage").innerText = "✅ Listing submitted!";
      document.getElementById("listingForm").reset();
      loadListings();
    } else {
      document.getElementById("formMessage").innerText = "❌ Please fill all required fields.";
    }
  } catch (err) {
    document.getElementById("formMessage").innerText = "⚠️ Server not reachable.";
    console.error(err);
  }
});

// ---------------------------------------------
// 4. Load Listings (Buyer View)
// ---------------------------------------------
async function loadListings() {
  try {
    const res = await fetch(`${API_BASE}/listings`);
    const data = await res.json();

    if (data.length === 0) {
      document.getElementById("listingsContainer").innerHTML = "No listings yet.";
      return;
    }

    let html = "";
    data.forEach(item => {
      html += `
        <div class="listing-item">
          <strong>${item.crop}</strong> - ${item.quantity} quintal <br/>
          Farmer: ${item.farmerName} | Location: ${item.location} <br/>
          Expected Price: ${item.expectedPrice ? "₹" + item.expectedPrice : "Not specified"}
        </div>
      `;
    });

    document.getElementById("listingsContainer").innerHTML = html;
  } catch (err) {
    document.getElementById("listingsContainer").innerHTML = "⚠️ Could not load listings.";
    console.error(err);
  }
}

// ---------------------------------------------
// Init
// ---------------------------------------------
loadPrices();
loadListings();
