<script setup>
import flatpickr from "flatpickr";
import "@node_modules/flatpickr/dist/flatpickr.min.css";
import innerHero from "assets/images/hero-blog.jpg";
import { Form, Field, ErrorMessage } from "vee-validate";
const testingTypes = ref([]);
const insurances = ref([]);
const config = useRuntimeConfig();
const { animFade, stagger, killAnimation } = useAnim();
const modalContentHeight = ref();
const testingPageData = ref([]);

nextTick(async () => {
  await useFetch(`${config.public.apiUrl}testing-types`, {
    transform: (res) => {
      testingTypes.value = res.data.data;
    },
  });
  await useFetch(`${config.public.apiUrl}page-data?type=psych-testing`, {
    transform: (res) => {
      testingPageData.value = res.data;
      if (testingPageData.value) {
        nextTick(async () => {
          let charCount = res.data.terms_conditions.length;
          modalContentHeight.value = charCount > 700 ? 300 : 250;
        });
      }
    },
  });
  await useFetch(`${config.public.apiUrl}insurances`, {
    transform: (res) => {
      insurances.value = res.data.data;
    },
  });
});

onMounted(() => {
  animFade();
  stagger();
  flatpickr("#formCalendar", {
    altInput: true,
    altFormat: "m/d/Y",
    dateFormat: "Y-m-d",
    maxDate: "2022-12-31",
    minDate: "1920-01-01",
    disableMobile: "true",
  });
});

