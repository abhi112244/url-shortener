const tableBody = document.getElementById("linksTableBody");
const urlInput = document.getElementById("urlInput");
const addLinkBtn = document.getElementById("addLinkBtn");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
refreshBtn.addEventListener("click", fetchLinks);

async function fetchLinks() {
  const res = await fetch("/api/links");
  const links = await res.json();
  renderLinks(links);
}

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
      <button onclick="window.location.href='/code/${link.code}'">View Stats</button>

  </td>
`;

      
      tableBody.appendChild(tr);
    });
}

async function addLink() {
  const url = urlInput.value;
  if (!url) return alert("Enter a URL");

  const res = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  const data = await res.json();
  if (res.ok) {
    urlInput.value = "";
    fetchLinks();
    alert(`Short URL created: ${data.shortUrl}`);
  } else {
    alert(`Error: ${data.error}`);
  }
}

async function deleteLink(code) {
  if (!confirm("Delete this link?")) return;

  const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
  if (res.ok) fetchLinks();
  else alert("Failed to delete link");
}

function copyLink(code) {
  const shortUrl = `${window.location.origin}/${code}`;
  navigator.clipboard.writeText(shortUrl);
  alert(`Copied: ${shortUrl}`);
}

// Event listeners
addLinkBtn.addEventListener("click", addLink);
searchInput.addEventListener("input", fetchLinks);

// Initial load
fetchLinks();

// open public/js/app.js (or wherever you handle form submit)
document.getElementById('shortenForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('urlInput').value.trim();
  const useKeyword = document.getElementById('useKeywordToggle').checked;

  if (!url) {
    alert('Please paste a URL');
    return;
  }

  try {
    const res = await fetch('/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, useKeyword })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Server error');

    // show short URL
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
  } catch (err) {
    console.error(err);
    alert('Error: ' + err.message);
  }
});

