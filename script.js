(() => {
  "use strict";

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");

  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  };

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Menu aktif sesuai bagian yang dilihat ---------- */
  const links = [...nav.querySelectorAll("a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Foto: tampilkan inisial bila foto.jpg belum ada ---------- */
  const img = document.querySelector("#photo img");
  if (img) {
    const hide = () => { img.hidden = true; };
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  }

  /* ---------- Klik foto: siluet pramugari muncul / sembunyi ---------- */
  const photoBtn = document.getElementById("photoBtn");
  const photoHint = document.getElementById("photoHint");

  if (photoBtn) {
    const wrap = photoBtn.closest(".photo-wrap");
    photoBtn.addEventListener("click", () => {
      const open = wrap.classList.toggle("is-open");
      photoBtn.setAttribute("aria-pressed", String(open));
      photoBtn.setAttribute(
        "aria-label",
        open
          ? "Foto Kharisma Eka Ardina Handayani. Klik untuk menyembunyikan siluet pramugari"
          : "Foto Kharisma Eka Ardina Handayani. Klik untuk menampilkan siluet pramugari"
      );
      photoHint.textContent = open
        ? "Klik lagi untuk menyembunyikan"
        : "Klik foto untuk menampilkan siluet pramugari";
    });
  }

  /* ---------- Timeline pendidikan: pesawat mengikuti scroll ---------- */
  const timeline = document.getElementById("timeline");
  const steps = timeline ? [...timeline.querySelectorAll(".step")] : [];

  const updateTimeline = () => {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.55;
    const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
    timeline.style.setProperty("--p", progress.toFixed(4));

    steps.forEach((step) => {
      step.classList.toggle("is-passed", step.getBoundingClientRect().top < anchor);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateTimeline();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateTimeline();

  /* ---------- Salin email ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast("Email disalin");
      } catch (err) {
        showToast("Gagal menyalin. Salin secara manual.");
      }
    });
  });
})();
