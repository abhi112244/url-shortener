const linkDetails = document.getElementById("linkDetails");

// Get the code from URL path, e.g., "/code/7cksml"
const code = window.location.pathname.split("/").pop();

async function fetchLinkStats() {
  try {
    const res = await fetch(`/api/links/${code}`);
    const data = await res.json();

    if (!res.ok) {
      linkDetails.innerHTML = `<p class="text-red-500">${data.error}</p>`;
      return;
    }

    linkDetails.innerHTML = `
      <p><strong>Short URL:</strong> 
         <a href="${data.shortUrl}" target="_blank" class="text-blue-500 hover:underline">
           ${data.shortUrl}
         </a>
      </p>
      <p><strong>Original URL:</strong> 
         <a href="${data.data.original_url}" target="_blank" class="text-blue-500 hover:underline">
           ${data.data.original_url}
         </a>
      </p>
      <p><strong>Total Clicks:</strong> ${data.data.clicks}</p>
      <p><strong>Last Clicked:</strong> ${data.data.last_clicked ?? "-"}</p>
      <p><strong>Created At:</strong> ${new Date(data.data.created_at).toLocaleString()}</p>
    `;
  } catch (error) {
    linkDetails.innerHTML = `<p class="text-red-500">Error loading link stats</p>`;
    console.error("Stats Fetch Error:", error);
  }
}

// Fetch stats on page load
fetchLinkStats();
