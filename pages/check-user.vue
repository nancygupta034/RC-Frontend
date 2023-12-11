<script setup>
const { animFade, stagger, killAnimation } = useAnim();

onMounted(() => {
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});
</script>
<template>
  <div class="section-login">
    <div class="blueBg">
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div class="col-12 col-md-5">
            <div class="loginBox">
              <div v-if="userExists">
                <h2>Hi {{ patientForm.name }},</h2>
                <p>
                  It seems like you have already registered with us. Please
                  contact at
                  <a
                    href="mailto:booking@responsivecenters.com"
                    class="text-secondary"
                    >booking@responsivecenters.com</a
                  >
                  in case of any query.
                </p>
                <div class="col-12">
                  <button
                    type="submit"
                    @click.prevent="resetForm()"
                    class="btn w-100 btn-secondary d-flex justify-content-center"
                  >
                    Try with another User
                  </button>
                </div>
              </div>
              <div v-if="!userExists">
                <h2>Book an Appointment</h2>
                <p class="mb-5">Please fill up the details below:</p>
                <div class="form-wrapper">
                  <div class="form-black">
                    <Form :validation-schema="schema" @submit="getPatient">
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group">
                            <div class="label-wrap">
                              <Field
                                type="text"
                                class="form-control"
                                name="name"
                                v-model="patientForm.name"
                              />
                              <label for="">Name<span>*</span></label>
                            </div>
                            <div class="error invalid-feedback">
                              <ErrorMessage
                                class="invalid-feedback"
                                name="name"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="form-group">
                            <div class="label-wrap">
                              <Field
                                type="email"
                                class="form-control"
                                name="email"
                                v-model="patientForm.email"
                              />
                              <label for=""
                                >Registered Email ID<span>*</span></label
                              >
                            </div>
                            <div class="error invalid-feedback">
                              <ErrorMessage
                                class="invalid-feedback"
                                name="email"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <button
                            type="submit"
                            class="btn w-100 btn-secondary d-flex justify-content-center"
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
                            {{ submittingForm ? "Submitting" : "Submit" }}
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { usePatientStore } from "~/store/patient";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  data() {
    return {
      patientForm: {
        name: null,
        email: null,
      },
      existingPatientDetails: {},
      schema: {
        name: "required|min:3|max:20",
        email: "required|email",
      },
      submittingForm: false,
      userExists: false,
    };
  },
  mounted() {},
  methods: {
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
</style>
