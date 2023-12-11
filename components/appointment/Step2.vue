<script setup>
import flatpickr from "flatpickr";
import "@node_modules/flatpickr/dist/flatpickr.min.css";
const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const servicesProvided = ref([]);
const appPageData = ref({});
var clinician = ref({});

nextTick(async () => {
  if (process.client) {
    let patientData = localStorage.getItem("patientDetails");
    patientData = JSON.parse(patientData);
    await useFetch(
      `${config.public.apiUrl}services-provided?clinician_id=${patientData.clinician_id}`,
      {
        transform: (res) => {
          servicesProvided.value = res.data.data;
        },
      }
    );
  }
  await useFetch(`${config.public.apiUrl}page-data?type=appointment`, {
    transform: (res) => {
      appPageData.value = res.data;
    },
  });
});

onMounted(() => {
  animFade();
  stagger();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  flatpickr("#formCalendar", {
    altInput: true,
    // altFormat: "j F, Y",
    altFormat: "m/d/Y",
    dateFormat: "Y-m-d",
    minDate: currentDate,
    disableMobile: "true",
  });
});

onBeforeUnmount(() => {
  killAnimation();
});

useHead({
  title: clinician.value.name,
  meta: [
    {
      name: "description",
      content: clinician.value.name,
    },
  ],
});
</script>

