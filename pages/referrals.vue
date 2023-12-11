<script setup>
const { animFade, stagger, killAnimation } = useAnim();
import innerHero from "assets/images/hero-service.jpg";
const config = useRuntimeConfig();
var pageData = ref({});

const getData = () => {
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}page-data?type=referral`, {
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
    class="section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-6">
          <h1 class="innsec-title mb-3 stagger">Referrals</h1>
          <div class="innsec-content stagger">
            <p>{{ pageData.sub_header }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section">
    <div class="container">
      <div class="row gx-7 gy-5">
        <div class="col-12 col-lg-5 text-lg-end stagger">
          <div class="fs-24 fw-bold ff-heading text-black">
            <div v-html="pageData.left_side_content"></div>
          </div>
        </div>
        <div class="col-12 col-lg-7">
          <div class="content fs-16 stagger">
            <div v-html="pageData.right_side_content"></div>
          </div>
          <div class="btn-wrap mt-5 stagger">
            <a href="/referral" class="btn btn-primary rounded-3"
              ><i class="bi bi-calendar2-check me-2"></i> Refer Patient</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
