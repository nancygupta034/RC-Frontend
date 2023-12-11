<script setup>
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from 'vue';
import $ from "jquery";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import AppointmentForm from "@components/clinician/Filters.vue";
import noImg from "assets/images/no-img.jpg";

const { animFade, stagger, killAnimation } = useAnim();
const fancyBoxInstnace = ref({});
const refFancyApp = ref();
const myDiv = ref(null);
const myDiv2 = ref(null);
const myDiv3 = ref(null);
const myDiv4 = ref(null);
const route = useRoute();
const showPopup = ref(route.query.c);
const isRefAppointment = ref(route.query.ref);
const displayLoader = ref(false);
const config = useRuntimeConfig();
const clinicians = ref([]);
const totalClinicians = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const displayErr = ref(false);
const errorMsg = ref("");
const selectedLocation = ref("");
const selectedPaymentMode = ref("");
const selectedDate = ref("");
const displaySteps = ref(false);
const displayPopup = ref(true);
const datesArr = ref([]);
const displayCloseBtn = ref(true);
const displayVisitMode = ref(true);

const getClinicians = (skip = 0, page = 1, date = selectedDate.value) => {
  currentPage.value = page;
  displayLoader.value = true;
  if (process.client) {
    const state = localStorage.getItem("state");
    const speciality = localStorage.getItem("speciality");
    const ageRange = localStorage.getItem("ageRange");
    const serviceProvided = localStorage.getItem("serviceProvided");
    const isInsurance = localStorage.getItem("isInsurance");
    localStorage.setItem("date", date);
    selectedDate.value = date;
    const location = localStorage.getItem("location");
    nextTick(async () => {
      await useFetch(
        `${config.public.apiUrl}clinicians?state=${state}&services-provided=${serviceProvided}&age-range=${ageRange}&speciality=${speciality}&location=${location}&isInsurance=${isInsurance}&date=${date}&skip=${skip}&take=10`,
        {
          transform: (response) => {
            clinicians.value = response.data.data;
            totalClinicians.value = response.data.totalRecords;
            totalPages.value =
              response.data.totalRecords > 10
                ? Math.ceil(response.data.totalRecords / 10)
                : 1;
            displaySteps.value = false;
            displayErr.value = !response.data.data.length ? true : false;
            errorMsg.value = !response.data.data.length
              ? "No record found."
              : "";
            $(window).scrollTop(0);
            displayLoader.value = false;
            killAnimation();

            nextTick(async () => {
              await animFade();
              await stagger();
            });
          },
        }
      );
    });
  }
};

const getDatesArray = () => {
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + 3);

  const dates = [];
  let currentDateCopy = new Date(currentDate);
  const finalDate1 = currentDateCopy.toISOString().slice(0, 10);
  selectedDate.value = finalDate1;
  while (currentDateCopy <= endDate) {
    const finalDate = currentDateCopy.toISOString().slice(0, 10);
    const date = new Date(finalDate);
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
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    dates.push({
      date: date.getDate(),
      formattedDate: finalDate,
      month: months[date.getMonth()],
      year: date.getFullYear(),
      day: days[date.getDay()],
      isDisabled: ((days[date.getDay()] == 'Sun' || days[date.getDay()] == 'Sat') ? true : false)
    });
    currentDateCopy.setDate(currentDateCopy.getDate() + 1);
  }

  datesArr.value = dates;
};

onMounted(() => {
  animFade();
  stagger();
  if (process.client) {
    if(isRefAppointment.value == "1") {
      localStorage.setItem("isRefAppointment", true);
    } else {
      localStorage.setItem("isRefAppointment", false);
    }
  }
  
  if (showPopup.value !== "false") {
    fancyBoxInstnace.value = new Fancybox(
      [
        {
          src: refFancyApp.value,
          type: "html",
        },
      ],
      {
        autoFocus: false,
        closeButton: false,
        backdropClick: false,
      }
    );
  }

  if (showPopup.value == "false") {
    getClinicians()
  }

  getDatesArray();

  localStorage.setItem("state", "");
  localStorage.setItem("reference_id", "");
  localStorage.setItem("paymentMode", "");
  localStorage.setItem("date", "");
  localStorage.setItem("speciality", "");
  localStorage.setItem("ageRange", "");
  localStorage.setItem("serviceProvided", "");
  localStorage.setItem("isInsurance", "");
  // localStorage.setItem("location", 2047);
  localStorage.setItem("location", "");
  localStorage.setItem("patientDetails", "");
  localStorage.setItem("selected-slot", "");
});

