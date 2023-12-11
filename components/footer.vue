<script setup>
import Location from "@components/location.vue";

const props = defineProps({
  services: Array,
});
</script>

<template>
  <div class="pt-5">
    <Location />

    <footer class="footer-main">
      <div class="section animFade">
        <div class="container">
          <div class="row gy-4">
            <div class="col-12 col-md-6 col-xl-4">
              <div class="card-links">
                <div class="card-title">Site Map</div>
                <ul class="list-unstyled m-0">
                  <li>
                    <NuxtLink to="/our-story">Our Story</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="">For Clients</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/opportunities">Opportunities</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/referrals">Referrals</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/blogs">Blogs</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/news">News/Events</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/mental-health"
                      >Mental Health Resources</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink to="/clinicians?c=false">Our Clinicians</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/faq">FAQ</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/contact-us">Contact Us</NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-12 col-md-6 col-xl">
              <div class="card-links">
                <div class="card-title">Our Services</div>
                <ul class="list-unstyled m-0">
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
            </div>
            <div class="col-12 col-md-6 col-xl-auto">
              <ul
                class="btn-group gap-3 d-block d-lg-flex d-xl-block list-unstyled m-0"
              >
                <li>
                  <a href="javascript:" class="btn btn-secondary-light"
                    >Patient Portal <i class="icon-external-link"></i
                  ></a>
                </li>
                <li>
                  <a href="javascript:" class="btn btn-secondary"
                    >Online Payment <i class="icon-external-link"></i
                  ></a>
                </li>
                <li>
                  <NuxtLink
                    @click.prevent="goToUrl('/clinicians')"
                    class="btn btn-primary"
                    >Make an Appointment <i class="bi bi-calendar2-check"></i
                  ></NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright border-top py-4">
        <div class="container">
          <div class="row">
            <div class="col-12 text-center">
              <p>
                &copy; {{ new Date().getFullYear() }} Responsive Centers. All
                rights reserved.
                <br />
                <span class="fs-12"
                  >Powered by
                  <NuxtLink to="https://designthemes.com/" target="_blank"
                    >Designthemes.com</NuxtLink
                  >.</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  methods: {
    goToUrl(url) {
      window.location.href = url;
    },
  },
};
</script>