<template>
  <!--T&C Popup-->
  <div v-if="showPopup">
    <transition name="modal-fade">
      <div class="modal modal-custom">
        <div class="modal-content" style="max-width: 600px">
          <slot></slot>
          <div class="row gy-4">
            <div class="col-12">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0 text-secondary"><b>Terms & Conditions</b></h2>
                </div>
                <div class="col-auto">
                  <span
                    class="close"
                    @click="
                      termsCheckbox = false;
                      showPopup = false;
                    "
                    >&times;</span
                  >
                </div>
              </div>
            </div>
            <div class="col-12">
              <div
                class="content-wrapper"
                id="modalContentHeight"
                :class="{
                  'scroll-active': appPageData.terms_conditions.length > 700,
                }"
                v-html="appPageData.terms_conditions"
              ></div>
            </div>
            <div class="col-12">
              <div class="form-check form-checkbox">
                <input
                  class="form-check-input"
                  id="checkbox"
                  type="checkbox"
                  v-model="termsCheckbox"
                />
                <label for="checkbox" class="form-check-label ms-3"
                  >I agree to these Terms and Conditions.</label
                >
              </div>
            </div>
            <div class="col-12">
              <button
                class="btn btn-primary"
                :disabled="!termsCheckbox"
                @click="save()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  style="margin: 0 10px"
                  width="24px"
                  height="24px"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  v-if="submittingForm"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    stroke-width="8"
                    stroke="#ffffff"
                    stroke-dasharray="50.26548245743669 50.26548245743669"
                    fill="none"
                    stroke-linecap="round"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      repeatCount="indefinite"
                      dur="1s"
                      keyTimes="0;1"
                      values="0 50 50;360 50 50"
                    ></animateTransform>
                  </circle>
                </svg>
                {{ submittingForm ? "" : "Continue" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <!-- Services Detail -->
  <div class="form-black whiteBox contact-form mt-2 mt-md-5">
    <h1 class="fw-bold text-secondary">Type of Service</h1>
    <Form :validation-schema="schema" @submit="save">
      <div class="row mt-5">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                as="select"
                class="form-select"
                v-model="appointmentForm.service_id"
                name="service_id"
              >
                <option value="" disabled selected>Please select</option>
                <option
                  :value="service.id"
                  v-for="(service, index) in servicesProvided"
                  :key="index"
                >
                  {{ service.name }}
                </option>
              </Field>
              <label for="">Select Service<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage class="invalid-feedback" name="service_id" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                type="date"
                id="formCalendar"
                ref="inputBirthRef"
                class="form-control icon-calendar"
                name="date"
                v-model="appointmentForm.date"
                @change="onDateChange()"
              />

              <label for="">Select Date<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage class="invalid-feedback" name="date" />
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="loader" v-if="displayLoader">
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
          <div class="table-responsive custom-scrollbar-black">
            <table class="table table-appo black table-bordered mb-0">
              <thead>
                <tr>
                  <th v-for="slot in slotDates" :key="slot">
                    {{ slot }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="slot in slotDates" :key="slot">
                    <ul>
                      <li
                        v-for="(slotData, slotIndex) in slots[slot]"
                        :key="slotIndex"
                        @click="updateTime(slotData)"
                        :class="selectedSlot == slotData.id ? 'active' : ''"
                      >
                        {{ slotData.time }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="error invalid-feedback" v-if="displaySlotError">
              <span class="invalid-feedback">Please select a slot.</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-auto mt-4">
          <button type="submit" class="btn btn-sm btn-secondary rounded-2">
            Save and Continue
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary rounded-2 ms-3"
            @click="cancel()"
          >
            Cancel
          </button>
        </div>
      </div>
    </Form>
  </div>
  <!-- Services Ends -->
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
export default {
  scrollToTop: true,
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      submittingForm: false,
      appointmentForm: {
        service_id: "",
        date: "",
        time: "",
        endTime: "",
        start_date_time: "",
        end_date_time: "",
      },
      slots: [],
      disableDates: [],
      slotDates: [],
      displayLoader: false,
      schema: {
        service_id: "required",
        // date: "required",
        // time: "required",
      },
      selectedSlot: null,
      displaySlotError: false,
      termsCheckbox: "",
      showPopup: false,
    };
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (process.client) {
      this.selectedSlot = localStorage.getItem("selected-slot");
      let patientData = localStorage.getItem("patientDetails");
      patientData = JSON.parse(patientData);

      if (patientData.date != "" && patientData.date != null) {
        this.appointmentForm.time = patientData.time;
        this.appointmentForm.endTime = patientData.endTime;
        this.appointmentForm.date = patientData.date;
        this.appointmentForm.service_id = patientData.service_id;
        this.appointmentForm.start_date_time = patientData.start_date_time;
        this.appointmentForm.end_date_time = patientData.end_date_time;

        this.selectedSlot = patientData.selectedSlot;
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}-${month}-${day}`;

        flatpickr("#formCalendar", {
          altInput: true,
          altFormat: "j F, Y",
          dateFormat: "Y-m-d",
          minDate: currentDate,
          defaultDate: patientData.date,
          disableMobile: "true",
        });

        this.onDateChange();
      }
    }
  },
  methods: {
    async save() {
      if (process.client) {
        const paymentMethod = localStorage.getItem("isInsurance");
        console.log("paymentMethod => ", paymentMethod);
        if (
          this.showPopup == false &&
          (paymentMethod == "self-pay" || paymentMethod == "")
        ) {
          this.showPopup = true;
        } else {
          if (this.appointmentForm.service_id != "") {
            this.submittingForm = true;
            this.displaySlotError = false;
            let patientData = localStorage.getItem("patientDetails");
            const location = localStorage.getItem("location");
            const isRefAppointment = localStorage.getItem("isRefAppointment");

            patientData = JSON.parse(patientData);
            patientData.service_id = this.appointmentForm.service_id;
            patientData.date = this.appointmentForm.date;
            patientData.time = this.appointmentForm.time;
            (patientData.start_date_time =
              this.appointmentForm.start_date_time),
              (patientData.end_date_time = this.appointmentForm.end_date_time);
            patientData.endTime = this.appointmentForm.endTime;
            patientData.location = location;
            patientData.selectedSlot = this.selectedSlot;
            if (isRefAppointment == "true") {
              const referral_id = localStorage.getItem("referral_id");
              patientData.referral_id = referral_id;
            }
            patientData.payment_mode =
              paymentMethod == "insurance" ? "Insurance" : "Self Pay";
            localStorage.setItem("patientDetails", JSON.stringify(patientData));
            if (paymentMethod == "self-pay" || paymentMethod == "") {
              //
              const config = useRuntimeConfig();
              await useFetch(`${config.public.apiUrl}book-appointment`, {
                method: "POST",
                body: patientData,
                transform: (res) => {
                  this.submittingForm = false;
                  if (res.success == true) {
                    localStorage.setItem("patientDetails", "");
                    localStorage.setItem("selected-slot", "");
                    localStorage.setItem("isInsurance", "");
                    localStorage.setItem("user", "");
                    localStorage.setItem("location", "");
                    localStorage.setItem("state", "");
                    localStorage.setItem("speciality", "");
                    localStorage.setItem("ageRange", "");
                    localStorage.setItem("serviceProvided", "");
                    localStorage.setItem("reference_id", res.data.reference_id);
                    this.$router.push({ path: "/thank-you" });
                  } else {
                    this.showPopup == false
                    Swal.fire({
                      text: res.message,
                      showDenyButton: false,
                      showCancelButton: false,
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#3A89C9",
                    });
                  }
                },
                onResponseError({ request, response, options }) {
                  this.submittingForm = false;
                  this.showPopup == false
                  // Handle the response errors
                  Swal.fire({
                    text: response._data.message,
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#3A89C9",
                  });
                },
              });
            } else {
              this.submittingForm = false;
              this.$emit("nextStep");
            }
          }
        }
      }
    },
    updateTime(slotData) {
      this.appointmentForm.date = slotData.formatted_date;
      this.appointmentForm.time = slotData.start_time;
      this.appointmentForm.endTime = slotData.end_time;
      this.appointmentForm.start_date_time = slotData.start_date_time;
      this.appointmentForm.end_date_time = slotData.end_date_time;
      this.selectedSlot = slotData.id;
    },
    async onDateChange() {
      this.displayLoader = true;
      const selectedDate = document.getElementById("formCalendar").value;
      const locationId = localStorage.getItem("location");
      let patientData = localStorage.getItem("patientDetails");
      const clinicianData = JSON.parse(patientData);
      const config = useRuntimeConfig();
      await useFetch(
        `${config.public.apiUrl}slot-list?date=${selectedDate}&nearest_slots=true&location=${locationId}&clinician=${clinicianData.practitioner_id}`,
        {
          transform: (res) => {
            this.slotDates = Object.keys(res.data.slots);
            this.slots = res.data.slots;
            this.disableDates = res.data.dates;
            if (process.client) {
              let patientData = localStorage.getItem("patientDetails");
              patientData = JSON.parse(patientData);
              if (patientData.date != "" && patientData.date != null) {
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let currentDate = `${year}-${month}-${day}`;

                flatpickr("#formCalendar", {
                  altInput: true,
                  altFormat: "j F, Y",
                  dateFormat: "Y-m-d",
                  minDate: currentDate,
                  disable: this.disableDates,
                  defaultDate: selectedDate,
                  disableMobile: "true",
                });
              }
            }
            this.displayLoader = false;
            return res.data;
          },
        }
      );
    },
    cancel() {
      Swal.fire({
        title: "Are you sure?",
        text: "Your filled data will be removed",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3A89C9",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continue",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("patientDetails", "");
          localStorage.setItem("selected-slot", "");
          localStorage.setItem("isInsurance", "");
          localStorage.setItem("user", "");
          localStorage.setItem("location", "");
          localStorage.setItem("state", "");
          localStorage.setItem("speciality", "");
          localStorage.setItem("ageRange", "");
          localStorage.setItem("serviceProvided", "");
          this.$router.push({ path: "/clinicians" }).then(() => {
            this.$router.go();
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.invalid-feedback {
  display: block;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* Transition animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
