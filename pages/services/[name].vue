<script setup>
import innerHero from "assets/images/hero2.jpg";
const { animFade, stagger, killAnimation } = useAnim();
import noImgService from "assets/images/noimage-services.jpg";

const config = useRuntimeConfig();
const { name } = useRoute().params;
var service = ref({});

nextTick(async () => {
  await useFetch(`${config.public.apiUrl}service/${name}`, {
    transform: (res) => {
      service.value = res.data;
      return res.data;
    },
  });
  useHead({
    title: service.value
      ? service.value.meta_title
      : "Responsive Centers for Psychology and Learning",
    meta: [
      {
        name: "description",
        content: service.value ? service.value.meta_description : "",
      },
    ],
  });
});

onMounted(() => {
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});
const imageError = (event) => {
  event.target.src = noImgService;
};
</script>
<template>
  <section
    class="section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-6">
          <h1 class="innsec-title mb-3 stagger">{{ service.title }}</h1>
          <div class="innsec-content stagger">
            <p>
              {{ service.sub_title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section animFade">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card-img mb-5">
            <img
              :src="`${config.public.backendAssetUrl}${service.image}`"
              class="img-fluid"
              :alt="service.title"
              @error="imageError"
              v-if="service.image"
            />
            <img
              :src="noImgService"
              class="img-fluid"
              :alt="service.title"
              v-else
            />
          </div>
        </div>
        <div class="col-12">
          <div class="content fs-16">
            <div v-html="service.description"></div>
          </div>
          <div class="btn-wrap mt-5">
            <a href="/clinicians" class="btn btn-primary rounded-3"
              ><i class="bi bi-calendar2-check me-2"></i> Make an Appointment</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
