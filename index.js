gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".heroItem");
const progressBar = document.querySelector(".progress-bar");

if (items.length > 0) {

    // --------------------------------
    // INITIAL STATE
    // --------------------------------

    gsap.set(items, {
        opacity: 0
    });

    gsap.set(items[0], {
        opacity: 1
    });


    // --------------------------------
    // SET CONTENT INITIAL STATE
    // --------------------------------

    items.forEach((item, index) => {

        const content = item.querySelector(".item-content");
        const image = item.querySelector(".itemImage");

        if (index !== 0) {

            gsap.set(content, {
                opacity: 0,
                y: 100
            });

            gsap.set(image, {
                scale: 1.08
            });

        } else {

            gsap.set(content, {
                opacity: 1,
                y: 0
            });

            gsap.set(image, {
                scale: 1
            });
        }

    });


    // --------------------------------
    // SCROLL TIMELINE
    // --------------------------------

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

                progressBar.style.width =
                    `${self.progress * 100}%`;
            }

        }

    });


    // --------------------------------
    // SLIDE ANIMATION
    // --------------------------------

    items.forEach((item, index) => {

        if (index === 0) return;

        const previousItem = items[index - 1];

        const previousContent =
            previousItem.querySelector(".item-content");

        const previousImage =
            previousItem.querySelector(".itemImage");


        const currentContent =
            item.querySelector(".item-content");

        const currentImage =
            item.querySelector(".itemImage");


        // Previous image fades and zooms out
        scrollTl.to(previousImage, {

            scale: 1.08,

            opacity: 0,

            duration: 1,

            ease: "power2.inOut"

        });


        // Previous text leaves
        scrollTl.to(previousContent, {

            opacity: 0,

            y: -80,

            duration: 0.8,

            ease: "power2.in"

        }, "<");


        // Show next slide
        scrollTl.to(item, {

            opacity: 1,

            duration: 0.1

        });


        // New image enters
        scrollTl.fromTo(currentImage,

            {
                scale: 1.12,
                opacity: 0
            },

            {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            },

            "<"
        );


        // New text enters
        scrollTl.to(currentContent, {

            opacity: 1,

            y: 0,

            duration: 0.8,

            ease: "power3.out"

        }, "-=0.7");

    });

}