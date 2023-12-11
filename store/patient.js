import { defineStore } from "pinia";
export const usePatientStore = defineStore("patientDetail", () => {
    const patient = ref({});
    function updatePatientDetails(data) {
        patient.value = data
    }
    return { patient, updatePatientDetails }
})