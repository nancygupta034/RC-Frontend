<script setup>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import flatpickr from "flatpickr";
import "@node_modules/flatpickr/dist/flatpickr.min.css";
const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const appointment = ref({});
const refFancyApp = ref();
const refRescheduleFancyApp = ref();

const getAppointment1 = async () => {
  const { id } = useRoute().params;
  const decryptedData = atob(id);
  nextTick(async () => {
    await useFetch(`${config.public.apiUrl}appointment-data/${decryptedData}`, {
      transform: (res) => {
        appointment.value = res.data;
        return res.data;
      },
    });
  });
};

const rescheduleApp = () => {
  new Fancybox(
    [
      {
        src: refRescheduleFancyApp.value,
        type: "html",
      },
    ],
    {
      autoFocus: false,
      closeButton: false,
      backdropClick: false,
    }
  );
};

const cancelApp = () => {
  new Fancybox(
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
};

onMounted(async () => {
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
  await getAppointment1();
});

onBeforeUnmount(() => {
  killAnimation();
});
</script>
<template>
  <section class="section-content gradientBg bg-white">
    <div v-if="Object.keys(appointment).length !== 0 && !recordNotFound">
      <div class="pt-5">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="blueBox bg-white shadow-sm">
                <div class="row align-items-center">
                  <div class="col-12 col-md">
                    <div class="aInfo">
                      <h1 class="mb-2 newHead">
                        Ref. Number: {{ appointment.reference_id }}
                      </h1>
                      <h4>
                        {{ $dayjs(appointment.date).format("MMM DD, YYYY") }}
                        @ {{ appointment.time }}
                        <span class="tag"
                          >Status: {{ appointment.status }}</span
                        >
                      </h4>
                      <h4 class="price">
                        Charges: ${{
                          appointment.clinician.charges_per_session
                        }}
                      </h4>

                      <div
                        class="row g-3 mt-3"
                        v-if="
                          Object.keys(appointment).length !== 0 &&
                          !recordNotFound
                        "
                      >
                        <!-- <div class="col-auto">
                                <button  class="btn btn-sm btn-secondary">Status: {{ appointment.status }}</button>
                              
                            </div> -->
                        <div class="col-auto">
                          <button
                            @click="rescheduleApp()"
                            class="btn btn-sm btn-primary"
                          >
                            <i class="bi bi-calendar2-week me-2"></i> Reschedule
                          </button>
                        </div>
                        <div class="col-auto">
                          <button
                            @click="cancelApp()"
                            class="btn btn-sm btn-danger"
                          >
                            <i class="bi bi-x-octagon me-2"></i> Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-12 col-md-auto pt-4 pt-lg-0"
                    v-if="appointment.clinician"
                  >
                    <h6>Appointment with</h6>
                    <div class="cBox">
                      <div class="row g-3">
                        <div class="col-auto">
                          <div class="cImg">
                            <img
                              :src="`${config.public.backendAssetUrl}${appointment.clinician.image}`"
                              alt=""
                            />
                          </div>
                        </div>
                        <div class="col">
                          <h3>
                            {{ appointment.clinician.name }}
                            <span>{{
                              appointment.clinician.qualification
                            }}</span>
                          </h3>
                          <div class="cInfo">
                            {{ appointment.clinician.email }}<br />
                            {{ appointment.clinician.phone_no }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4 g-4">
            <div class="col-12" v-if="appointment.referral">
              <div class="greyBox">
                <div class="row">
                  <div class="col-12 col-lg-6 d-flex">
                    <div>
                      <h4>Doctor's Details</h4>
                      <ul>
                        <li>
                          <span>Name:</span>
                          {{ appointment.referral.dr_name }}
                        </li>
                        <li>
                          <span>Email:</span>
                          {{ appointment.referral.dr_email }}
                        </li>
                        <li>
                          <span>Mobile No.:</span>
                          {{ appointment.referral.dr_mobile_number }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-12 col-lg-6 d-flex">
                    <div>
                      <h4>Clinic's Details</h4>
                      <ul>
                        <li>
                          <span>Name:</span>
                          {{ appointment.referral.clinic_name }}
                        </li>
                        <li>
                          <span>Email:</span>
                          {{ appointment.referral.clinic_email }}
                        </li>
                        <li>
                          <span>Phone No.:</span>
                          {{ appointment.referral.clinic_mobile_number }}
                        </li>
                        <li>
                          <span>Address:</span>
                          {{ appointment.referral.clinic_address }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <hr v-if="appointment.referral.reason" />
                  <div class="col-12" v-if="appointment.referral.reason">
                    <div>
                      <h4>Reason</h4>
                      {{ appointment.referral.reason }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6 d-flex">
              <div class="greyBox">
                <h4>Personal Details</h4>
                <ul>
                  <li>
                    <span>Name:</span> {{ appointment.first_name }}
                    {{ appointment.last_name }}
                  </li>
                  <li>
                    <span>Date of Birth:</span>
                    {{ $dayjs(appointment.dob).format("MMM DD, YYYY") }}
                  </li>
                  <li><span>Email:</span> {{ appointment.email }}</li>
                  <li><span>Home Phone:</span> {{ appointment.home_phone }}</li>
                  <li>
                    <span>Mobile No.:</span> {{ appointment.mobile_number }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-12 col-lg-6 d-flex">
              <div class="greyBox">
                <h4>Payment Info</h4>
                <ul>
                  <li>
                    <span>Payment Mode:</span>
                    {{ appointment.payment_mode }}
                  </li>
                  <li v-if="appointment.insurance_id">
                    <span>Insurance:</span>
                    {{
                      appointment.insurance ? appointment.insurance.name : "N/A"
                    }}
                  </li>
                  <li v-if="appointment.insurance_plan_id">
                    <span>Insurance Plan:</span>
                    {{ appointment.plan ? appointment.plan.planname : "N/A" }}
                  </li>
                  <li v-if="appointment.member_id">
                    <span>Member ID/EAP Auth:</span>
                    {{ appointment.member_id }}
                  </li>
                  <li v-if="appointment.policy_holder_gender">
                    <span>Policy Holder's Gender:</span>
                    {{ appointment.policy_holder_gender }}
                  </li>
                  <li v-if="appointment.service_provided">
                    <span>Service:</span>
                    {{ appointment.service_provided.name }}
                  </li>
                  <li v-if="appointment.relation_to_patient">
                    <span>Relation to Patient:</span>
                    {{ appointment.relation_to_patient }}
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-12 px-4"
              v-if="
                appointment.cancellation_reason &&
                appointment.cancellation_reason != 'null'
              "
            >
              <h6>Reason for Cancelling Appointment:</h6>
              <p>{{ appointment.cancellation_reason }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container pt-5"></div>
    </div>
    <div class="pt-5 g-4" v-else>
      <div class="text-center">
        <h3>Please fill your details to check appointment details</h3>
        <div class="btn-wrap mt-5">
          <a href="/appointments/check" class="btn btn-primary rounded-3"
            >Go Back <i class="bi bi-arrow-right me-2"></i
          ></a>
        </div>
      </div>
    </div>
  </section>
  <div>
    <div ref="refFancyApp" class="userPop" style="display: none">
      <button
        data-fancybox-close=""
        class="f-button is-close-btn"
        title="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          tabindex="-1"
        >
          <path d="M20 20L4 4m16 0L4 20"></path>
        </svg>
      </button>
      <div class="row g-3 mb-4">
        <div class="col-12">
          <h2><b>Cancel Appointment</b></h2>
        </div>
        <div class="form-black contact-form mt-4">
          <Form @submit="updateStatus(appointment.id)">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <div class="label-wrap">
                    <textarea
                      cols="30"
                      rows="6"
                      class="form-control"
                      v-model="cancellationReason"
                      placeholder="Enter reason"
                    ></textarea>
                    <label for="">Reason<span>*</span></label>
                  </div>
                  <div class="error invalid-feedback" v-if="cancelErr">
                    <p class="invalid-feedback">This field is required.</p>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group mb-0 text-center">
                  <button
                    type="submit"
                    class="btn btn-sm btn-secondary rounded-2 w-100"
                    :disabled="cancellingForm"
                  >
                    {{ cancellingForm == true ? "Cancelling" : "Cancel" }}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div ref="refRescheduleFancyApp" class="userPop" style="display: none">
      <button
        data-fancybox-close=""
        class="f-button is-close-btn"
        title="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          tabindex="-1"
        >
          <path d="M20 20L4 4m16 0L4 20"></path>
        </svg>
      </button>
      <div class="overlay" v-if="displayLoader">
        <div class="overlay__inner">
          <div class="overlay__content">
            <span class="spinner"></span>
          </div>
        </div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-12">
          <h2><b>Reschedule Appointment</b></h2>
        </div>
        <div class="form-black contact-form mt-4">
          <Form>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <div class="label-wrap">
                    <Field
                      type="date"
                      id="formCalendar"
                      ref="inputBirthRef"
                      class="form-control icon-calendar"
                      name="date"
                      v-model="date"
                      @change="
                        onDateChange(
                          $event,
                          appointment.location,
                          appointment.clinician.azalea_id
                        )
                      "
                    />
                    <label for="">Select Date<span>*</span></label>
                  </div>
                  <div class="error invalid-feedback" v-if="cancelErr">
                    <p class="invalid-feedback">This field is required.</p>
                  </div>
                </div>
                <div class="card-footer mt-4" v-if="slots.length !== 0">
                  <div class="card-ft">Available Appointment Slots</div>
                  <div class="card-ftwrp">
                    <div
                      class="card-ftlist"
                      v-for="(slot, index) in slots"
                      :key="index"
                    >
                      <div class="row align-items-center">
                        <div class="col">
                          <div class="card-fdate">
                            {{ slot.date }}
                          </div>
                        </div>
                        <div class="col-auto">
                          <div class="card-fbtn">
                            <a
                              class="btn btn-sm btn-secondary"
                              @click.prevent="reschedule(slot, appointment.id)"
                              >Book Now
                              <i class="bi bi-arrow-right-short ms-2"></i
                            ></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-warning rounded-3 p-4 mt-4" v-if="noSlots">
                  Unfortunately, no slots available for selected date. Please
                  check another one.
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div ref="refRescheduleFancyApp" class="userPop" style="display: none">
      <button
        data-fancybox-close=""
        class="f-button is-close-btn"
        title="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          tabindex="-1"
        >
          <path d="M20 20L4 4m16 0L4 20"></path>
        </svg>
      </button>
      <div class="overlay" v-if="displayLoader">
        <div class="overlay__inner">
          <div class="overlay__content">
            <span class="spinner"></span>
          </div>
        </div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-12">
          <h2><b>Reschedule Appointment</b></h2>
        </div>
        <div class="form-black contact-form mt-4">
          <Form @submit="updateStatus(appointment.id)">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <div class="label-wrap">
                    <Field
                      type="date"
                      id="formCalendar"
                      ref="inputBirthRef"
                      class="form-control icon-calendar"
                      name="date"
                      v-model="date"
                      @change="
                        onDateChange(
                          $event,
                          appointment.location,
                          appointment.clinician.azalea_id
                        )
                      "
                    />
                    <label for="">Select Date<span>*</span></label>
                  </div>
                  <div class="error invalid-feedback" v-if="cancelErr">
                    <p class="invalid-feedback">This field is required.</p>
                  </div>
                </div>
                <div class="card-footer mt-4" v-if="slots.length !== 0">
                  <div class="card-ft">Available Appointment Slots</div>
                  <div class="card-ftwrp">
                    <div
                      class="card-ftlist"
                      v-for="(slot, index) in slots"
                      :key="index"
                    >
                      <div class="row align-items-center">
                        <div class="col">
                          <div class="card-fdate">
                            {{ slot.date }}
                          </div>
                        </div>
                        <div class="col-auto">
                          <div class="card-fbtn">
                            <a
                              class="btn btn-sm btn-secondary"
                              @click.prevent="reschedule(slot, appointment.id)"
                              >Book Now
                              <i class="bi bi-arrow-right-short ms-2"></i
                            ></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-warning rounded-3 p-4 mt-4" v-if="noSlots">
                  Unfortunately, no slots available for selected date. Please
                  check another one.
                </div>
              </div>
              <div class="col-12">
                <div class="form-group mb-0 text-center">
                  <button
                    type="submit"
                    class="btn btn-sm btn-secondary rounded-2 w-100"
                    :disabled="cancellingForm"
                  >
                    {{ cancellingForm == true ? "Cancelling" : "Cancel" }}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { usePatientStore } from "~/store/patient";
import { Form, Field, ErrorMessage } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
export default {
  data() {
    return {
      cancellationReason: "",
      cancellingForm: false,
      cancelErr: false,
      date: "",
      displayLoader: false,
      noSlots: false,
      slots: [],
    };
  },
  async created() {},
  methods: {
    async onDateChange(event, location, azalea_id) {
      this.date = event.target.value;
      if (this.date != null) {
        this.displayLoader = true;
        const config = useRuntimeConfig();
        await useFetch(
          `${config.public.apiUrl}slot-list?only_slots=true&date=${this.date}&location=${location}&clinician=${azalea_id}`,
          {
            transform: (res) => {
              this.slots = res.data;
              this.displayLoader = false;
              return res.data;
            },
          }
        );
      }
    },
    async getPatient() {
      this.submittingForm = true;
      this.userExists = false;
      const config = useRuntimeConfig();
      await useFetch(
        `${config.public.apiUrl}patient-data?name=${this.patientForm.name}&email=${this.patientForm.email}`,
        {
          method: "GET",
          transform: (res) => {
            this.submittingForm = false;
            if (res.data !== null) {
              this.userExists = true;
            } else {
              if (process.client) {
                let patientData = localStorage.getItem("patientDetails");
                patientData = JSON.parse(patientData);
                patientData.email = this.patientForm.email;
                patientData.first_name = this.patientForm.name.split(" ")[0];
                patientData.last_name = this.patientForm.name.split(" ")[1];
                localStorage.setItem(
                  "patientDetails",
                  JSON.stringify(patientData)
                );
              }
              const store = usePatientStore();
              store.updatePatientDetails(this.patientForm);
              this.$router.push({ path: "/book-appointment" });
            }
          },
        }
      );
    },
    async updateStatus(id) {
      this.cancelErr = false;
      if (this.cancellationReason == "") {
        this.cancelErr = true;
      } else {
        let data = new FormData();
        this.cancellingForm = true;
        const config = useRuntimeConfig();
        data.append("appointment_id", id);
        data.append("cancellation_reason", this.cancellationReason);
        data.append("status", "Cancelled");
        data.append("payment_mode", "");

        await useFetch(`${config.public.apiUrl}update-appointment`, {
          method: "POST",
          body: data,
          transform: (res) => {
            this.cancellingForm = false;
            if (res.success == true) {
              Swal.fire({
                text: "Your appointment has been cancelled successfully.",
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: "Ok",
                confirmButtonColor: "#3A89C9",
              }).then(() => {
                this.$router.push({ path: "/" });
              });
            } else {
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
      }
    },
    async reschedule(data, appointmentId) {
      this.displayLoader = true;
      const payload = {
        appointment_id: appointmentId,
        appointmentType: data.appointmentType,
        end_date_time: data.end_date_time,
        start_date_time: data.start_date_time,
        time: data.start_time,
        date: data.formatted_date,
      };
      const config = useRuntimeConfig();
      await useFetch(`${config.public.apiUrl}reschedule-appointment`, {
        method: "POST",
        body: payload,
        transform: (res) => {
          this.showPopup = false;
          console.log("res => ", res);
          Swal.fire({
            text: res.message,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#3A89C9",
          }).then(() => {
            this.$router.push({ path: "/" }).then(() => {
              this.$router.go();
            });
          });
        },
      });
    },
    resetForm() {
      this.patientForm = {
        name: null,
        email: null,
      };
      this.userExists = false;
    },
  },
};
</script>
<style scoped>
.invalid-feedback {
  display: block;
}
.card-footer {
  background-color: #3a89c9;
  border-radius: 8px;
  border: 0;
  padding: 2px;
}
.card-footer .card-ft {
  font-size: 1rem;
  font-weight: 700;
  padding: 10px 15px;
  color: #fff;
}
.card-footer .card-ftwrp {
  border-radius: 8px;
  background-color: #fff;
  overflow-y: scroll;
}
.card-footer .card-ftwrp .card-ftlist {
  padding: 7px 15px;
}
.card-footer .card-ftwrp .card-ftlist .card-fdate {
  font-size: 0.75rem;
  font-weight: 700;
  color: #000;
  line-height: normal;
  margin-bottom: 2px;
}
.card-footer .card-ftwrp .card-ftlist .card-fbtn .btn {
  font-size: 0.75rem;
  border-radius: 4px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  transition: 0.3s ease-out;
}
</style>
