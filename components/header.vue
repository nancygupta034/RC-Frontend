<script setup>
import $ from "jquery";
import logo from "assets/images/logo.png";

//Components
import Topnav from "@components/top-nav.vue";

const { headerToggle } = useAnim();

const props = defineProps({
  services: Array,
});

const menuToggle = () => {
  $(".hamburger").toggleClass("h-active");
  $("body").toggleClass("menu-active");
};

onMounted(() => {
  headerToggle();
});
</script>

<script>
export default {
  watch: {
    $route: {
      handler(to, from) {
        if (to) {
          $(".hamburger").removeClass("h-active");
          $("body").removeClass("menu-active");
        }
      },
      deep: true,
    },
  },
};
</script>

<template>
  <header class="header-main">
    <div class="container">
      <div class="row">
        <div class="col-auto align-self-center pe-xxl-5">
          <NuxtLink to="/" class="logo">
            <img :src="logo" alt="" />
          </NuxtLink>
        </div>
        <div class="col align-self-center">
          <a
            @click="menuToggle"
            id="b1"
            href="javascript:void(0)"
            class="hm float-end d-xl-none"
          >
            <div class="hamburger">
              <span class="h-top"></span>
              <span class="h-middle"></span>
              <span class="h-bottom"></span>
            </div>
          </a>

          <Topnav class="d-none d-xl-block" />

          <nav class="main-nav d-flex justify-content-xl-end">
            <ul
              class="nav list-unstyled m-0 justify-content-end align-items-center"
            >
              <li class="d-xl-none">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/our-story">Our Story</NuxtLink>
              </li>
              <li>
                <NuxtLink>For Clients</NuxtLink>
                <div class="submenu">
                  <ul>
                    <li>
                      <NuxtLink to="/new-clients">New Clients</NuxtLink>
                    </li>
                    <li>
                      <NuxtLink>Returning Clients</NuxtLink>
                    </li>
                    <li>
                      <NuxtLink>myHealthspot Resources</NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        to="https://app.myhealthspot.com/login"
                        target="_blank"
                        >Access myHealthspot</NuxtLink
                      >
                    </li>
                    <li>
                      <NuxtLink>Make a Payment</NuxtLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <NuxtLink to="/services">Services</NuxtLink>
                <div class="submenu">
                  <ul>
                    <li v-for="(service, index) in services" :key="index">
                      <NuxtLink
                        :to="{
                          name: 'services-name',
                          params: { name: service.slug },
                        }"
                        >{{ service.title }}</NuxtLink
                      >
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <NuxtLink to="/opportunities">Opportunities</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/referrals">Referrals</NuxtLink>
              </li>
            </ul>

            <Topnav class="pt-4 menu-btn d-xl-none" />
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
