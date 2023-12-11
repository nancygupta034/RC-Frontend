<script setup>
import noImg from "assets/images/no-img.jpg";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const route = useRoute();
const { name } = useRoute().params;

const teamData = ref({});
nextTick(async () => {
  await useFetch(`${config.public.apiUrl}team/${name}`, {
    transform: (res) => {
      teamData.value = res.data;
      return res.data;
    },
  });
  useHead({
    title: teamData.value
      ? teamData.value.meta_title
      : "Responsive Centers for Psychology and Learning",
    meta: [
      {
        name: "description",
        content: teamData.value ? teamData.value.meta_description : "",
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
  event.target.src = noImg;
};
</script>
<template>
  <section class="section team-section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card card-start bg-transparent border-0">
            <div class="row gy-4 gx-5">
              <div class="col-12 col-md-auto stagger">
                <div class="card-img">
                  <img
                    :src="`${
                      !teamData.image ? noImg : `${config.public.backendAssetUrl}${teamData.image}`
                    }`"
                    @error="imageError"
                    class="w-100"
                    alt="Image Name"
                  />
                </div>
              </div>
              <div class="col-12 col-lg stagger">
                <div class="card-body px-0 mb-4">
                  <div
                    class="card-title fs-30 ff-heading fw-bold text-secondary"
                  >
                    {{ teamData.name }}
                  </div>
                  <div class="card-des fs-21">{{ teamData.designation }}</div>

                  <div class="card-info fs-16 mt-4">
                    <NuxtLink :to="`mailto:${teamData.email}`" target="_blank">
                      <i class="bi bi-envelope me-2"></i> {{ teamData.email }}
                    </NuxtLink>
                    <br />
                  </div>

                  <div
                    class="card-text fs-16 mt-4"
                    v-html="teamData.description"
                  ></div>
                </div>
                <NuxtLink
                  to="javascript:void()"
                  @click="$router.back()"
                  class="btn btn-primary rounded-pill min-w-114 ff-heading"
                  >Back</NuxtLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
