<script setup>
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
const { animFade, stagger, killAnimation } = useAnim();

import innerHero from "assets/images/hero-service.jpg";
import noImgService from "assets/images/noimage-services.jpg";

const config = useRuntimeConfig();
var services = ref([]);
var take = ref(10);

const getServices = (takeValue = 10) => {
  take.value = takeValue;
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}services?active=true`, {
      transform: (res) => {
        services.value = res.data.data;
        nextTick(async () => {
          await animFade();
          await stagger();
        });

        return true;
      },
    });
  });
};

getServices();

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
          <h1 class="innsec-title mb-3 stagger">Services</h1>
          <div class="innsec-content stagger">
            <p>Early Intervention Works – We Can Help</p>
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
            We are an interdisciplinary group of therapists and educators with a
            broad range of expertise in mental health care and educational
            issues.
          </div>
        </div>
        <div class="col-12 col-lg-7">
          <div class="content fs-16 stagger">
            <p>
              We are an interdisciplinary group of therapists and educators with
              a broad range of expertise in mental health care and educational
              issues. We have been providing services in Overland Park since
              1980. We pride ourselves on our reputation, collaborative approach
              to therapy, and our strong commitment to ethical and effective
              clinical practice.
            </p>
            <p>
              Our approach to therapy is to focus on helping our clients reach
              the goals they set or solve the problems they encounter. We
              provide short-term treatment that brings about rapid improvement
              in behavior. By conducting a thorough assessment of each client’s
              needs, we develop customized treatment plans that respond directly
              to each individual. Clients are helped to evaluate and challenge
              beliefs and behaviors that lead to negative views about themselves
              and their future.
            </p>
          </div>

          <div class="btn-wrap mt-5 stagger">
            <a href="/clinicians" class="btn btn-primary rounded-3"
              ><i class="bi bi-calendar2-check me-2"></i> Make an Appointment</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section service-section animFade">
    <div class="container-fluid px-md-0 animFade">
      <div class="row justify-content-center gy-5">
        <div class="col-12">
          <Swiper
            class="service-swiper"
            :speed="800"
            :slides-per-view="1.5"
            :spaceBetween="40"
            :centeredSlides="true"
            :modules="[Navigation]"
            :navigation="{
              nextEl: '.service-section .nav-next',
              prevEl: '.service-section .nav-prev',
            }"
            :breakpoints="{
              0: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 1.5,
              },
              992: {},
            }"
          >
            <swiper-slide v-for="(service, index) in services" :key="index">
              <div class="card card-2 border-0">
                <div class="row">
                  <div class="col-12 col-lg-auto">
                    <div class="card-img">
                      <img
                        :src="`${config.public.backendAssetUrl}${service.image}`"
                        class="w-100"
                        :alt="service.title"
                        @error="imageError"
                        v-if="service.image"
                      />
                      <img
                        :src="noImgService"
                        class="w-100"
                        :alt="service.title"
                        v-else
                      />
                    </div>
                  </div>
                  <div class="col-12 col-lg">
                    <div class="card-wrapper">
                      <div class="card-body">
                        <div class="card-title">{{ service.title }}</div>
                        <div class="card-text">
                          <div
                            v-html="service.description.substring(0, 300)"
                          ></div>
                        </div>
                      </div>
                      <div
                        class="card-footer bg-transparent border-0 text-md-end"
                      >
                        <nuxt-link
                          :to="`/services/${service.slug}`"
                          class="btn-link"
                          >Learn more</nuxt-link
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </Swiper>
        </div>
        <div class="col-auto justify-self-center">
          <div class="row gx-2 gx-md-3">
            <div class="col">
              <div class="swiper-nav nav-prev">
                <i class="icon-arrow-left"></i>
              </div>
            </div>
            <div class="col">
              <div class="swiper-nav nav-next">
                <i class="icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
