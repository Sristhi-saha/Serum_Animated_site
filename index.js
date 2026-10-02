gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".heroItem");
const progressBar = document.querySelector(".progress-bar");

/* ===================== HERO SLIDES ===================== */
if (items.length > 0) {
    gsap.set(items, { opacity: 0 });
    gsap.set(items[0], { opacity: 1 });

    items.forEach((item, index) => {
        const content = item.querySelector(".item-content");
        const image = item.querySelector(".itemImage");

        if (index !== 0) {
            gsap.set(content, { opacity: 0, y: 100 });
            gsap.set(image, { scale: 1.08 });
        } else {
            gsap.set(content, { opacity: 1, y: 0 });
            gsap.set(image, { scale: 1 });
        }
    });

    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: `+=${items.length * 1000}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                if (!progressBar) return;
                progressBar.style.width = `${self.progress * 100}%`;
            },
        },
    });

    items.forEach((item, index) => {
        if (index === 0) return;

        const previousItem = items[index - 1];
        const previousContent = previousItem.querySelector(".item-content");
        const previousImage = previousItem.querySelector(".itemImage");
        const currentContent = item.querySelector(".item-content");
        const currentImage = item.querySelector(".itemImage");

        // Previous image fades and zooms out
        scrollTl.to(previousImage, {
            scale: 1.08,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
        });

        // Previous text leaves
        scrollTl.to(
            previousContent,
            { opacity: 0, y: -80, duration: 0.8, ease: "power2.in" },
            "<"
        );

        // Show next slide
        scrollTl.to(item, { opacity: 1, duration: 0.1 });

        // New image enters
        scrollTl.fromTo(
            currentImage,
            { scale: 1.12, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" },
            "<"
        );

        // New text enters
        scrollTl.to(
            currentContent,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.7"
        );
    });
}

/* ===================== HERO -> NEXT SECTION TRANSITION ===================== */

// Scroll indicator fades once the user starts scrolling
gsap.to(".scroll-indicator", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=300",
        scrub: true,
    },
});

// Hero fades and shrinks exactly while the next section slides up over it
gsap.to(".heroItem-wrapper", {
    opacity: 0,
    scale: 0.95,
    ease: "none",
    scrollTrigger: {
        trigger: ".ingredients",
        start: "top bottom",
        end: "top top",
        scrub: true,
    },
});

/* ===================== NAVBAR THEME ===================== */
// Navbar becomes light (cream bg, dark text) once it is over the cream sections
ScrollTrigger.create({
    trigger: ".ingredients",
    start: "top 90px",
    onEnter: () => document.querySelector(".navbar").classList.add("scrolled"),
    onLeaveBack: () => document.querySelector(".navbar").classList.remove("scrolled"),
});

/* ===================== SECTION ANIMATIONS ===================== */

// Eyebrows + titles
gsap.utils.toArray(".section-title, .eyebrow").forEach((el) => {
    gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
    });
});

// Ingredient cards stagger in
gsap.from(".card", {
    y: 100,
    opacity: 0,
    rotate: 3,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".cards", start: "top 80%" },
});

// Counting numbers
gsap.utils.toArray(".num").forEach((num) => {
    const obj = { val: 0 };
    gsap.to(obj, {
        val: +num.dataset.target,
        duration: 2,
        ease: "power1.out",
        onUpdate: () => (num.textContent = Math.round(obj.val)),
        scrollTrigger: { trigger: ".stats", start: "top 70%", once: true },
    });
});

// How it works: line draws, steps follow (scrubbed)
const stepsTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".steps",
        start: "top 75%",
        end: "bottom 60%",
        scrub: 1,
    },
});
stepsTl
    .from(".step-line", { scaleX: 0, duration: 1 })
    .from(".step", { y: 60, opacity: 0, stagger: 0.4, duration: 1 }, 0);

// CTA: video card parallax + content reveal
gsap.fromTo(".cta-video",
    { yPercent: 10 },
    {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
            trigger: ".cta",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
    }
);
gsap.from(".cta-content > *", {
    y: 60,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    scrollTrigger: { trigger: ".cta", start: "top 60%" },
});

// Play CTA video only while visible
const ctaVideo = document.querySelector(".cta-video video");
if (ctaVideo) {
    ScrollTrigger.create({
        trigger: ".cta",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? ctaVideo.play() : ctaVideo.pause()),
    });
}

/* ---------- Marquee: endless loop ---------- */
gsap.to(".marquee-track", {
    xPercent: -50,          // moves exactly one group, then loops seamlessly
    ease: "none",
    duration: 25,
    repeat: -1,
});

/* ---------- Showcase: image reveal + parallax, features slide in ---------- */
gsap.fromTo(
    ".showcase-img",
    { clipPath: "inset(0% 100% 0% 0%)" },
    {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".showcase",
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
        },
    }
);

gsap.fromTo(
    ".showcase-img img",
    { scale: 1.35 },
    {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".showcase",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
    }
);

gsap.from(".showcase-text .lead, .features li, .showcase-text .buy-now", {
    x: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".showcase-text", start: "top 70%" },
});

/* ---------- Journey: pinned horizontal scroll ---------- */
const journeyTrack = document.querySelector(".journey-track");

if (journeyTrack) {
    gsap.to(journeyTrack, {
        x: () => -(journeyTrack.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".journey",
            start: "top top",
            end: () => "+=" + (journeyTrack.scrollWidth - window.innerWidth),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,   // recalculates on resize
        },
    });
}

/* ---------- Reviews ---------- */
gsap.from(".review", {
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".review-grid", start: "top 80%" },
});

/* ---------- Footer: big text rises ---------- */
gsap.from(".footer-big", {
    yPercent: 40,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".footer",
        start: "top bottom",
        end: "top 30%",
        scrub: true,
    },
});

/* ===================== REFRESH ===================== */
window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts.ready.then(() => ScrollTrigger.refresh());