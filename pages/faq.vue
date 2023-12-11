<script setup>
import $ from "jquery";
import innerHero from "assets/images/hero-blog.jpg";
var faqs = ref([]);
const config = useRuntimeConfig();
const { animFade, stagger, killAnimation } = useAnim();

const getFaqSlide = (el) => {
  let $this = $(el.currentTarget);
  $this
    .parent()
    .toggleClass("active")
    .siblings()
    .removeClass("active")
    .find(".card-text")
    .stop()
    .slideUp(300);
  $this.parent().find(".card-text").stop().slideToggle(300);
};

const getFaqs = () => {
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}faqs?active=true`, {
      transform: (res) => {
        faqs.value = res.data.data;
        nextTick(async () => {
          await animFade();
          await stagger();
        });

        return true;
      },
    });
  });
};

onMounted(() => {
  getFaqs();
  animFade();
  stagger();
  setTimeout(() => {
    $(".faq-wrapper li>.card-title").on("click", getFaqSlide);
  }, 2000);
});

onBeforeUnmount(() => {
  killAnimation();
});
</script>

<template>
  <section
    class="section blog-section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">FAQ</h1>
        </div>
      </div>
    </div>
  </section>

  <div class="section faq-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <ul class="list-unstyled m-0 faq-wrapper" v-if="faqs.length">
            <li
              class="card-faq stagger"
              v-for="(faq, index) in faqs"
              :key="index"
            >
              <h2 class="card-title">
                {{ faq.question }}
              </h2>
              <div class="card-text">
                <div v-html="faq.answer"></div>
              </div>
            </li>
          </ul>
          <ul class="list-unstyled m-0 faq-wrapper" v-else>
            <li>
              <h2 class="card-title">No record found!</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
