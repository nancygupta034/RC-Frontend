<script setup>
import "@node_modules/flatpickr/dist/flatpickr.min.css";

const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const appPageData = ref({});

nextTick(async () => {
  animFade();
  stagger();
  await useFetch(`${config.public.apiUrl}page-data?type=appointment`, {
    transform: (res) => {
      appPageData.value = res.data;
    },
  });
});

onBeforeUnmount(() => {
  killAnimation();
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
  <!-- Insurance Info -->
  <div class="form-black whiteBox contact-form mt-2 mt-md-5">
    <h1 class="fw-bold text-secondary">Insurance Info</h1>
    <Form :validation-schema="schema" @submit="save">
      <div class="row mt-5">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                as="select"
                class="form-select"
                name="selectedInsurance"
                v-model="selectedInsurance"
                @change="getPlans"
              >
                <option value="">Please select</option>
                <option
                  :value="insurance[0].insurance_id"
                  v-for="(insurance, index) in insurances"
                  :key="index"
                >
                  {{ insurance[0].insurance.name }}
                </option>
              </Field>
              <label for="">Insurance<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage class="invalid-feedback" name="selectedInsurance" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6" v-if="plans.length">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                as="select"
                class="form-select"
                name="plan"
                v-model="appointmentForm.plan"
              >
                <option value="">Please select</option>
                <option
                  :value="plan.plan_id"
                  v-for="(plan, index) in plans"
                  :key="index"
                >
                  {{ plan.plan.name }}
                </option>
              </Field>
              <label for="">Plan<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage class="invalid-feedback" name="plan" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                type="text"
                class="form-control"
                name="member_id"
                v-model="appointmentForm.member_id"
                placeholder="Enter Member ID/EAP Auth."
              />
              <label for="">Member ID/EAP Auth. #<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage class="invalid-feedback" name="member_id" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                as="select"
                class="form-select"
                name="relation_to_patient"
                v-model="appointmentForm.relation_to_patient"
              >
                <option value="">Please select</option>
                <option
                  :value="relation.value"
                  v-for="(relation, index) in relations"
                  :key="index"
                >
                  {{ relation.text }}
                </option>
              </Field>
              <label for="">Relation to Patient<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage
                class="invalid-feedback"
                name="relation_to_patient"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                as="select"
                class="form-select"
                name="policy_holder_gender"
                v-model="appointmentForm.policy_holder_gender"
              >
                <option value="">Please select</option>
                <option
                  :value="gen.value"
                  v-for="(gen, index) in gender"
                  :key="index"
                >
                  {{ gen.text }}
                </option>
              </Field>
              <label for="">Policy Holder's Gender<span>*</span></label>
            </div>
            <div class="error invalid-feedback">
              <ErrorMessage
                class="invalid-feedback"
                name="policy_holder_gender"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-auto">
          <button type="submit" class="btn btn-sm btn-secondary rounded-2">
            Save
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
  <!-- Insurance Info Ends -->
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
      insurances: [],
      plans: [],
      submittingForm: false,
      selectedInsurance: "",
      appointmentForm: {
        insurance_id: "",
        plan: "",
        member_id: "",
        relation_to_patient: "",
        policy_holder_gender: "",
      },
      slots: [],
      displayLoader: false,
      schema: {
        selectedInsurance: "required",
        member_id: "required",
        relation_to_patient: "required|regex:^([^0-9]*)$",
        policy_holder_gender: "required",
      },
      gender: [
        {
          text: "Male",
          value: "male",
        },
        {
          text: "Female",
          value: "female",
        },
        {
          text: "Others",
          value: "others",
        },
      ],
      relations: [
        {
          text: "Self",
          value: "Self",
        },
        {
          text: "Spouse",
          value: "Spouse",
        },

        {
          text: "Child",
          value: "Child",
        },
        {
          text: "Parent",
          value: "Parent",
        },
        {
          text: "Sibling",
          value: "Sibling",
        },
        // {
        //   text: "Domestic Partner",
        //   value: "Domestic Partner",
        // },
        {
          text: "Grandparent",
          value: "Grandparent",
        },
        {
          text: "Other",
          value: "Other",
        },
      ],
      termsCheckbox: "",
      showPopup: false,
    };
  },
  async mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    await this.getInsurances();
    if (process.client) {
      let patientData = localStorage.getItem("patientDetails");
      patientData = JSON.parse(patientData);
      if (
        patientData.selectedInsurance != "" &&
        patientData.selectedInsurance != null
      ) {
        this.selectedInsurance = patientData.selectedInsurance;
      }
      if (patientData.insurance_id != "" && patientData.insurance_id != null) {
        this.appointmentForm.insurance_id = patientData.insurance_id;
      }
      if (
        patientData.insurance_plan_id != "" &&
        patientData.insurance_plan_id != null
      ) {
        this.appointmentForm.plan = patientData.insurance_plan_id;
      }
      this.getPlans();
      if (patientData.member_id != "" && patientData.member_id != null) {
        this.appointmentForm.member_id = patientData.member_id;
      }
      if (
        patientData.relation_to_patient != "" &&
        patientData.relation_to_patient != null
      ) {
        this.appointmentForm.relation_to_patient =
          patientData.relation_to_patient;
      }
      if (
        patientData.policy_holder_gender != "" &&
        patientData.policy_holder_gender != null
      ) {
        this.appointmentForm.policy_holder_gender =
          patientData.policy_holder_gender;
      }
    }
  },
  methods: {
    async save() {
      if (this.showPopup == false) {
        this.showPopup = true;
      } else {
        this.submittingForm = true;
        this.displaySlotError = false;
        if (process.client) {
          let patientData = localStorage.getItem("patientDetails");
          patientData = JSON.parse(patientData);
          patientData.policy_holder_gender =
            this.appointmentForm.policy_holder_gender;
          patientData.selectedInsurance = this.selectedInsurance;
          patientData.relation_to_patient =
            this.appointmentForm.relation_to_patient;
          patientData.member_id = this.appointmentForm.member_id;
          patientData.insurance_id = this.selectedInsurance;
          patientData.insurance_plan_id = this.appointmentForm.plan;
          localStorage.setItem("patientDetails", JSON.stringify(patientData));
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
        }
      }
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
    async getInsurances() {
      if (process.client) {
        let patientData = localStorage.getItem("patientDetails");
        patientData = JSON.parse(patientData);
        const config = useRuntimeConfig();
        await useFetch(
          `${config.public.apiUrl}clinician-insurances?clinician_id=${patientData.tru_billing_id}`,
          {
            transform: (res) => {
              this.insurances = res.data;
            },
          }
        );
      }
    },
    async getPlans() {
      if (process.client) {
        let patientData = localStorage.getItem("patientDetails");
        patientData = JSON.parse(patientData);
        const config = useRuntimeConfig();
        await useFetch(
          `${config.public.apiUrl}insurance-plans/${this.selectedInsurance}?clinician_id=${patientData.tru_billing_id}`,
          {
            transform: (res) => {
              this.plans = res.data;
              this.appointmentForm.plan = "";
              if (res.data.length) {
                this.schema.plan = "required";
              } else {
                this.schema.plan = "";
              }
            },
          }
        );
      }
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