onBeforeUnmount(() => {
  killAnimation();
});
const updateLocation = (locationId) => {
  selectedLocation.value = locationId;
}
const getLocation = () => {
  if (process.client) {
    const isInsurance = localStorage.getItem("isInsurance");
    const location = localStorage.getItem("location");
    const selectedSlot = localStorage.getItem("selected-slot");
    if (
      (isInsurance == "" ||
        isInsurance == null ||
        isInsurance == "null" ||
        isInsurance == undefined ||
        location == "" ||
        location == null ||
        location == "null" ||
        location == undefined) &&
      (selectedSlot == "" || selectedSlot == null || selectedSlot == "null")
    ) {
      localStorage.setItem("location", selectedLocation.value);
      localStorage.setItem("paymentMode", selectedPaymentMode.value);
      localStorage.setItem("isInsurance", selectedPaymentMode.value);
      getClinicians();
      displayPopup.value = false;
      Fancybox.close();
    } else {
      localStorage.setItem("location", selectedLocation.value);
      localStorage.setItem("paymentMode", selectedPaymentMode.value);
      localStorage.setItem("isInsurance", selectedPaymentMode.value);
      window.location.href = `/check-user`;
      // this.$router.push({ path: `/check-user` });
    }
  }
};


const bookNow = (slot, clinician, locationId) => {
  if (process.client) {
    const isInsurance = localStorage.getItem("isInsurance");
    const location = locationId;
    localStorage.setItem("location", locationId);
    displayVisitMode.value = false;
    selectedLocation.value = locationId;
    const patientData = {
      date: slot.formatted_date,
      time: slot.start_time,
      endTime: slot.end_time,
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      home_phone: "",
      mobile_number: "",
      tru_billing_id: clinician.tru_billing_id,
      service_id: localStorage.getItem("serviceProvided"),
      clinician_id: clinician.id,
      practitioner_id: clinician.azalea_id,
      payment_mode: "",
      selectedSlot: slot.id,
      practitioner_name: clinician.name,
      appointmentType: slot.appointmentType,
      start_date_time: slot.start_date_time,
      end_date_time: slot.end_date_time,
    };
    localStorage.setItem("patientDetails", JSON.stringify(patientData));
    localStorage.setItem("selected-slot", slot.id);
    localStorage.setItem("location", location);
    if(clinician.is_insurance == 0) {
      localStorage.setItem("isInsurance", "self-pay");
      window.location.href = `/check-user`;
      return true;
    }
    if (
      isInsurance == "" ||
      isInsurance == null ||
      isInsurance == "null" ||
      isInsurance == undefined ||
      location == "" ||
      location == null ||
      location == "null" ||
      location == undefined
    ) {
      fancyBoxInstnace.value = new Fancybox(
        [
          {
            src: refFancyApp.value,
            type: "html",
          },
        ],
        {
          autoFocus: false,
          closeButton: false,
          backdropClick: false,
        }
      );
      displayCloseBtn.value = false;
    } else {
      window.location.href = `/check-user`;
    }
  }
};

const imageError = (event) => {
  event.target.src = noImg;
};
</script>

