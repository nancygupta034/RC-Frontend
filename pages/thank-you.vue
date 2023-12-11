<script setup>
const { animFade, stagger, killAnimation } = useAnim();

const config = useRuntimeConfig();
const appointment = ref({});
const displayApp = ref(false);
import noImg from "assets/images/no-img.jpg";

const getAppointment = () => {
  if (process.client) {
    const reference_id = localStorage.getItem("reference_id");
    const refId = reference_id;
    if (refId != "") {
      nextTick(async () => {
        await useFetch(`${config.public.apiUrl}appointment-data/${refId}`, {
          transform: (response) => {
            if (response.success == false) {
              window.location.replace("/");
            } else {
              appointment.value = response.data;
              displayApp.value = true;
            }
            killAnimation();
            nextTick(async () => {
              await animFade();
              await stagger();
            });
          },
        });
      });
    } else {
      window.location.replace("/");
    }
  }
};

const imageError = (event) => {
  event.target.src = noImg;
};

onMounted(() => {
  getAppointment();
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});
</script>
<template>
  <div class="section pt-0 contact-section animFade" v-if="displayApp">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-11 col-xl-9 text-center">
          <div class="content fs-18 mt-5">
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>

            <h1 class="mb-0 stagger text-secondary fw-bold mt-1 mb-3">
              Thank You
            </h1>

            <div class="stagger">
              <p class="fs-24 fw-bold ff-heading mb-2 text-black">
                Your appointment has been scheduled successfully!
              </p>
              <p>A confirmation email has been sent to your email-id.</p>

              <div class="card text-start shadow-sm">
                <div class="card-body p-0 overflow-hidden">
                  <div class="row g-0">
                    <div class="col-12 col-md-6 p-4">
                      <div class="aInfo">
                        <h4>
                          {{ $dayjs(appointment.date).format("MMM DD, YYYY") }}
                          at {{ appointment.time }}
                        </h4>
                        <h4 class="price">
                          Charges: ${{
                            appointment.clinician.charges_per_session
                          }}
                        </h4>
                        <div class="cInfo">
                          Location: {{ appointment.location_data.name }}<br />
                          Payment mode: {{ appointment.payment_mode }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 p-4 bg-primary">
                      <h6>Appointment with</h6>
                      <div class="clinicianBox">
                        <div class="row align-items-center g-3">
                          <div class="col-auto">
                            <div class="cImg">
                              <img
                                :src="`${config.public.backendAssetUrl}${appointment.clinician.image}`"
                                class="img-fluid"
                                alt=""
                                @error="imageError"
                                v-if="appointment.clinician.image"
                              />
                              <img
                                :src="noImg"
                                class="w-100"
                                alt="Image Name"
                                v-else
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
                              <a
                                :href="`mailto:${appointment.clinician.email}`"
                                v-if="
                                  appointment.clinician.email &&
                                  appointment.clinician.email != 'null'
                                "
                                >{{ appointment.clinician.email }}</a
                              ><br />
                              <a
                                :href="`tel:${appointment.clinician.phone_no}`"
                                v-if="
                                  appointment.clinician.phone_no &&
                                  appointment.clinician.phone_no != 'null'
                                "
                                >{{ appointment.clinician.phone_no }}</a
                              >
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
        </div>
      </div>
    </div>
  </div>
</template>
