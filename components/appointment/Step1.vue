<script setup>
import flatpickr from "flatpickr";
import "@node_modules/flatpickr/dist/flatpickr.min.css";
const { animFade, stagger } = useAnim();
onMounted(() => {
  animFade();
  stagger();
  flatpickr("#formCalendar", {
    altInput: true,
    // altFormat: "j F, Y",
    altFormat: "m/d/Y",
    dateFormat: "Y-m-d",
    maxDate: "2022-12-31",
    minDate: "1920-01-01",
    disableMobile: "true",
  });
});
</script>

<template>
  <!-- Contact Detail -->
  <div class="form-black whiteBox contact-form mt-2 mt-md-5">
    <h1 class="fw-bold text-secondary">Your Contact Details</h1>
    <Form :validation-schema="schema" @submit="save">
      <div class="row mt-5">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                type="text"
                class="form-control"
                name="first_name"
                v-model="patientForm.first_name"
                placeholder="First Name"
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
                v-model="patientForm.last_name"
                placeholder="Last Name"
              />
              <label for="">Last Name<span>*</span></label>
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
                type="text"
                class="form-control"
                name="email"
                v-model="patientForm.email"
                placeholder="Email"
              />
              <label for="">Email Address<span>*</span></label>
            </div>
            <div class="error invalid-feedback text-start">
              <ErrorMessage class="invalid-feedback text-start" name="email" />
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
                class="form-control icon-calendar input"
                name="dob"
                v-model="patientForm.dob"
                placeholder="MM/DD/YYYY"
              />
              <label for="">Date of Birth<span>*</span></label>
            </div>
            <div class="error invalid-feedback text-start">
              <ErrorMessage class="invalid-feedback text-start" name="dob" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <div class="label-wrap">
              <Field
                type="text"
                class="form-control"
                name="home_phone"
                v-model="patientForm.home_phone"
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
                type="text"
                class="form-control"
                name="mobile_number"
                v-model="patientForm.mobile_number"
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
        <div class="col-12 col-auto">
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
  <!-- Contact Detail Ends -->
</template>
<script>
import { usePatientStore } from "~/store/patient";
import { Form, Field, ErrorMessage } from "vee-validate";
import flatpickr from "flatpickr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "@node_modules/flatpickr/dist/flatpickr.min.css";
export default {
  scrollToTop: true,
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      patientForm: {
        date: null,
        time: null,
        endTime: null,
        first_name: null,
        last_name: null,
        email: null,
        dob: null,
        home_phone: null,
        mobile_number: null,
        service_id: null,
        clinician_id: null,
        practitioner_id: null,
        payment_mode: null,
        selectedSlot: null,
        practitioner_name: null,
        appointmentType: [],
      },
      schema: {
        first_name: "required|min:3|max:50",
        last_name: "required|min:0|max:50",
        email: "required|email",
        home_phone: "required|hyphen_numeric: true|min:12|max:12",
        mobile_number: "required|hyphen_numeric: true|min:12|max:12",
        dob: "required",
      },
    };
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (process.client) {
      let patientData = localStorage.getItem("patientDetails");
      patientData = JSON.parse(patientData);
      if (patientData != null) {
        this.patientForm.first_name = patientData.first_name;
        if (
          patientData.last_name != "" &&
          patientData.last_name != null &&
          patientData.last_name != undefined
        ) {
          this.patientForm.last_name = patientData.last_name;
        }

        this.patientForm.clinician_id = patientData.clinician_id;
        this.patientForm.email = patientData.email;
        this.patientForm.practitioner_id = patientData.practitioner_id;
        this.patientForm.tru_billing_id = patientData.tru_billing_id;
        this.patientForm.practitioner_name = patientData.practitioner_name;
        this.patientForm.selectedSlot = patientData.selectedSlot;
        this.patientForm.payment_mode = patientData.payment_mode;
        this.patientForm.service_id = patientData.service_id;
        this.patientForm.date = patientData.date;
        this.patientForm.time = patientData.time;
        this.patientForm.endTime = patientData.endTime;
        this.patientForm.appointmentType = patientData.appointmentType;
        (this.patientForm.start_date_time = patientData.start_date_time),
          (this.patientForm.end_date_time = patientData.end_date_time);

        if (patientData.dob != "" && patientData.dob != null) {
          this.patientForm.dob = patientData.dob;
          flatpickr("#formCalendar", {
            altInput: true,
            altFormat: "m/d/Y",
            dateFormat: "Y-m-d",
            maxDate: "2022-12-31",
            minDate: "1920-01-01",
            defaultDate: patientData.dob,
            disableMobile: "true",
          });
        }
        if (patientData.home_phone != "" && patientData.home_phone != null) {
          let mblNo = patientData.home_phone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.patientForm.home_phone = mblNo;
        }
        if (
          patientData.mobile_number != "" &&
          patientData.mobile_number != null
        ) {
          let mblNo = patientData.mobile_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.patientForm.mobile_number = mblNo;
        }
      }
    }
  },
  methods: {
    formattedPhoneNumber() {
      this.$nextTick(() => {
        if (
          this.patientForm.mobile_number != "" &&
          this.patientForm.mobile_number != null
        ) {
          let mblNo = this.patientForm.mobile_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.patientForm.mobile_number = mblNo;
        }

        if (
          this.patientForm.home_phone != "" &&
          this.patientForm.home_phone != null
        ) {
          let phoneNo = this.patientForm.home_phone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          );
          this.patientForm.home_phone = phoneNo;
        }
      });
    },
    save() {
      const store = usePatientStore();
      store.updatePatientDetails(this.patientForm);
      if (process.client) {
        localStorage.setItem(
          "patientDetails",
          JSON.stringify(this.patientForm)
        );
      }
      this.$emit("nextStep");
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
</style>