<template>
  <div class="loader" v-if="displayLoader" @scroll.prevent>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin: auto; background: #fff; display: block"
      width="91px"
      height="91px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        r="32"
        stroke-width="8"
        stroke="#0a0a0a"
        stroke-dasharray="50.26548245743669 50.26548245743669"
        fill="none"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.2048192771084336s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  </div>
  <div v-if="showPopup !== 'false'">
    <div ref="refFancyApp" class="userPop" style="display: none">
      <button
        data-fancybox-close=""
        class="f-button is-close-btn"
        title="Close"
        @click="getClinicians()"
        v-if="displayCloseBtn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          tabindex="-1"
        >
          <path d="M20 20L4 4m16 0L4 20"></path>
        </svg>
      </button>
      <div class="row g-3 mb-4" v-if="displayVisitMode">
        <div class="col-12 mt-5">
          <h2><b>How would you like to consult?</b></h2>
        </div>
        <div class="col-12 col-sm-6" ref="myDiv3" @click="updateLocation(2010)">
          <div class="radioBox">
            <input type="radio" name="location" id="cvisit" />
            <label for="cvisit">
              <div class="row align-items-center py-2 g-2">
                <div class="col-auto"><span class="radioButton"></span></div>
                <div class="col">Center Visit</div>
                <div class="col-auto"><i class="icon-center"></i></div>
              </div>
            </label>
          </div>
        </div>
        <div class="col-12 col-sm-6 align-self-end" ref="myDiv4" @click="updateLocation(2047)">
          <div class="radioBox">
            <input type="radio" name="location" id="tele" />
            <label for="tele">
              <div class="row align-items-center py-2 g-2">
                <div class="col-auto"><span class="radioButton"></span></div>
                <div class="col">Tele Consultation</div>
                <div class="col-auto"><i class="icon-telephone"></i></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 mt-4">
          <h2><b>Select Payment Method</b></h2>
        </div>
        <div class="col-12 col-sm-6">
          <div class="radioBox" ref="myDiv" @click="selectedPaymentMode = 'insurance'">
            <input type="radio" name="payment" id="insurance" />
            <label for="insurance">
              <div class="row align-items-center py-2 g-2">
                <div class="col-auto"><span class="radioButton"></span></div>
                <div class="col">Insurance</div>
                <div class="col-auto"><i class="icon-insurance"></i></div>
              </div>
            </label>
          </div>
        </div>
        <div class="col-12 col-sm-6 align-self-end">
          <div class="radioBox" ref="myDiv2" @click="selectedPaymentMode = 'self-pay'">
            <input type="radio" name="payment" id="self-pay" />
            <label for="self-pay">
              <div class="row align-items-center py-2 g-2">
                <div class="col-auto"><span class="radioButton"></span></div>
                <div class="col">Self Pay</div>
                <div class="col-auto"><i class="icon-self-pay"></i></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 mt-4">
          <button class="btn btn-primary" @click.prevent="getLocation()">
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>

  <section class="section py-5 bg-secondary-light2" v-if="displaySteps">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md stagger">
          <div class="card-step text-center">
            <div class="card-title text-secondary">Step 1</div>
            <div class="card-text text-dark">
              Select your State and Insurance Provider
            </div>
            <div class="content">
              <p>
                We’ll help you find a clinician who’s licensed in your state and
                accepts your insurance.
              </p>
            </div>
          </div>
        </div>
        <div class="col-auto d-md-block stagger">
          <div class="border-end border-dark h-100"></div>
        </div>
        <div class="col-12 col-md stagger">
          <div class="card-step text-center">
            <div class="card-title text-secondary">Step 2</div>
            <div class="card-text text-dark">
              Select a Clinician and Make an Appointment
            </div>
            <div class="content">
              <p>
                Find a clinician that best suits your needs, then schedule your
                first telehealth appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-wrapper pb-5" v-if="!displayLoader">
    <div :class="['section pb-0', { 'bg-secondary-light2': !displaySteps }]">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="title-1 text-secondary stagger">
              Find a Clinician and Schedule an Appointment
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div :class="['py-4', { 'section-appointment': !displaySteps }]">
      <div class="container pb-5 mb-2">
        <div class="row">
          <div class="col-12">
            <AppointmentForm @getClinicians="getClinicians" />
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="datesArr.length">
      <div class="dateBox">
        <div class="row align-items-center m-0 p-0">
          <div class="col-auto p-1 px-4">
            <div class="date-nav nav-prev">
              <i class="icon-left1 pe-2"></i> Prev
            </div>
          </div>
          <div class="col text-center fw-bold">SELECT DATE</div>
          <div class="col-auto p-1 px-4">
            <div class="date-nav nav-next">
              Next <i class="icon-right1 ps-2"></i>
            </div>
          </div>
        </div>
        <div class="dates">
          <div class="row">
            <div class="col-12">
              <ul>
                <swiper
                  :speed="800"
                  :slidesPerView="'auto'"
                  :slidesPerGroup="5"
                  :spaceBetween="5"
                  :modules="[Pagination, Navigation]"
                  effect="fade"
                  :pagination="{ el: '.swiper-pagination', clickable: true }"
                  :navigation="{
                    nextEl: '.dateBox .nav-next',
                    prevEl: '.dateBox .nav-prev',
                  }"
                  @swiper="onSwiper"
                  @slideChange="onSlideChange"
                >
                  <swiper-slide v-for="(date, index) in datesArr" :key="index">
                    <li
                      @click.prevent="getClinicians(0, 1, date.formattedDate)"
                    >
                      <a
                        href=""
                        class="dateArea"
                        :class="(date.isDisabled ? 'in-active' : 
                          (selectedDate != '' &&
                          selectedDate == date.formattedDate
                            ? 'active'
                            : ''))
                        "
                      >
                        <h6>{{ date.month }}</h6>
                        <span>{{ date.date }}</span>
                        {{ date.day }}
                      </a>
                    </li>
                  </swiper-slide>
                </swiper>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-wrapper" v-if="displayErr">
    <div>
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="title-1 text-secondary stagger">
              {{ errorMsg }}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="section pt-3 pb-0">
    <div class="container">
      <div class="list-wrapper">
        <div
          class="card card-3 stagger"
          v-for="(clinician, index) in clinicians"
          :key="index"
        >
          <div class="row gx-6 gy-4 gy-lg-5">
            <div class="col-12 col-lg-8">
              <div class="card-body">
                <div class="row gy-3 gy-lg-4">
                  <div class="col-auto">
                    <div class="card-img">
                      <img
                        :src="`${config.public.backendAssetUrl}${clinician.image}`"
                        class="w-100"
                        alt="Image Name"
                        v-if="clinician.image"
                        @error="imageError"
                      />
                      <img :src="noImg" class="w-100" alt="Image Name" v-else />
                    </div>
                  </div>

                  <div class="col">
                    <div class="card-title title-1">
                      {{ clinician.name }}
                      <span class="card-des"
                        >({{ clinician.qualification }})</span
                      >
                    </div>
                    <div class="price">
                      Cost: ${{ clinician.charges_per_session }} <span class="insuranceAccepted" v-if="clinician.is_insurance == 1">Insurance Accepted</span>
                    </div>
                    <div class="ages">
                      <ul>
                        <li
                          v-for="(age, index) in clinician.age_covered"
                          :key="index"
                        >
                          <div class="iconBox">
                            <i :class="age.age_range.icon"></i>
                            <h5>{{ age.age_range.text }}</h5>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="card-text d-none d-sm-block">
                      <div v-html="clinician.bio.substring(0, 270)"></div>
                      {{ clinician.bio.length > 270 ? "..." : "" }}
                    </div>
                    <div class="card-btn">
                      <NuxtLink
                        :to="{
                          name: 'clinicians-name',
                          params: {
                            name: clinician.slug,
                          },
                        }"
                        class="moreLink"
                      >
                        View full profile
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <h4 class="smHead">Earliest Available:</h4>
              <div class="card-footer">
                <div class="card-ftwrp">
                  <div
                    class="card-ftlist"
                    v-for="(location, index) in clinician.locations"
                    :key="index"
                  >
                    <div class="row align-items-center">
                      <div class="col">
                        <h3>{{ location.location.name }}</h3>
                        <div class="card-fdate">
                          {{
                            location.slots.length ? location.slots[0].date : ""
                          }}
                        </div>
                      </div>
                      <div class="col-auto">
                        <div class="card-fbtn">
                          <NuxtLink
                            class="btn btn-sm btn-secondary"
                            @click.prevent="
                              bookNow(location.slots[0], clinician, location.azalea_id)
                            "
                            >Book Now
                            <i class="bi bi-arrow-right-short ms-2"></i
                          ></NuxtLink>
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
      <ul
        class="pagination justify-content-center pt-4 stagger"
        v-if="totalPages > 1"
      >
        <li class="page-item">
          <a
            class="page-link"
            :class="currentPage === 1 ? 'disabled' : ''"
            href="#"
            aria-label="Previous"
            @click.prevent="
              getClinicians((currentPage - 2) * 10, currentPage - 1)
            "
          >
            <i class="bi bi-arrow-left-short"></i>
          </a>
        </li>
        <li class="page-item" v-for="pageNo in totalPages">
          <a
            class="page-link"
            :class="currentPage == pageNo ? 'active' : ''"
            href="#"
            @click.prevent="getClinicians((pageNo - 1) * 10, pageNo)"
            >{{ pageNo }}</a
          >
        </li>
        <li class="page-item">
          <a
            class="page-link next"
            :class="currentPage === totalPages ? 'disabled' : ''"
            href="#"
            aria-label="Next"
            @click.prevent="getClinicians(currentPage * 10, currentPage + 1)"
          >
            <i class="bi bi-arrow-right-short"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
