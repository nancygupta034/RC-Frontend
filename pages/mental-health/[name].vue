<script setup>
import { EffectFade, Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
//Components
import innerHero from "assets/images/hero-blog.jpg";
import noImgBlog from "assets/images/noimage-blog.jpg";
import video from "assets/images/video.svg";
import page from "assets/images/page.svg";
import extUrl from "assets/images/external-url.svg";
import attachment from "assets/images/attachment.svg";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const { name } = useRoute().params;
var report = ref({});
var categories = ref([]);
var recentReports = ref([]);
const goToMentalHealth = async (slug) => {
  await navigateTo(`/mental-health/${slug}`);
};
nextTick(async () => {
  await useFetch(`${config.public.apiUrl}mental-health-data/${name}`, {
    transform: (res) => {
      report.value = res.data;
      return res.data;
    },
  });

  await useFetch(
    `${config.public.apiUrl}categories?type=mental-health&active=true`,
    {
      transform: (res) => {
        categories.value = res.data.data;
        return res.data.data;
      },
    }
  );

  await useFetch(
    `${config.public.apiUrl}mental-health?active=true&recent=true`,
    {
      transform: (res) => {
        recentReports.value = res.data.data;
        return res.data.data;
      },
    }
  );
});
onMounted(() => {
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});

const getYouTubeVideoId = (videoUrl) => {
  // Regular expression to match YouTube video IDs
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  // Try to match the regex with the video URL
  const match = videoUrl.match(regex);

  if (match && match[1]) {
    // match[1] contains the YouTube video ID
    return match[1];
  } else {
    // Invalid or unrecognized YouTube video URL
    return null;
  }
};
const imageError = (event) => {
  event.target.src = noImgBlog;
};
</script>
<template>
  <section
    class="section blog-section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">Mental Health</h1>
        </div>
      </div>
    </div>
  </section>

  <div class="section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-xl-8 animFade">
          <div class="text-secondary-light mb-3">
            {{ report.categoryNames }}
          </div>
          <h1 class="title-1">{{ report.title }}</h1>

          <!-- YouTube Embed -->
          <div
            class="ratio ratio-16x9 my-4"
            v-if="
              report.type == 'youtube-link' && report.youtube_link !== undefined
            "
          >
            <iframe
              :src="`https://www.youtube.com/embed/${getYouTubeVideoId(
                report.youtube_link
              )}`"
              allowfullscreen
            ></iframe>
          </div>
          <!-- YouTube Embed Ends-->

          <!-- MP4 Embed-->
          <div class="video-container my-4" v-if="report.type == 'video'">
            <video class="video" width="320" height="240" controls>
              <source :src="`${config.public.backendAssetUrl}${report.video}`" type="video/mp4" />
            </video>
          </div>
          <!-- MP4 Embed Ends -->

          <!-- Image Gallery-->
          <div
            class="gallery-container position-relative my-4"
            v-if="report.type == 'image'"
          >
            <swiper
              :speed="800"
              :loop="true"
              :slides-per-view="1"
              :modules="[EffectFade, Pagination, Autoplay, Navigation]"
              effect="fade"
              :pagination="{ el: '.swiper-pagination', clickable: true }"
              :autoplay="{ delay: 5000, disableOnInteraction: false }"
              :navigation="{
                nextEl: '.gallery-container .nav-next',
                prevEl: '.gallery-container .nav-prev',
              }"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
            >
              <swiper-slide class="mhSlideBox"
                v-for="(image, index) in report.images"
                :key="index"
              >
                <div class="imgBox">
                  <img :src="`${config.public.backendAssetUrl}${image.image}`" alt="" />
                </div>
              </swiper-slide>
            </swiper>

            <div
              class="swiper-pagination vertical-pagination-bullets container"
            ></div>
            <div class="swiper-nav nav-prev">
              <i class="icon-arrow-left"></i>
            </div>
            <div class="swiper-nav nav-next">
              <i class="icon-arrow-right"></i>
            </div>
          </div>
          <!-- Image Gallery Ends -->

          <!-- Text Box -->
          <div class="contentBox my-4">
            <div v-html="report.description"></div>
          </div>
          <!-- Text Ends -->
          <div class="contentBox my-4" v-if="report.type == 'external-link'">
            <a
              :href="report.external_link"
              target="_blank"
              class="external-link"
              >{{ report.external_link }}</a
            >
          </div>
          <div class="contentBox my-4" v-if="report.type == 'file'">
            <a :href="`${config.public.backendAssetUrl}${report.file}`" download="" class="external-link"
              >Clink here to download file</a
            >
          </div>
        </div>
        <div class="col-12 col-xl-4">
          <div class="blog-right-sidebar">
            <div class="row gy-4">
              <div class="col-12 stagger">
                <div class="card card-recent-post card-mh1 bg-transparent">
                  <div class="card-body">
                    <div class="card-title">Recent Posts</div>

                    <div
                      class="card-list"
                      v-for="(recentReport, index) in recentReports"
                      :key="index"
                    >
                      <div
                        class="row gx-3"
                        @click="goToMentalHealth(recentReport.slug)"
                      >
                        <div class="col-auto">
                          <div class="typeIcon">
                            <img
                              :src="page"
                              v-if="recentReport.type == 'image'"
                            />
                            <img
                              :src="video"
                              v-if="
                                recentReport.type == 'youtube-link' ||
                                recentReport.type == 'video'
                              "
                            />
                            <img
                              :src="extUrl"
                              v-if="recentReport.type == 'external-link'"
                            />
                            <img
                              :src="attachment"
                              v-if="recentReport.type == 'file'"
                            />
                          </div>
                        </div>
                        <div class="col">
                          <div class="inner-title">
                            {{ recentReport.title }}
                          </div>
                          <div class="fs-11">
                            <span
                              v-for="(
                                category, catIndex
                              ) in recentReport.categories"
                              :key="catIndex"
                            >
                              <span
                                v-if="
                                  category.category &&
                                  catIndex <= recentReport.categories.length
                                "
                              >
                                {{ category.category.name }}
                                {{
                                  catIndex < recentReport.categories.length - 1
                                    ? ", "
                                    : ""
                                }}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 stagger">
                <div class="card bg-secondary-light text-white border-0">
                  <div class="card-body">
                    <div class="card-title">Categories</div>
                    <div class="card-text content fs-16">
                      <ul class="card-ul">
                        <li
                          class="category-list"
                          v-for="(category, index) in categories"
                          :key="index"
                          @click="
                            navigateTo(
                              `/mental-health?category=${category.name}`
                            )
                          "
                        >
                          {{ category.name }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
a.external-link {
  text-decoration: none;
  color: #154768;
  font-size: 1rem;
  font-weight: 700;
  font-family: "Lora", serif;
}
.card-list {
  cursor: pointer;
}
.category-list {
  cursor: pointer;
}
</style>
