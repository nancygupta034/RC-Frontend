import $ from "jquery";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let animFadeRevert, staggerRevert, headerRevert;

export const useAnim = () => {
    const headerToggle = () => {
        headerRevert = gsap.context(() => {
            let $this = $('.header-main'); 
            let elHeader = gsap.from($this, {
                yPercent: -100,
                paused: true,
                duration: 0.4,
                ease: "power1.inOut",
            }).progress(1);
        
            ScrollTrigger.create({
                start: "5% top",
                onUpdate: (self) => {
                    self.direction === -1 ? elHeader.play() : elHeader.reverse();
                    if($('body').hasClass('menu-active')){
                        elHeader.pause();
                    }
                },
                onEnter: (self) => {
                    $this.addClass('active');
                    ScrollTrigger.refresh();
                },
                onLeaveBack: (self) => {
                    $this.removeClass('active');
                },
            });
        });
    }

    const animFade = () => {
        animFadeRevert = gsap.context(() => {
            let elAnimFade = document.querySelectorAll('.animFade');
            elAnimFade.forEach(items => {
                gsap.to(items, {
                    scrollTrigger: {
                        trigger: items,
                        start: `top 100%`,
                    },
                    duration: 1,
                    autoAlpha: 1,
                    ease: "power1.out",
                });
            });
        });
    }

    const stagger = () => {
        staggerRevert = gsap.context(() => {
            ScrollTrigger.batch('.stagger', {
                start: "top 90%",  
                interval: 0.15, 
                onEnter: (batch) => {  
                    gsap.to(batch, {autoAlpha: 1, y: 0, stagger: 0.15, overwrite: true})
                }
            });
        });
    }

    const killAnimation = () => {
        staggerRevert.revert();
        animFadeRevert.revert();
        ScrollTrigger.refresh();
    }

    const refreshAnim = () => {
        
    }

    return{
        headerToggle,
        animFade,
        stagger,
        killAnimation,
        refreshAnim
    }
}