export default {
  methods: {
    async bookSlot(slot, clinician) {
      if (process.client) {
        const isInsurance = localStorage.getItem("isInsurance");
        const location = localStorage.getItem("location");

        if (
          isInsurance == "" ||
          isInsurance == null ||
          isInsurance == "null" ||
          isInsurance == undefined ||
          location == "" ||
          location == null ||
          location == "null" ||
          location == undefined
        ) {
          Swal.fire({
            text: "Please select required filters.",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#3A89C9",
          });
        } else {
          const patientData = {
            date: slot.formatted_date,
            time: slot.start_time,
            endTime: slot.end_time,
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            home_phone: "",
            mobile_number: "",
            tru_billing_id: clinician.tru_billing_id,
            service_id: localStorage.getItem("serviceProvided"),
            clinician_id: clinician.id,
            practitioner_id: clinician.azalea_id,
            payment_mode: "",
            selectedSlot: slot.id,
            practitioner_name: clinician.name,
            appointmentType: slot.appointmentType,
            start_date_time: slot.start_date_time,
            end_date_time: slot.end_date_time,
          };
          localStorage.setItem("patientDetails", JSON.stringify(patientData));
          localStorage.setItem("selected-slot", slot.id);
          this.$router.push({ path: `/check-user` });
        }
      }
    },
  },
};
</script>
