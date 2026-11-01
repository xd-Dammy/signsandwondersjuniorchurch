document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");

    fetch("content/events.json")
        .then(response => {
            if(!response.ok) throw new Error("Database file missing");
            return response.json();
        })
        .then(events => {
            galleryContainer.innerHTML = ""; // Clear loading state
            
            if (!events || events.length === 0) {
                galleryContainer.innerHTML = "<div class='loading-state'>No program albums uploaded yet. Click Admin to upload!</div>";
                return;
            }

            events.forEach(event => {
                const albumCard = document.createElement("div");
                albumCard.className = "album-card";

                let imagesHTML = "";
                if(event.images && Array.isArray(event.images)) {
                    event.images.forEach(imgUrl => {
                        // Ensure relative paths evaluate correctly from project root
                        const normalizedUrl = imgUrl.startsWith('/') ? imgUrl.substring(1) : imgUrl;
                        imagesHTML += `<img src="${normalizedUrl}" alt="${event.title}" class="gallery-thumb" onclick="viewLightbox('${normalizedUrl}', '${event.title}')">`;
                    });
                }

                albumCard.innerHTML = `
                    <h3>${event.title}</h3>
                    <p class="event-date">📅 ${event.date}</p>
                    <p>${event.description || 'No description provided.'}</p>
                    <div class="image-grid">${imagesHTML}</div>
                `;
                
                galleryContainer.appendChild(albumCard);
            });
        })
        .catch(error => {
            console.error("Error loading gallery pipeline:", error);
            galleryContainer.innerHTML = "<div class='loading-state' style='color:red;'>Failed to load gallery entries. Verify content/events.json structure.</div>";
        });
});

function viewLightbox(url, title) {
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const downloadLink = document.getElementById("download-link");

    modal.style.display = "block";
    modalImg.src = url;
    captionText.innerHTML = title;
    downloadLink.href = url;
    downloadLink.download = title.replace(/\s+/g, '-').toLowerCase() + "-image.jpg";
}

function closeLightbox() {
    document.getElementById("lightbox-modal").style.display = "none";
}
