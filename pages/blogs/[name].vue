<script setup>
//Components
import innerHero from "assets/images/hero-blog.jpg";
import noImgBlog from "assets/images/noimage-blog.jpg";
const config = useRuntimeConfig();
const { name } = useRoute().params;
var blog = ref({});
var categories = ref([]);
var recentBlogs = ref([]);

nextTick(async () => {
  await useFetch(`${config.public.apiUrl}blog/${name}`, {
    transform: (res) => {
      blog.value = res.data;
      return res.data;
    },
  });

  await useFetch(`${config.public.apiUrl}categories?type=blog&active=true`, {
    transform: (res) => {
      categories.value = res.data.data;
      return res.data.data;
    },
  });

  await useFetch(`${config.public.apiUrl}blogs?active=true&recent=true`, {
    transform: (res) => {
      recentBlogs.value = res.data.data;
      return res.data.data;
    },
  });

  useHead({
    title: blog.value ? blog.value.meta_title : "Responsive Centers for Psychology and Learning",
    meta: [
      {
        name: "description",
        content: blog.value ? blog.value.meta_description : "",
      },
    ],
  });
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

const goToBlog = async (slug) => {
  await navigateTo(`/blogs/${slug}`);
};

const { animFade, stagger, killAnimation } = useAnim();

onMounted(() => {
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});
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
          <h2 class="innsec-title mb-0 stagger">Blog</h2>
        </div>
      </div>
    </div>
  </section>

  <div class="section">
    <div class="container">
      <div class="row gy-5">
        <div class="col-12 col-xl-8 animFade">
          <div class="blog-left">
            <div class="text-secondary-light mb-3">
              {{ formatDateInMDY(blog.created_at) }} | {{ blog.categoryNames }}
            </div>
            <h1 class="title-1">
              {{ blog.title }}
            </h1>
            <div class="author">By {{ blog.author_name }}</div>

            <div class="blog-img my-4 my-md-5">
              <img
                :src="`${config.public.backendAssetUrl}${blog.image}`"
                @error="imageError"
                class="img-fluid"
                :alt="blog.title" v-if="blog.image"
              />
              <img :src="noImgBlog" class="img-fluid" :alt="blog.title" v-else />
            </div>

            <div class="content fs-16 mb-5">
              <div v-html="blog.description"></div>
            </div>

            <NuxtLink
              to="javascript:void()"
              @click="$router.back()"
              class="btn btn-primary rounded-pill min-w-114 ff-heading"
              >Back</NuxtLink
            >
          </div>
        </div>
        <div class="col-12 col-xl-4">
          <div class="blog-right-sidebar">
            <div class="row gy-4">
              <div class="col-12 stagger">
                <div class="card card-recent-post bg-transparent">
                  <div class="card-body">
                    <div class="card-title">Recent Posts</div>
                    <div
                      class="card-list"
                      v-for="(recentBlog, index) in recentBlogs"
                      :key="index"
                    >
                      <div class="row gx-3" @click="goToBlog(recentBlog.slug)">
                        <div class="col-auto">
                          <div class="card-img">
                            <img
                              :src="`${config.public.backendAssetUrl}${recentBlog.image}`"
                              class="w-100"
                              alt=""
                              @error="imageError" v-if="recentBlog.image"
                            />
                            <img :src="noImgBlog" class="w-100" :alt="recentBlog.title" v-else />
                          </div>
                        </div>
                        <div class="col">
                          <div class="inner-title">
                            {{ recentBlog.title }}
                          </div>
                          <div class="fs-11">
                            By {{ recentBlog.author_name }} |
                            {{ formatDateInMDY(recentBlog.created_at) }} <br />
                            <span
                              v-for="(
                                category, catIndex
                              ) in recentBlog.categories"
                              :key="catIndex"
                            >
                              <span
                                v-if="
                                  category.category &&
                                  catIndex <= recentBlog.categories.length
                                "
                              >
                                {{ category.category.name }}
                                {{
                                  catIndex < recentBlog.categories.length - 1
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
                        <li class="category-list"
                          v-for="(category, index) in categories"
                          :key="index" @click="navigateTo(`/blogs?category=${category.name}`)"
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
.card-list {
  cursor: pointer;
}
.category-list {
  cursor: pointer;
}
</style>