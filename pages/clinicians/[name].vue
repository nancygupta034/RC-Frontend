<script setup>
import noImg from "assets/images/no-img.jpg";
const { animFade, stagger, killAnimation } = useAnim();
const config = useRuntimeConfig();
const { name } = useRoute().params;
const servicesProvided = ref([]);
const displayLoader = ref(true);
var clinician = ref({});
var displayInsurance = ref(false);

nextTick(async () => {
  const locationId = localStorage.getItem("location");
  await useFetch(
    `${config.public.apiUrl}clinician/${name}?location=${locationId}&slots=true`,
    {
      transform: (res) => {
        clinician.value = res.data;
        if (process.client) {
          let patientData = localStorage.getItem("patientDetails");
          if (patientData != "") {
            patientData = JSON.parse(patientData);
            if (patientData != null) {
              if (
                locationId == "" ||
                locationId == null ||
                locationId == undefined
              ) {
                localStorage.setItem(
                  "location",
                  res.data.locations[0].location.azalea_id
                );
              }
              patientData.clinician_id = res.data.id;
              patientData.tru_billing_id = res.data.tru_billing_id;
              patientData.practitioner_id = res.data.azalea_id;
              patientData.practitioner_name = res.data.name;
              localStorage.setItem(
                "patientDetails",
                JSON.stringify(patientData)
              );
            }
          }
        }
        displayLoader.value = false;
        return res.data;
      },
    }
  );
  await useFetch(`${config.public.apiUrl}services-provided`, {
    transform: (res) => {
      servicesProvided.value = res.data.data;
    },
  });
});

if (process.client) {
  const isInsurance = localStorage.getItem("isInsurance");
  displayInsurance = isInsurance == "insurance" ? true : false;
}

onMounted(() => {
  animFade();
  stagger();
});

onBeforeUnmount(() => {
  killAnimation();
});

const imageError = (event) => {
  event.target.src = noImg;
};

const bookNow = (slot, clinician) => {
  if (process.client) {
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
    window.location.href = `/check-user`;
  }
};

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
  <div class="loader" v-show="displayLoader">
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

  <section class="section animFade" v-show="!displayLoader">
    <div class="container">
      <div class="row gy-5 gx-4 gx-xxl-5">
        <div class="col-12 col-lg">
          <div class="card card-start card-detail bg-transparent border-0">
            <div class="clinician-bio pb-5">
              <div class="row gy-4 gx-4 gx-xxl-5">
                <div class="col-12 col-md-auto order-sm-1 order-1 stagger">
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
                <div class="col-12 col-xl order-sm-2 order-2 stagger">
                  <div class="card-body px-0 py-2">
                    <div
                      class="card-title fs-30 pb-0 mb-0 ff-heading fw-bold text-secondary"
                    >
                      {{ clinician.name }}
                      <span>{{ clinician.qualification }}</span>
                    </div>
                    <div class="card-des fs-21 mb-3">
                      <div class="price">
                        ${{ clinician.charges_per_session }}
                      </div>
                      <div class="contactInfo">
                        <b>Email:</b> {{ clinician.email }}<br />
                        <b>Phone No.:</b> {{ clinician.phone_no }}
                      </div>
                    </div>
                    <div class="ages white">
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
                  </div>
                </div>
                <div class="col-12 col-xl-4 order-sm-3 order-4 card-3">
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
                                location.slots.length
                                  ? location.slots[0].date
                                  : ""
                              }}
                            </div>
                          </div>
                          <div class="col-auto">
                            <div class="card-fbtn">
                              <NuxtLink
                                class="btn btn-sm btn-secondary"
                                @click.prevent="
                                  bookNow(location.slots[0], clinician)
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
                <div class="col-12 fs-16 order-sm-4 order-3">
                  <div v-html="clinician.bio"></div>
                </div>
              </div>
            </div>

            <div class="card-info-wrapper pt-5">
              <div class="row g-4" ref="gridRef">
                <div class="col-12 col-xl-3 d-flex stagger">
                  <div class="card card-box w-100 bg-tranparent">
                    <div class="card-body py-0">
                      <div class="card-title">Specialities</div>
                      <div class="card-text content">
                        <ul class="card-ul">
                          <li
                            v-for="(specialty, index) in clinician.specialties"
                            :key="index"
                          >
                            {{ specialty.speciality.name }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-xl-3 d-flex stagger" v-if="clinician.is_insurance != '0'">
                  <div class="card card-box w-100 bg-tranparent">
                    <div class="card-body py-0">
                      <div class="card-title">Accepted Insurances</div>
                      <div class="card-text content">
                        <ul class="card-ul">
                          <li
                            v-for="(
                              insurance_name, index
                            ) in clinician.insurance_names"
                            :key="index"
                          >
                            {{ insurance_name[0].insurance.location }} |
                            {{ insurance_name[0].insurance.name }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-xl-3 d-flex stagger">
                  <div class="card card-box w-100 bg-tranparent">
                    <div class="card-body py-0">
                      <div class="card-title">Age Ranges</div>
                      <div class="card-text content">
                        <ul class="card-ul">
                          <li
                            v-for="(
                              age_covered, index
                            ) in clinician.age_covered"
                            :key="index"
                          >
                            {{ age_covered.age_range.text }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-xl-3 d-flex stagger">
                  <div class="card card-box w-100 bg-textDrak bg-tranparent">
                    <div class="card-body py-0">
                      <div class="card-title">Services Provided</div>
                      <div class="card-text content">
                        <ul class="card-ul">
                          <li
                            v-for="(
                              services_provided, index
                            ) in clinician.services_provided"
                            :key="index"
                          >
                            {{ services_provided.service_provided.name }}
                          </li>
                        </ul>
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
  </section>
</template>
