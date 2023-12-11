<script setup>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  
  gsap.registerPlugin(ScrollTrigger);

  //Components
  import Header from '@components/header.vue';
  import Footer from '@components/footer.vue';

  const nuxtApp = useNuxtApp();
  nuxtApp.hook("page:start", () => {
  });

  const config = useRuntimeConfig();
  var services = ref([]);

  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}services?active=true`, {
      transform: (res) => {
        services.value = res.data.data;
        return true;
      },
    });
  });

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator/>
      <Header :services="services" />
      <main>
        <NuxtPage/>
      </main>
      <Footer :services="services" />
    </NuxtLayout>
  </div>
</template>
