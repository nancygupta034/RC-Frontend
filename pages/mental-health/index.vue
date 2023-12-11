<script setup>
//Components
import innerHero from "assets/images/hero-blog.jpg";
import video from "assets/images/video.svg";
import page from "assets/images/page.svg";
import extUrl from "assets/images/external-url.svg";
import attachment from "assets/images/attachment.svg";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
var reports = ref([]);
var take = ref(10);
var searchVal = ref();
var selectVal = ref("");
var totalRecords = ref(0);
var categories = ref([]);
var selectedCategory = ref(useRoute().query.category);

const getReports = (takeValue = 10, category, searchedKey) => {
  selectedCategory.value = category;
  const selCat = selectedCategory.value;
  if (selCat != undefined && selCat != null && selCat != "") {
    selectVal.value = selCat;
  }
  take.value = takeValue;
  nextTick(async () => {
    await useFetch(
      `${config.public.apiUrl}mental-health?active=true${
        selCat != undefined && selCat != null && selCat != ""
          ? "&category=" + selCat
          : ""
      }&take=${take.value}${
        searchedKey != undefined && searchedKey != null && searchedKey != ""
          ? "&search=" + searchedKey
          : ""
      }`,
      {
        transform: (res) => {
          reports.value = res.data.data;
          totalRecords.value = res.data.totalRecords;
          nextTick(async () => {
            await animFade();
            await stagger();
          });

          return true;
        },
      }
    );
  });
};

nextTick(async () => {
  await useFetch(
    `${config.public.apiUrl}categories?type=mental-health&active=true`,
    {
      transform: (res) => {
        categories.value = res.data.data;
        if (
          useRoute().query.category != undefined &&
          useRoute().query.category != null &&
          useRoute().query.category != ""
        ) {
          selectVal.value = selCat;
        }

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

const formatCategories = (categories) => {
  let catArray = [];
  categories.forEach((element) => {
    catArray.push(element.category.name);
  });

  return catArray.join(" | ");
};

const frmSearch = () => {};
getReports(10, useRoute().query.category, searchVal.value);
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

  <!-- <reportsearch /> -->
  <div class="search-section">
    <div class="container">
      <div class="search-wrapper">
        <form action="" class="h-100" @submit.prevent="frmSearch">
          <div class="row h-100">
            <div class="col-12 col-md-4 border-end">
              <select
                v-model="selectVal"
                name=""
                id=""
                class="form-select arrow-black"
                @change="getReports(10, selectVal, searchVal)"
              >
                <option value="">Select Category</option>
                <option
                  :value="category.name"
                  v-for="(category, index) in categories"
                  :key="index"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md">
              <div class="input-group h-100">
                <input
                  v-model="searchVal"
                  type="text"
                  class="form-control"
                  @input="getReports(10, selectVal, searchVal)"
                  placeholder="Search by Keyword or Title ..."
                />
                <button type="submit" class="input-group-text">
                  <i class="bi bi-search fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="container">
      <div class="row">
        <div
          class="col-12"
          v-for="(report, index) in reports"
          :key="index"
          v-if="reports.length"
        >
          <NuxtLink :to="`/mental-health/${report.slug}`" class="card card-mh">
            <div class="row">
              <div class="col-auto">
                <div class="typeIcon">
                  <img
                    :src="video"
                    v-if="
                      report.type == 'video' || report.type == 'youtube-link'
                    "
                  />
                  <img :src="attachment" v-if="report.type == 'file'" />
                  <img :src="extUrl" v-if="report.type == 'external-link'" />
                  <img :src="page" v-if="report.type == 'image'" />
                </div>
              </div>
              <div class="col align-self-center">
                <h6>{{ formatCategories(report.categories) }}</h6>
                <h2>{{ report.title }}</h2>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="row pt-5" v-if="totalRecords > reports.length">
        <div class="col-12 text-center">
          <button
            class="btn btn-primary btn-load-more rounded-pill"
            @click.prevent="getReports(take + 10, selectedCategory, searchVal)"
          >
            Load more
            <span class="arrow"><i class="bi bi-arrow-down"></i></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
