<script setup>
const { animFade, stagger, killAnimation } = useAnim();
import innerHero from "assets/images/hero-service.jpg";
const config = useRuntimeConfig();
var pageData = ref({});

const getData = () => {
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}page-data?type=opportunity`, {
      transform: (res) => {
        pageData.value = res.data;
      },
    });
  });
};

getData();

onMounted(() => {
  animFade();
  stagger();
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
        <div class="col-12 col-lg-6">
          <h1 class="innsec-title mb-3 stagger">OPPORTUNITIES</h1>
          <div class="innsec-content stagger">
            <p>{{ pageData.sub_header }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section animFade">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="content link-color-secondary fs-16" v-html="pageData.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
