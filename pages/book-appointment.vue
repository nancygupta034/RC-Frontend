<script setup>
import Step1 from "@components/appointment/Step1.vue";
import Step2 from "@components/appointment/Step2.vue";
import Step3 from "@components/appointment/Step3.vue";
const { animFade, stagger, killAnimation } = useAnim();
const currentStep = ref(1);
const completedSteps = ref(0);
const paymentMethod = ref("Self Pay");
onMounted(() => {
  animFade();
  stagger();
  if (process.client) {
    const paymentMode = localStorage.getItem("isInsurance");
    paymentMethod.value = paymentMode == "insurance" ? "Insurance" : "Self Pay";
  }
});

const gotToStep2 = () => {
  if (process.client) {
    let activeStep2 = true;
    let patientDetails = localStorage.getItem("patientDetails");
    if (patientDetails != "") {
      patientDetails = JSON.parse(patientDetails);
      if (patientDetails != null) {
        if (
          patientDetails.first_name == "" ||
          patientDetails.last_name == "" ||
          patientDetails.last_name == undefined ||
          patientDetails.email == "" ||
          patientDetails.dob == "" ||
          patientDetails.home_phone == "" ||
          patientDetails.mobile_number == ""
        ) {
          activeStep2 = false;
        }
      } else {
        activeStep2 = false;
      }
    } else {
      activeStep2 = false;
    }
    currentStep.value = activeStep2 == true ? 2 : currentStep.value;
    completedSteps.value = (activeStep2 == true ? (completedSteps.value >= 2 ? completedSteps.value : 1) : completedSteps.value);
  }
};

const gotToStep3 = () => {
  if (process.client) {
    let activeStep3 = true;
    let patientDetails = localStorage.getItem("patientDetails");
    if (patientDetails != "") {
      patientDetails = JSON.parse(patientDetails);
      if (patientDetails != null) {
        if (
          patientDetails.service_id == "" ||
          patientDetails.selectedSlot == "" ||
          patientDetails.time == "" ||
          patientDetails.start_date_time == "" ||
          patientDetails.date == ""
        ) {
          activeStep3 = false;
        }
      } else {
        activeStep3 = false;
      }
    } else {
      activeStep3 = false;
    }
    currentStep.value = activeStep3 == true ? 3 : currentStep.value;
    completedSteps.value = (activeStep2 == true ? (completedSteps.value >= 2 ? completedSteps.value : 2) : completedSteps.value);
  }
};

// onBeforeUnmount(() => {
//   killAnimation();
// });
</script>
<template>
  <div class="section-appointment">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12">
          <ul class="steps">
            <li
              :class="(currentStep === 1 ? 'active' : (completedSteps >= 1 ? 'enabled-step' : 'disabled-step'))"
              @click="currentStep = 1"
            >
              <span>1</span> Your Contact Details
            </li>
            <li
              :class="(currentStep === 2 ? 'active' : (completedSteps >= 1 ? 'enabled-step' : 'disabled-step'))"
              @click="gotToStep2()"
            >
              <span>2</span> Type of Service
            </li>
            <li
              :class="(currentStep === 3 ? 'active' : (completedSteps >= 2 ? 'enabled-step' : 'disabled-step'))"
              @click="gotToStep3()"
              v-if="paymentMethod == 'Insurance'"
            >
              <span>3</span> Insurance Info
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="section-formBox">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-11 col-xl-10">
          <!-- Contact Detail -->
          <Step1 v-if="currentStep == 1" @nextStep="currentStep = 2;completedSteps = 1" />
          <!-- Contact Detail Ends -->

          <!-- Services Detail -->
          <Step2 v-if="currentStep == 2" @nextStep="currentStep = 3;completedSteps = 2" />
          <!-- Services Ends -->

          <!-- Insurance Info -->
          <Step3 v-if="currentStep == 3" />
          <!-- Insurance Info Ends -->
        </div>
      </div>
    </div>
  </div>
</template>
