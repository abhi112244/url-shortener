const API_BASE = "https://tiny-link-backend-lmr4.onrender.com";

const tableBody = document.getElementById("linksTableBody");
const urlInput = document.getElementById("urlInput");
const addLinkBtn = document.getElementById("addLinkBtn");
const searchInput = document.getElementById("searchInput");

// Fetch and render all links
async function fetchLinks() {
  try {
    const res = await fetch(`${API_BASE}/api/links`);
    if (!res.ok) throw new Error("Failed to fetch links");
    const links = await res.json();
    renderLinks(links);
  } catch (err) {
    console.error(err);
    alert("Error fetching links. Check backend or CORS settings.");
  }
}

// Render links in table
function renderLinks(links) {
  const searchTerm = searchInput.value.toLowerCase();
  tableBody.innerHTML = "";

  links
    .filter(link =>
      link.code.toLowerCase().includes(searchTerm) ||
      link.original_url.toLowerCase().includes(searchTerm)
    )
    .forEach(link => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-4 py-2">${link.code}</td>
        <td class="px-4 py-2 truncate max-w-xs">${link.original_url}</td>
        <td class="px-4 py-2">${link.clicks}</td>
        <td class="px-4 py-2">${link.last_clicked ?? "-"}</td>
        <td class="px-4 py-2 flex gap-2">
          <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteLink('${link.code}')">Delete</button>
          <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onclick="copyLink('${link.code}')">Copy</button>
          <button onclick="window.open('${API_BASE}/code/${link.code}', '_blank')">View Stats</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
}

// Add new link
async function addLink() {
  let url = urlInput.value.trim();
  if (!url) return alert("Enter a URL");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const res = await fetch(`${API_BASE}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    let data = {};
    try {
      data = await res.json(); // Try parsing JSON
    } catch {
      // Ignore parse errors (backend might return empty body)
    }

    if (!res.ok) {
      return alert(`Error: ${data.error || "Failed to create link"}`);
    }

    urlInput.value = "";
    fetchLinks();
    alert(`Short URL created: ${data.shortUrl || data.code || "Link created"}`);
  } catch (err) {
    console.error(err);
    alert("Error adding link. Check backend or network.");
  }
}

// Delete link
async function deleteLink(code) {
  if (!confirm("Delete this link?")) return;

  try {
    const res = await fetch(`${API_BASE}/api/links/${code}`, { method: "DELETE" });
    if (res.ok) fetchLinks();
    else alert("Failed to delete link");
  } catch (err) {
    console.error(err);
    alert("Error deleting link.");
  }
}

// Copy link to clipboard
function copyLink(code) {
  const shortUrl = `${API_BASE}/${code}`;
  navigator.clipboard.writeText(shortUrl);
  alert(`Copied: ${shortUrl}`);
}

// Event listeners
addLinkBtn.addEventListener("click", addLink);
searchInput.addEventListener("input", fetchLinks);

// Initial load
fetchLinks();
