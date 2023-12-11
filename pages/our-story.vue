<script setup>
import $ from "jquery";
import gsap from "gsap";

import innerHero from "assets/images/hero-our-story.jpg";
import aboutImg1 from "assets/images/about1.jpg";
import aboutImg2 from "assets/images/about2.jpg";
import noImg from "assets/images/no-img.jpg";

useSeoMeta({
  title: "Our Story",
  description:
    "Responsive Centers currently provides services to children, adolescents, adults, couples, families, and older adults in a caring and supportive environment.",
});

let counTAnimRevert = ref();
var teamData = ref([]);
var pageData = ref({});
const countAnim = () => {
  counTAnimRevert.value = gsap.context(() => {
    $(".card-number").each(function () {
      const $this = $(this);
      let countValue = { val: 0 };
      let tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: $this,
        },
      });
      tl.to(countValue, {
        duration: 1,
        val: $this.data("count"),
        onUpdate: () => {
          $this.find(".count").text(countValue.val.toFixed(0));
        },
      });
    });
  });
};

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();

const getTeams = () => {
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}page-data?type=our-story`, {
      transform: (res) => {
        pageData.value = res.data;
        nextTick(async () => {
          countAnim();
        })
        
      },
    });
    await useFetch(`${config.public.apiUrl}teams?active=true`, {
      transform: (res) => {
        teamData.value = res.data.data;
        nextTick(async () => {
          await animFade();
          await stagger();
        });

        return true;
      },
    });
  });
};

getTeams();

onMounted(() => {
  animFade();
  stagger();
  
});

onBeforeUnmount(() => {
  killAnimation();
  counTAnimRevert.value.revert();
});
const imageError = (event) => {
  event.target.src = aboutImg1;
};
const imageError2 = (event) => {
  event.target.src = aboutImg2;
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
          <h1 class="innsec-title mb-3 stagger">Our Story</h1>
          <div class="innsec-content stagger">
            <p>
              {{ pageData.sub_header }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="counter-section">
    <div class="container">
      <div class="row gx-0 nth-row">
        <div class="col-12 col-md-4">
          <div class="card-counter">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="card-number" :data-count="`${pageData.first_counter_value}`">
                  <span class="count">0</span>+
                </div>
              </div>
              <div class="col">
                <!-- <div class="card-text">
                  Years of <span class="d-md-block">Experience</span>
                </div> -->
                <div class="card-text">
                  {{pageData.first_counter_label}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card-counter">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="card-number" :data-count="`${pageData.second_counter_value}`">
                  <span class="count">0</span>+
                </div>
              </div>
              <div class="col">
                <!-- <div class="card-text">
                  Dedicated <span class="d-md-block">Clinicians</span>
                </div> -->
                <div class="card-text">
                  {{pageData.second_counter_label}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card-counter">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="card-number" :data-count="`${pageData.third_counter_value}`">
                  <span class="count">0</span>+
                </div>
              </div>
              <div class="col">
                <!-- <div class="card-text">
                  Clients <span class="d-md-block">Annually</span>
                </div> -->
                <div class="card-text">
                  {{pageData.third_counter_label}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section our-story-section">
    <div class="container">
      <div class="row g-5 justify-content-center align-items-center">
        <div class="col-12 col-lg-5">
          <div class="content-img">
            <div class="img-wrapper">
              <div class="img-square stagger">
                <img
                  :src="
                    !pageData.primary_image
                      ? aboutImg1
                      : `${config.public.backendAssetUrl}${pageData.primary_image}`
                  "
                  class="w-100"
                  @error="imageError"
                  alt="Images Name"
                />
              </div>
              <div class="img-circle stagger">
                <div class="inner">
                  <img
                    :src="
                      !pageData.secondary_image
                        ? aboutImg2
                        : `${config.public.backendAssetUrl}${pageData.secondary_image}`
                    "
                    class="w-100"
                    @error="imageError2"
                    alt="Images Name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-7">
          <div class="content fs-18 stagger">
            <div v-html="pageData.content"></div>
          </div>
        </div>
        <div class="col-12 col-lg-10 text-center stagger">
          <div
            class="content mt-4 fs-24 fw-bold ff-heading text-secondary-light"
          >
            <p>
              To this day, our clinicians are dedicated to helping clients reach
              their personal goals, solve difficult problems, and achieve a
              sense of mastery in their lives. <br />How can we walk with you on
              your journey?
            </p>
          </div>
        </div>
        <div class="col-12 text-center stagger">
          <a href="/clinicians" class="btn btn-primary rounded-3"
            ><i class="bi bi-calendar2-check me-2"></i> Make an Appointment</a
          >
        </div>
      </div>
    </div>
  </div>

  <div class="section" v-if="teamData.length">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="section-title stagger">
            <h2 class="mb-2">Leadership Team</h2>
            <div class="fs-18">Meet the faces behind our growing practice.</div>
          </div>
        </div>
      </div>
      <div class="row g-4">
        <div
          v-for="data in teamData"
          class="col-12 col-md-6 col-lg-4 col-xl-3 stagger"
        >
          <NuxtLink
            :to="{
              name: 'team-name',
              params: {
                name: data.slug,
              },
            }"
            class="card card-news card-team bg-transparent"
          >
            <div class="card-img">
              <img
                :src="
                  !data.image
                    ? noImg
                    : `${config.public.backendAssetUrl}${data.image}`
                "
                class="w-100"
                alt="Images Name"
              />
            </div>
            <div class="card-body px-1">
              <div class="card-title">{{ data.name }}</div>
              <div class="card-text">{{ data.designation }}</div>
            </div>
            <div class="card-footer bg-transparent border-0 p-0 pb-2">
              <div class="border-link fw-bold">Learn more</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
