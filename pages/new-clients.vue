<script setup>
import innerHero from "assets/images/hero-blog.jpg";
const { animFade, stagger, killAnimation } = useAnim();

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
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">New Clients</h1>
        </div>
      </div>
    </div>
  </section>

  <div class="section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h4>Coming Soon......</h4>
        </div>
      </div>
    </div>
  </div>
</template>
