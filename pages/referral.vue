<script setup>
import innerHero from "assets/images/hero-blog.jpg";
import { Form, Field, ErrorMessage } from "vee-validate";
// import $ from 'jquery';
import { ref } from "vue";
const referralPageData = ref([]);
const config = useRuntimeConfig();
const { animFade, stagger, killAnimation } = useAnim();

const modalContentHeight = ref();

nextTick(async () => {
  await useFetch(`${config.public.apiUrl}page-data?type=referral`, {
    transform: (res) => {
      referralPageData.value = res.data;

      if (referralPageData.value) {
        nextTick(async () => {
          let charCount = res.data.terms_conditions.length;
          modalContentHeight.value = charCount > 700 ? 300 : 250;
        });
      }
    },
  });
});

onMounted(() => {
  animFade();
  stagger();
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
                v-html="referralPageData.terms_conditions"
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
          <h1 class="innsec-title mb-3 stagger">Referral</h1>
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
                        name="dr_name"
                        class="form-control"
                        v-model="requestForm.dr_name"
                        placeholder="Enter Your Name"
                      />
                      <label for="">Full Name<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="dr_name"
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
                        name="dr_email"
                        v-model="requestForm.dr_email"
                        placeholder="Enter Your Email"
                      />
                      <label for="">Email Address<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="dr_email"
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
                        name="dr_mobile_number"
                        v-model="requestForm.dr_mobile_number"
                        placeholder="xxx-xxx-xxxx"
                        @input="formattedPhoneNumber()"
                      />
                      <label for="">Mobile Number<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="dr_mobile_number"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        type="text"
                        name="clinic_name"
                        class="form-control"
                        v-model="requestForm.clinic_name"
                        placeholder="Enter Clinic's Name"
                      />
                      <label for="">Clinic's Name<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="clinic_name"
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
                        name="clinic_email"
                        v-model="requestForm.clinic_email"
                        placeholder="Enter Clinic's Email"
                      />
                      <label for="">Clinic's Email Address<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="clinic_email"
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
                        name="clinic_mobile_number"
                        v-model="requestForm.clinic_mobile_number"
                        placeholder="xxx-xxx-xxxx"
                        @input="formattedPhoneNumber()"
                      />
                      <label for="">Clinic's Phone Number<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="clinic_mobile_number"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <div class="label-wrap">
                      <Field
                        as="select"
                        class="form-select"
                        name="type"
                        v-model="requestForm.type"
                      >
                        <option value="" disabled selected>
                          Please select
                        </option>
                        <option value="Counselling">Counselling</option>
                        <option value="Medication Management">
                          Medication Management
                        </option>
                        <option value="Psych Testing">Psych Testing</option>
                      </Field>
                      <label for="">Service Type<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="type"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <div class="label-wrap">
                      <!-- <input
                    type="search"
                    placeholder="searchYourAddress"
                    id="searchTextField"
                    class="mt-2 admin-customer-fields"
                    v-model="searchTextField"
                    color="#9e9e9e"
                    outlined
                    provided
                    ref="address_input"
                    autocomplete="off"
                  /> -->
                      <Field
                        type="text"
                        class="form-control"
                        name="clinic_address"
                        v-model="requestForm.clinic_address"
                        placeholder="Enter Clinic's Full Address"
                      />
                      <label for="">Clinic's Address<span>*</span></label>
                    </div>
                    <div class="error invalid-feedback text-start">
                      <ErrorMessage
                        class="invalid-feedback text-start"
                        name="clinic_address"
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
                        v-model="requestForm.reason"
                        placeholder="Enter reason for the referral, including any diagnosis, medical history, or specific medical concerns."
                      ></textarea>
                      <label for="">Reason for referral (If any)</label>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group mb-0 text-center">
                    <button
                      type="submit"
                      class="btn btn-sm btn-secondary rounded-2 w-100"
                    >
                      Make Appointment
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
import VueGoogleAutocomplete from "vue-google-autocomplete";
export default {
  components: { VueGoogleAutocomplete },
  mounted() {
    // const url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAacCGHHzRAp6cKx65oNvMKmFZbk1_j0hA&libraries=places`;
    // var scripts = document.getElementsByTagName("script");
    // let scriptExist = false;
    // for (var i = scripts.length; i--; ) {
    //   if (scripts[i].src == url) {
    //     scriptExist = true;
    //   }
    // }
    // if (scriptExist === false) {
    //   (function () {
    //     var be = document.createElement("script");
    //     be.type = "text/javascript";
    //     be.src = url;
    //     var s = document.getElementsByTagName("script")[0];
    //     s.parentNode.insertBefore(be, s);
    //   })();
    // }
    // const options = {
    //   fields: [
    //     'address_components',
    //     'geometry',
    //     'icon',
    //     'name',
    //     'formatted_address'
    //   ],
    //   strictBounds: false,
    //   types: ['establishment']
    // };
    // var addressInput = document.getElementById('searchTextField');
    // setTimeout(() => {
    //   if (addressInput) {
    //     const autocomplete = new google.maps.places.Autocomplete(
    //       addressInput,
    //       options
    //     );
    //     autocomplete.addListener('place_changed', () => {
    //       that.userAddress = { ...defaultAddress };
    //       const address = addressHelper(autocomplete.getPlace());
    //       that.userAddress = address;
    //     });
    //   }
    // }, 2000);
  },
  data() {
    return {
      requestForm: {
        dr_name: null,
        dr_email: null,
        dr_mobile_number: null,
        reason: null,
        clinic_name: null,
        clinic_email: null,
        clinic_mobile_number: null,
        type: null,
        clinic_address: null,
      },
      schema: {
        dr_name: "required|alpha_spaces|min:3|max:20",
        clinic_name: "required|min:3|max:100",
        dr_email: "required|email",
        dr_mobile_number: "required|hyphen_numeric: true|min:12|max:12",
        clinic_mobile_number: "required|hyphen_numeric: true|min:12|max:12",
        clinic_email: "required|email",
        type: "required",
        clinic_address: "required",
      },
      termsCheckbox: "",
      showPopup: false,
    };
  },
  methods: {
    formattedPhoneNumber() {
      this.$nextTick(() => {
        if (
          this.requestForm.dr_mobile_number != "" &&
          this.requestForm.dr_mobile_number != null
        ) {
          let mblNo = this.requestForm.dr_mobile_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.requestForm.dr_mobile_number = mblNo;
        }

        if (
          this.requestForm.clinic_mobile_number != "" &&
          this.requestForm.clinic_mobile_number != null
        ) {
          let phoneNo = this.requestForm.clinic_mobile_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.requestForm.clinic_mobile_number = phoneNo;
        }
      });
    },
    sendRequest() {
      this.showPopup = true;
    },
    async addReferral() {
      const config = useRuntimeConfig();
      await useFetch(`${config.public.apiUrl}add-referral`, {
        method: "POST",
        body: this.requestForm,
        transform: (res) => {
          if (res.success == true) {
            if (process.client) {
              localStorage.setItem("referral_id", res.data.id);
              window.location.href = "/clinicians?ref=1";
            }
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
      });
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

input {
  vertical-align: middle;
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
