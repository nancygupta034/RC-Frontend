<script setup>
import { EffectFade, Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import $ from "jquery";
import { gsap } from "gsap";
import noImgService from "assets/images/noimage-services.jpg";
import noImgBlog from "assets/images/noimage-blog.jpg";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();

var services = ref([]);
var take = ref(10);
var blogs = ref([]);

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

const getBlogs = () => {
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}blogs?active=true`, {
      transform: (res) => {
        blogs.value = res.data.data;
        nextTick(async () => {
          await animFade();
          await stagger();
        });

        return true;
      },
    });
  });
};

getBlogs();

const { data: home } = await useFetch(`${config.public.jsonUrl}home.json`, {
  transform: (res) => {
    return res;
  },
});

const heroSwiperAnim = (value) => {
  gsap.fromTo(
    $(value).find(".swiper-stagger"),
    { y: 80, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.7,
      stagger: 0.2,
      overwrite: true,
      ease: "power2.inOut",
    }
  );
};

const heroSwiper = (v) => {
  let swiperActiveSlide = v.slides[v.activeIndex];
  heroSwiperAnim(swiperActiveSlide);
};

const heroSlideChange = (v) => {
  let swiperActiveSlide = v.slides[v.activeIndex];
  heroSwiperAnim(swiperActiveSlide);
};

onMounted(() => {
  animFade();
  stagger();
  localStorage.setItem("reference_id", "");
});

onBeforeUnmount(() => {
  killAnimation();
});
const formatDateInMDY = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const onServiceImageError = (event) => {
  event.target.src = noImgService;
};

const onBlogImageError = (event) => {
  event.target.src = noImgBlog;
};
</script>
<template>
  <section class="section-hero animFade">
    <swiper
      class="hero-swiper h-100"
      :speed="800"
      :loop="true"
      @swiper="heroSwiper"
      :slides-per-view="1"
      :modules="[EffectFade, Pagination, Autoplay]"
      effect="fade"
      :pagination="{ el: '.swiper-pagination', clickable: true }"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      @slideChange="heroSlideChange"
    >
      <swiper-slide v-for="(data, index) in home.slides" :key="index">
        <div
          class="hero-bg"
          :style="`background-image:url(${
            config.public.assetsDir + data.image
          })`"
        ></div>
        <div class="container h-100">
          <div class="row h-100 align-content-center">
            <div class="col-12 col-md-9 col-xl-7">
              <div class="hero-card text-white">
                <div class="hero-title swiper-stagger">{{ data.title }}</div>
                <div
                  class="hero-text swiper-stagger"
                  v-html="data.content"
                ></div>
                <div class="hero-btn swiper-stagger">
                  <a href="/clinicians" class="btn btn-white"
                    ><i class="bi bi-calendar2-check me-2 fs-5"></i> Make an
                    Appointment</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <div
        class="swiper-pagination vertical-pagination-bullets container"
      ></div>
    </swiper>
  </section>

  <div class="section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="section-title stagger">
            <h2>Seeing our Clinicians Quickly – Made Simple.</h2>
          </div>
        </div>
      </div>
      <div class="row gx-md-4 gx-lg-5 gy-4">
        <div class="col-12 col-md-6 col-lg-4 stagger">
          <div class="card card-1 bg-transparent">
            <div class="card-body">
              <div class="card-title">Counseling</div>
              <div class="card-text">
                <p>
                  Our psychologists, social workers, and therapists are trained
                  in the latest techniques for identifying, understanding and
                  treating a wide range of mental health and behavioral
                  conditions.
                </p>
              </div>
            </div>
            <div class="card-footer border-0 bg-transparent px-0 pt-0">
              <a href="/clinicians" class="btn btn-primary"
                ><i class="bi bi-calendar2-check"></i> Schedule</a
              >
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 stagger">
          <div class="card card-1 bg-transparent">
            <div class="card-body">
              <div class="card-title">Med Management</div>
              <div class="card-text">
                <p>
                  Our psychologists, social workers, and therapists are trained
                  in the latest techniques for identifying, understanding and
                  treating a wide range of mental health and behavioral
                  conditions.
                </p>
              </div>
            </div>
            <div class="card-footer border-0 bg-transparent px-0 pt-0">
              <a href="/clinicians" class="btn btn-primary"
                ><i class="bi bi-calendar2-check"></i> Schedule</a
              >
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 stagger">
          <div class="card card-1 bg-transparent">
            <div class="card-body">
              <div class="card-title">Psych Testing</div>
              <div class="card-text">
                <p>
                  Our psychologists, social workers, and therapists are trained
                  in the latest techniques for identifying, understanding and
                  treating a wide range of mental health and behavioral
                  conditions.
                </p>
              </div>
            </div>
            <div class="card-footer border-0 bg-transparent px-0 pt-0">
              <a href="/psych-testing" class="btn btn-primary"
                ><i class="icon-request"></i> Request An Evaluation</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section service-section animFade">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="section-title stagger">
            <h2>Our Services</h2>
          </div>
        </div>
        <div class="col-auto">
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
    <div class="container-fluid px-md-0 animFade">
      <div class="row gy-5">
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
                        @error="onServiceImageError"
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
                          <!-- <p>{{ service.sub_title }}</p> -->
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
        <div class="col-12 text-center stagger">
          <NuxtLink to="/services" class="btn btn-primary rounded-2"
            >View all Services <i class="icon-arrow-left-short ms-3 fs-6"></i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div class="section section-news">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="section-title stagger">
            <h2>Latest Blog</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="news-wrapper animFade">
        <div class="row">
          <div class="col-12">
            <Swiper
              class="swiper-news"
              :speed="800"
              :slides-per-view="3.3"
              :spaceBetween="30"
              :modules="[Pagination]"
              :pagination="{
                clickable: true,
                modifierClass: 'diamond-pagination-',
              }"
              :breakpoints="{
                0: {
                  slidesPerView: 1.2,
                  spaceBetween: 25,
                },
                768: {
                  slidesPerView: 2.2,
                },
                992: {},
              }"
            >
              <swiper-slide v-for="(blog, index) in blogs" :key="index">
                <NuxtLink
                  :to="{
                    name: 'blogs-name',
                    params: {
                      name: blog.slug,
                    },
                  }"
                  class="card card-news bg-transparent"
                >
                  <div class="card-img">
                    <img
                      :src="`${config.public.backendAssetUrl}${blog.image}`"
                      class="w-100"
                      :alt="blog.title"
                      @error="onBlogImageError"
                      v-if="blog.image"
                    />
                    <img
                      :src="noImgBlog"
                      class="w-100"
                      :alt="blog.title"
                      v-else
                    />
                  </div>
                  <div class="card-body">
                    <div class="card-title">
                      {{ blog.title }}
                    </div>
                    <div class="card-text">
                      <span>{{ formatDateInMDY(blog.created_at) }}</span>
                      <div>
                        <span
                          v-for="(category, catIndex) in blog.categories"
                          :key="catIndex"
                        >
                          <span
                            v-if="
                              category.category &&
                              catIndex <= blog.categories.length
                            "
                          >
                            {{ category.category.name }}
                            {{
                              catIndex < blog.categories.length - 1 ? ", " : ""
                            }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </swiper-slide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
