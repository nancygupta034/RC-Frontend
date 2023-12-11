import $ from "jquery";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let animFadeRevert, staggerRevert, headerRevert;

export function animFade() {
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

export function stagger() {
    staggerRevert = gsap.context((self) => {
        ScrollTrigger.batch('.stagger', {
            start: "top 90%",  
            interval: 0.15, 
            onEnter: (batch) => {  
                gsap.to(batch, {autoAlpha: 1, y: 0, stagger: 0.15, overwrite: true})
            }
        });
    });
}

export function headerToggle() {
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
                else{
                    
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

export function killAnimation() {
    staggerRevert.revert();
    animFadeRevert.revert();
    // headerRevert.revert();
    ScrollTrigger.refresh();
}
$("button").click(function () {
    $(".check-icon").hide();
    setTimeout(function () {
      $(".check-icon").show();
    }, 10);
  });

