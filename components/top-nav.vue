<template>
  <div class="top-nav text-end">
    <ul class="list-unstyled m-0">
      <li>
        <NuxtLink class="btn-appo" @click.prevent="goToUrl('/clinicians')"
          >Make an Appointment <i class="bi bi-calendar2-check"></i
        ></NuxtLink>
      </li>
      <li class="fa fa-life-bouy" aria-hidden="true">
        <a class="btn-patient" href=""
          >Patient Portal <i class="icon-external-link"></i
        ></a>
      </li>
      <li>
        <a class="btn-ext" href="/appointments/check"
          >Manage Appointments <i class="icon-external-link"></i
        ></a>
      </li>
      <!-- <li>
        <a class="btn-ext" href=""
          >Online Payment <i class="icon-external-link"></i
        ></a>
      </li> -->
    </ul>
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
