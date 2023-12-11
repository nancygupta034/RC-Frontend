<script setup>
//Components
import innerHero from "assets/images/hero-blog.jpg";
import noImgBlog from "assets/images/noimage-blog.jpg";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
var news = ref([]);
var take = ref(10);
var searchVal = ref();
var selectVal = ref("");
var categories = ref([]);
var totalRecords = ref(0);
var selectedCategory = ref(useRoute().query.category);

const getNews = (takeValue = 10, category, searchedKey) => {
  selectedCategory.value = category;
  const selCat = selectedCategory.value;
  if (selCat != undefined && selCat != null && selCat != "") {
    selectVal.value = selCat;
  }
  take.value = takeValue;
  nextTick(async () => {
    await useFetch(
      `${config.public.apiUrl}news?active=true${
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
          news.value = res.data.data;
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
  await useFetch(`${config.public.apiUrl}categories?type=news&active=true`, {
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
  });
});

onMounted(() => {
  animFade();
  stagger();
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
const imageError = (event) => {
  event.target.src = noImgBlog;
};

const frmSearch = () => {};
getNews(10, useRoute().query.category, searchVal.value);
</script>
<template>
  <section
    class="section blog-section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">News/Events</h1>
        </div>
      </div>
    </div>
  </section>

  <!-- <BlogSearch /> -->
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
                @change="getNews(10, selectVal, searchVal)"
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
                  @input="getNews(10, selectVal, searchVal)"
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
      <div class="row g-4">
        <div
          class="col-12 col-md-6 stagger"
          :class="index > 1 ? 'col-lg-4 col-xl-3' : ''"
          v-for="(newsData, index) in news"
          :key="index"
          v-if="news.length"
        >
          <NuxtLink
            :to="{
              name: 'news-name',
              params: {
                name: newsData.slug,
              },
            }"
            class="card card-news bg-transparent"
          >
            <div class="card-img">
              <img
                :src="`${config.public.backendAssetUrl}${newsData.image}`"
                class="w-100"
                alt="Images Name"
                @error="imageError"
                v-if="newsData.image"
              />
              <img
                :src="noImgBlog"
                class="w-100"
                :alt="newsData.title"
                v-else
              />
            </div>
            <div class="card-body">
              <div class="card-title">
                {{ newsData.title }}
              </div>
              <div class="card-text">
                <span>{{ formatDateInMDY(newsData.date) }}</span>
                <div>
                  <span
                    v-for="(category, catIndex) in newsData.categories"
                    :key="catIndex"
                  >
                    <span
                      v-if="
                        category.category &&
                        catIndex <= newsData.categories.length
                      "
                    >
                      {{ category.category.name }}
                      {{
                        catIndex < newsData.categories.length - 1 ? ", " : ""
                      }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div class="col-12 text-center" v-else>
          <h1 class="title-1 text-secondary">No records found</h1>
        </div>
      </div>
      <div class="row pt-5" v-if="news.length && totalRecords > news.length">
        <div class="col-12 text-center">
          <button
            class="btn btn-primary btn-load-more rounded-pill"
            @click.prevent="getNews(take + 10, selectedCategory, searchVal)"
          >
            Load more
            <span class="arrow"><i class="bi bi-arrow-down"></i></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
