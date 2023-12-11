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
                  It seems like you do not have upcoming pending booking. To
                  book an appointment please click
                  <a href="/clinicians" class="text-secondary">here</a>.
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
                <h2>Check Appointment</h2>
                <p class="mb-5">
                  Please fill up the details below to get your appointment
                  details:
                </p>
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
        `${config.public.apiUrl}patient-appointment?name=${this.patientForm.name}&email=${this.patientForm.email}`,
        {
          method: "GET",
          transform: (res) => {
            this.submittingForm = false;
            console.log("res => ", res);
            if (res.success == false) {
              this.userExists = true;
            } else {
              const encryptedData = btoa(res.data.id);
              // const decryptedData = atob(encryptedData);
              // console.log("decryptedData => ", decryptedData)
              this.$router.push({ path: `/appointments/${encryptedData}` });
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
