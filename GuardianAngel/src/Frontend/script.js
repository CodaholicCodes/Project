
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const sections = document.querySelectorAll(".section");
  const sosButton = document.getElementById("sos-button");
  const floatingSos = document.getElementById("floating-sos");
  const addContactBtn = document.getElementById("add-contact");
  const contactsContainer = document.getElementById("contacts-container");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  let userPosition = null;
  let userMarker = null;
  let userPath = null;
  let trackingInterval = null;
  let trackerMap = null;
  let routeMap = null;
  let routeLayer = null;
  let selectedDuration = 15; // Default duration

  const applyTheme = () => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  });

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((section) => observer.observe(section));

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userPosition = position;
          document.getElementById("latitude").textContent =
            position.coords.latitude.toFixed(6);
          document.getElementById("longitude").textContent =
            position.coords.longitude.toFixed(6);

          if (!trackerMap) initTrackerMap();
          if (!routeMap) initRouteMap();
        },
        (error) => {
          console.error("Error getting location:", error);
          document.getElementById("latitude").textContent = "Not available";
          document.getElementById("longitude").textContent = "Not available";
          // Alert user that features requiring location will not work
          alert("Could not get your location. Map features will be unavailable.");
        }
      );
    } else {
      document.getElementById("latitude").textContent = "Not supported";
      document.getElementById("longitude").textContent = "Not supported";
      alert("Geolocation is not supported by your browser.");
    }
  };

  // --- Map Initialization ---
  const initTrackerMap = () => {
    if (!userPosition) return;
    const { latitude, longitude } = userPosition.coords;
    trackerMap = L.map("tracker-map").setView([latitude, longitude], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(trackerMap);
    userMarker = L.marker([latitude, longitude], {
      icon: L.divIcon({ className: "live-tracker-icon" }),
    }).addTo(trackerMap);
    userPath = L.polyline([], { color: "#EC4899" }).addTo(trackerMap);
  };

  const initRouteMap = () => {
    if (!userPosition) return;
    const { latitude, longitude } = userPosition.coords;
    routeMap = L.map("route-map").setView([latitude, longitude], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(routeMap);
    L.marker([latitude, longitude], {
      icon: L.divIcon({ className: "route-marker" }),
    })
      .addTo(routeMap)
      .bindPopup("Your Location");
  };

  // --- Live Tracker Functionality ---
  const updateTrackerPosition = (position) => {
    if (!trackerMap || !userMarker) return;
    const { latitude, longitude } = position.coords;
    const latLng = [latitude, longitude];

    userMarker.setLatLng(latLng);
    userPath.addLatLng(latLng);
    trackerMap.panTo(latLng);
  };

  const startTracking = (duration) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    document.getElementById("start-tracking").classList.add("hidden");
    document.getElementById("stop-tracking").classList.remove("hidden");

    // Get initial position and start watching
    navigator.geolocation.getCurrentPosition(updateTrackerPosition);
    trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(updateTrackerPosition);
    }, 5000); // Update every 5 seconds

    setTimeout(stopTracking, duration * 60000);
    alert(`Live location sharing started for ${duration} minutes.`);
  };

  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval = null;
    }
    document.getElementById("stop-tracking").classList.add("hidden");
    document.getElementById("start-tracking").classList.remove("hidden");
    alert("Live location sharing stopped.");
  };

  // --- Safe Route Planner ---
  const planSafeRoute = () => {
    if (!userPosition) {
      alert("Please enable location services to plan a route.");
      return;
    }
    const destination = document.getElementById("destination").value;
    if (!destination) {
      alert("Please enter a destination");
      return;
    }

    // --- MOCK ROUTE ---
    // In a real app, you would use a routing API (like OSRM, Mapbox, Google Maps)
    // to get coordinates based on the destination address.
    const start = [
      userPosition.coords.latitude,
      userPosition.coords.longitude,
    ];
    // Simulate a destination a bit away from the start
    const dest = [
      userPosition.coords.latitude + 0.02,
      userPosition.coords.longitude + 0.03,
    ];

    if (routeLayer) routeMap.removeLayer(routeLayer);

    L.marker(dest, { icon: L.divIcon({ className: "route-marker" }) })
      .addTo(routeMap)
      .bindPopup(destination);

    routeLayer = L.polyline([start, dest], {
      className: "path-highlight",
    }).addTo(routeMap);

    routeMap.fitBounds([start, dest], { padding: [50, 50] });

    // Show mock route info
    const routeInfo = document.getElementById("route-info");
    routeInfo.classList.remove("hidden");
    document.getElementById("route-distance").textContent = "2.5 km";
    document.getElementById("route-time").textContent = "35 min";
    document.getElementById("safety-score").textContent = "92%";
    document.getElementById("lit-areas").textContent = "85%";

    alert(`Safe route to "${destination}" planned.`);
  };

  // --- SOS Functionality ---
  const triggerSOS = () => {
    if (!userPosition) {
      alert("Cannot send SOS. Please enable location services.");
      return;
    }

    // --- MOCK API CALL ---
    // This simulates sending the SOS alert without needing a backend.
    console.log("SOS TRIGGERED at:", userPosition.coords);
    alert(
      "SOS Alert Sent! Help is on the way. Authorities have been notified with your location."
    );

    // Visual feedback
    document.body.classList.add("bg-red-100", "dark:bg-red-900/20");
    setTimeout(() => {
      document.body.classList.remove("bg-red-100", "dark:bg-red-900/20");
    }, 2000);

    /*
        // --- REAL API CALL (example) ---
        const { latitude, longitude } = userPosition.coords;
        fetch(`http://localhost:8080/GET%20HELP/sos?lat=${latitude}&lng=${longitude}`)
            .then(response => response.text())
            .then(data => {
                alert("SOS Alert Sent! Help is on the way.");
                console.log("SOS Response:", data);
            })
            .catch(error => {
                console.error("Error sending SOS:", error);
                alert("Failed to send SOS. Please check your connection.");
            });
        */
  };

  // --- Add/Delete Contact Functionality ---
  const addContact = () => {
    const nameInput = document.getElementById("contact-name");
    const phoneInput = document.getElementById("contact-phone");
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
      alert("Please enter both name and phone number.");
      return;
    }

    // --- MOCK API CALL ---
    // This simulates adding the contact to a database.
    console.log("Adding contact:", { name, phone });
    createContactCard(name, phone);
    alert("Contact added successfully!");
    nameInput.value = "";
    phoneInput.value = "";
  };

  const createContactCard = (name, phone) => {
    const contactElement = document.createElement("div");
    contactElement.className =
      "contact-card bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-all";
    contactElement.innerHTML = `
      <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-user text-primary"></i>
          </div>
          <div>
              <h4 class="font-bold text-slate-800 dark:text-white">${name}</h4>
              <p class="text-slate-600 dark:text-slate-300">${phone}</p>
          </div>
      </div>
      <div class="flex justify-end">
          <button class="delete-contact-btn text-red-500 hover:text-red-700" aria-label="Delete ${name}">
              <i class="fas fa-trash-alt"></i>
          </button>
      </div>
    `;
    contactsContainer.appendChild(contactElement);
  };

  // Event delegation for deleting contacts
  contactsContainer.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-contact-btn");
    if (deleteButton) {
      const card = deleteButton.closest(".contact-card");
      card.style.transform = "scale(0.9)";
      card.style.opacity = "0";
      setTimeout(() => card.remove(), 300); // Remove after animation
    }
  });

  // --- Event Listeners ---
  sosButton.addEventListener("click", triggerSOS);
  floatingSos.addEventListener("click", triggerSOS);
  addContactBtn.addEventListener("click", addContact);
  document.getElementById("plan-route").addEventListener("click", planSafeRoute);

  document.querySelectorAll(".duration-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update state
      selectedDuration = parseInt(btn.dataset.minutes);

      // Update styles
      document.querySelectorAll(".duration-btn").forEach((b) => {
        b.classList.remove("bg-primary", "text-white");
        b.classList.add("bg-slate-100", "dark:bg-slate-700");
      });
      btn.classList.add("bg-primary", "text-white");
      btn.classList.remove("bg-slate-100", "dark:bg-slate-700");
    });
  });

  document.getElementById("start-tracking").addEventListener("click", () => {
    if (!selectedDuration) {
      alert("Please select a duration first.");
      return;
    }
    startTracking(selectedDuration);
  });

  document.getElementById("stop-tracking").addEventListener("click", stopTracking);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed navbar
          behavior: "smooth",
        });
        // Close mobile menu on link click
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // --- Initializations ---
  applyTheme();
  getLocation();
});