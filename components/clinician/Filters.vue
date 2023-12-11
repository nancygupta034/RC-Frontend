<script setup>
const emit = defineEmits(["getClinicians"]);
const config = useRuntimeConfig();
const states = ref([]);
const ageRanges = ref([]);
const servicesProvided = ref([]);
const specialities = ref([]);
nextTick(async () => {
  await useFetch(`${config.public.apiUrl}states?active=true`, {
    transform: (res) => {
      states.value = res.data;
    },
  });
  await useFetch(`${config.public.apiUrl}age-ranges`, {
    transform: (res) => {
      ageRanges.value = res.data.data;
    },
  });
  await useFetch(`${config.public.apiUrl}services-provided`, {
    transform: (res) => {
      servicesProvided.value = res.data.data;
    },
  });
  await useFetch(`${config.public.apiUrl}specialities`, {
    transform: (res) => {
      specialities.value = res.data.data;
    },
  });
});
</script>
<template>
  <div class="form-wrapper">
    <div class="form-black form-appo stagger">
      <form>
        <div class="row gx-3 gy-4">
          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select
                  class="form-select"
                  v-model="location"
                  :class="{ 'has-error': displayLocationError }"
                >
                  <option value="" disabled selected>Please select</option>
                  <option value="2010">Center Visit</option>
                  <option value="2047">Tele Consultation</option>
                </select>
                <label for="">Location<span>*</span></label>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select
                  class="form-select"
                  v-model="isInsurance"
                  :class="{ 'has-error': displayInsuranceError }"
                >
                  <option value="" disabled selected>Please select</option>
                  <option value="insurance">Insurance</option>
                  <option value="self-pay">Self Pay</option>
                </select>
                <label for="">Insurance / Self-Pay<span>*</span></label>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select class="form-select" v-model="state">
                  <option value="" selected>Please select</option>
                  <option
                    :value="state.id"
                    v-for="(state, index) in states"
                    :key="index"
                  >
                    {{ state.name }}
                  </option>
                </select>
                <label for="">Your State</label>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select class="form-select" v-model="serviceProvided">
                  <option value="" selected>Please select</option>
                  <option
                    :value="service.id"
                    v-for="(service, index) in servicesProvided"
                    :key="index"
                  >
                    {{ service.name }}
                  </option>
                </select>
                <label for="">Services Provided</label>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select class="form-select" v-model="ageRange">
                  <option value="" selected>Please select</option>
                  <option
                    :value="ageRange.id"
                    v-for="(ageRange, index) in ageRanges"
                    :key="index"
                  >
                    {{ ageRange.text }}
                  </option>
                </select>
                <label for="">Age Ranges</label>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 col-xl">
            <div class="form-group">
              <div class="label-wrap">
                <select class="form-select" v-model="speciality">
                  <option value="" selected>Please select</option>
                  <option
                    :value="speciality.id"
                    v-for="(speciality, index) in specialities"
                    :key="index"
                  >
                    {{ speciality.name }}
                  </option>
                </select>
                <label for="">Specialities</label>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 col-xl-auto">
            <div class="form-group h-100">
              <button
                @click.prevent="updateFilter"
                class="btn btn-primary btn-search"
              >
                <i class="bi bi-search"></i> <span class="fBtn">Search</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      state: "",
      location: "",
      ageRange: "",
      speciality: "",
      serviceProvided: "",
      isInsurance: "",
      displayLocationError: false,
      displayInsuranceError: false,
    };
  },
  methods: {
    updateFilter() {
      this.displayLocationError = this.location == "" ? true : false;
      this.displayInsuranceError = this.isInsurance == "" ? true : false;

      if (this.location != "" && this.isInsurance != "") {
        if (process.client) {
          localStorage.setItem("state", this.state);
          localStorage.setItem("speciality", this.speciality);
          localStorage.setItem("ageRange", this.ageRange);
          localStorage.setItem("serviceProvided", this.serviceProvided);
          localStorage.setItem("isInsurance", this.isInsurance);
          localStorage.setItem("location", this.location);
        }
        this.$emit("getClinicians");
      }
    },
  },
  mounted() {
    if (process.client) {
      this.location = localStorage.getItem("location");
      this.isInsurance = localStorage.getItem("isInsurance");
      this.ageRange = localStorage.getItem("ageRange");
      this.speciality = localStorage.getItem("speciality");
      this.serviceProvided = localStorage.getItem("serviceProvided");
      this.state = localStorage.getItem("state");
    }
  },
};
</script>
<style scoped>
.error.invalid-feedback {
  display: block;
}
</style>
