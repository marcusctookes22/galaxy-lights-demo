// =========================
    // GALAXY WEBSITE SETTINGS
    // Replace these three values before publishing.
    // =========================
    const BUSINESS = {
      email: "your-business-email@example.com",
      phone: "+10000000000",
      instagram: "#"
    };

    // Navigation
    const nav = document.getElementById("nav");
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 24));
    menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

    // Reveal on scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // FAQ
    document.querySelectorAll(".faq-item").forEach(item => {
      item.querySelector(".faq-q").addEventListener("click", () => {
        const open = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
        if(!open) item.classList.add("open");
      });
    });

    // Service selection + conditional quote details
    const starlightDetails = document.getElementById("starlightDetails");
    const exteriorDetails = document.getElementById("exteriorDetails");

    function syncServiceDetails(){
      const selected = document.querySelector('input[name="service"]:checked')?.value || "";
      const wantsStars = selected === "Starlight Headliner" || selected === "Starlight + Exterior Contour";
      const wantsExterior = selected === "Exterior Contour Lighting" || selected === "Starlight + Exterior Contour";
      starlightDetails?.classList.toggle("active", wantsStars);
      exteriorDetails?.classList.toggle("active", wantsExterior);
    }

    document.querySelectorAll('input[name="service"]').forEach(radio => radio.addEventListener("change", syncServiceDetails));

    document.querySelectorAll("[data-service]").forEach(link => {
      link.addEventListener("click", () => {
        const value = link.dataset.service;
        const radio = [...document.querySelectorAll('input[name="service"]')].find(r => r.value === value);
        if(radio){
          radio.checked = true;
          radio.dispatchEvent(new Event("change", {bubbles:true}));
        }
      });
    });

    // Interactive Headliner Preview
    const headlinerCanvas = document.getElementById("headlinerCanvas");
    const hctx = headlinerCanvas.getContext("2d");
    const previewCount = document.getElementById("previewCount");
    const previewBadge = document.getElementById("previewBadge");
    const kitLabel = document.getElementById("kitLabel");
    const patternLabel = document.getElementById("patternLabel");
    const colorLabel = document.getElementById("colorLabel");
    const roofLabel = document.getElementById("roofLabel");
    const designSummary = document.getElementById("designSummary");

    const headlinerState = {
      kit: 850,
      pattern: "night",
      color: "ice",