onBeforeUnmount(() => {
  killAnimation();
});
</script>
<template>
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
                :class="{ 'scroll-active': modalContentHeight > 280 }"
                v-html="testingPageData.terms_conditions"
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
                @click="addReferral()"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <section
    class="section blog-section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">Psych Testing</h1>
        </div>
      </div>
    </div>
  </section>

  <div class="section contact-section animFade py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-11 col-xl-9 text-center">
          <div class="form-black contact-form mt-5">
            <Form :validation-schema="schema" @submit="sendRequest">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="text"
                        name="first_name"
                        class="form-control"
                        v-model="requestForm.first_name"
                        placeholder="Enter First Name"
                      />
                      <label for="">First Name<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="first_name"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="text"
                        class="form-control"
                        name="last_name"
                        v-model="requestForm.last_name"
                        placeholder="Enter Last Name"
                      />
                      <label for="">Last Name</label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="last_name"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="email"
                        class="form-control"
                        name="email"
                        v-model="requestForm.email"
                        placeholder="Enter Email"
                      />
                      <label for="">Email Address<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="email"
                      />
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
                        name="dob"
                        v-model="requestForm.dob"
                        placeholder="MM/DD/YYYY"
                      />
                      <label for="">Date of Birth<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="dob"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="tel"
                        class="form-control"
                        name="home_phone"
                        v-model="requestForm.home_phone"
                        placeholder="xxx-xxx-xxxx"
                        @input="formattedPhoneNumber()"
                      />
                      <label for="">Home Phone<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="home_phone"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="tel"
                        class="form-control"
                        name="mobile_number"
                        v-model="requestForm.mobile_number"
                        placeholder="xxx-xxx-xxxx"
                        @input="formattedPhoneNumber()"
                      />
                      <label for="">Mobile Number<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="mobile_number"
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
                        name="insurance_or_selfpay"
                        v-model="requestForm.insurance_or_selfpay"
                        @change="onInsuranceChange"
                      >
                        <option value="" disabled selected>
                          Please select
                        </option>
                        <option value="insurance">Insurance</option>
                        <option value="self pay">Self Pay</option>
                      </Field>
                      <label for="">Insurance/Self Pay<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="insurance_or_selfpay"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6" v-if="displayInsurance">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        name="insurance_id"
                        class="form-select"
                        v-model="requestForm.insurance_id"
                        @change="getPlans"
                      >
                        <option value="" selected disabled>
                          Please select
                        </option>
                        <option
                          :value="insurance.insurance_id"
                          :key="index"
                          v-for="(insurance, index) in insurances"
                        >
                          {{ insurance.name }}
                        </option>
                      </Field>
                      <label for="">Insurance<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="insurance_id"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="col-12 col-md-6"
                  v-if="plans.length && displayInsurance"
                >
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        name="plan"
                        class="form-select"
                        v-model="requestForm.insurance_plan_id"
                      >
                        <option value="" selected disabled>
                          Please select
                        </option>
                        <option
                          :value="plan.plan_id"
                          :key="index"
                          v-for="(plan, index) in plans"
                        >
                          {{ plan.planname }}
                        </option>
                      </Field>
                      <label for="">Plans<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="plan"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6" v-if="displayInsurance">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="text"
                        class="form-control"
                        name="member_id"
                        v-model="requestForm.member_id"
                        placeholder="Enter Member ID/EAP Auth. #"
                      />
                      <label for="">Member ID/EAP Auth. #<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="member_id"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6" v-if="displayInsurance">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        name="relation_to_patient"
                        class="form-select"
                        v-model="requestForm.relation_to_patient"
                      >
                        <option value="" selected disabled>
                          Please select
                        </option>
                        <option
                          :value="relation.value"
                          :key="index"
                          v-for="(relation, index) in relations"
                        >
                          {{ relation.text }}
                        </option>
                      </Field>
                      <label for="">Relation to Patient<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="relation_to_patient"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6" v-if="displayInsurance">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        name="policy_holder_gender"
                        class="form-select"
                        v-model="requestForm.policy_holder_gender"
                      >
                        <option value="" selected disabled>
                          Please select
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                      </Field>
                      <label for="">Policy Holder's Gender<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="policy_holder_gender"
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
                        name="testing_type_id"
                        v-model="requestForm.testing_type_id"
                      >
                        <option value="" disabled selected>
                          Please select
                        </option>
                        <option
                          :value="type.id"
                          v-for="(type, index) in testingTypes"
                          :key="index"
                        >
                          {{ type.name }}
                        </option>
                      </Field>
                      <label for="">Type of Testing<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="testing_type_id"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="text"
                        class="form-control"
                        name="clinician_preference"
                        v-model="requestForm.clinician_preference"
                        placeholder="Enter Clinician Preference"
                      />
                      <label for="">Clinician Preference? (If any)</label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="clinician_preference"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        name="hear_about_us"
                        class="form-select"
                        v-model="requestForm.hear_about_us"
                      >
                        <option value="" selected disabled>
                          Please select
                        </option>
                        <option
                          :value="hear.value"
                          :key="index"
                          v-for="(hear, index) in hear_about_us"
                        >
                          {{ hear.text }}
                        </option>
                      </Field>
                      <label for=""
                        >How did you hear about us?<span>*</span></label
                      >
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="hear_about_us"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <div class="label-wrap">
                      <textarea
                        cols="30"
                        rows="6"
                        class="form-control"
                        v-model="requestForm.message"
                        placeholder="Enter Message"
                      ></textarea>
                      <label for="">Message (If any)</label>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group mb-0 text-center">
                    <button
                      type="submit"
                      class="btn btn-sm btn-secondary rounded-2 w-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  data() {
    return {
      plans: [],
      requestForm: {
        first_name: null,
        last_name: null,
        email: null,
        home_phone: null,
        mobile_number: null,
        dob: null,
        testing_type_id: null,
        relation_to_patient: null,
        clinician_preference: "",
        message: null,
        insurance_or_selfpay: null,
        insurance_id: null,
        insurance_plan_id: null,
        member_id: null,
        policy_holder_gender: null,
        hear_about_us: null,
      },
      schema: {
        first_name: "required|alpha_spaces|min:3|max:20",
        last_name: "alpha_spaces|min:0|max:20",
        email: "required|email",
        home_phone: "required|hyphen_numeric: true|min:12|max:12",
        mobile_number: "required|hyphen_numeric: true|min:12|max:12",
        dob: "required",
        testing_type_id: "required",
        insurance_or_selfpay: "required",
        hear_about_us: "required",
        clinician_preference: "alpha_spaces",
      },
      termsCheckbox: "",
      showPopup: false,
      displayInsurance: false,
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
        {
          text: "Grandparent",
          value: "Grandparent",
        },
        {
          text: "Other",
          value: "Other",
        },
      ],
      hear_about_us: [
        {
          text: "Referral from a friend or family member",
          value: "Referral from a friend or family member",
        },
        {
          text: "Search engine (e.g., Google, Bing)",
          value: "Search engine (e.g., Google, Bing)",
        },
        {
          text: "Social media (e.g., Facebook, Twitter)",
          value: "Social media (e.g., Facebook, Twitter)",
        },
        {
          text: "Website or blog",
          value: "Website or blog",
        },
        {
          text: "Other",
          value: "Other",
        },
      ],
    };
  },
  methods: {
    formattedPhoneNumber() {
      this.$nextTick(() => {
        if (
          this.requestForm.mobile_number != "" &&
          this.requestForm.mobile_number != null
        ) {
          let mblNo = this.requestForm.mobile_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.requestForm.mobile_number = mblNo;
        }

        if (
          this.requestForm.home_phone != "" &&
          this.requestForm.home_phone != null
        ) {
          let phoneNo = this.requestForm.home_phone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.requestForm.home_phone = phoneNo;
        }
      });
    },
    sendRequest() {
      this.showPopup = true;
    },
    async addReferral() {
      const config = useRuntimeConfig();
      await useFetch(`${config.public.apiUrl}add-testing-request`, {
        method: "POST",
        body: this.requestForm,
        transform: (res) => {
          this.showPopup = false;
          Swal.fire({
            text: res.message,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#3A89C9",
          }).then(() => {
            this.$router.push({ path: "/" });
          });
        },
      });
    },
    onInsuranceChange() {
      this.displayInsurance =
        this.requestForm.insurance_or_selfpay == "insurance" ? true : false;
      const isInsurance = this.requestForm.insurance_or_selfpay;
      if (isInsurance == "insurance") {
        this.requestForm.insurance_id = null;
        this.requestForm.insurance_plan_id = null;
        this.requestForm.member_id = null;
        this.requestForm.policy_holder_gender = null;
        this.requestForm.relation_to_patient = null;

        this.schema.insurance_id = "required";
        this.schema.member_id = "required";
        this.schema.policy_holder_gender = "required";
        this.schema.relation_to_patient = "required";
      }
    },
    async getPlans() {
      const config = useRuntimeConfig();
      await useFetch(
        `${config.public.apiUrl}insurance-plans?insurance_id=${this.requestForm.insurance_id}`,
        {
          transform: (res) => {
            this.plans = res.data.data;
            if (res.data.data.length) {
              this.schema.plan = "required";
            } else {
              this.schema.plan = "";
            }
          },
        }
      );
    },
  },
};
</script>
<style scoped>
.invalid-feedback {
  display: block;
}
label span {
  color: var(--bs-form-invalid-color);
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
