<script setup>
import innerHero from "assets/images/hero-blog.jpg";
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
  <section
    class="section blog-section inner-section animFade"
    :style="`background-image: url(${innerHero});`"
  >
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="innsec-title mb-0 stagger">Contact Us</h1>
        </div>
      </div>
    </div>
  </section>

  <div class="section contact-section animFade">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-11 col-xl-9 text-center">
          <NuxtLink class="btn btn-primary rounded-2"
            ><i class="bi bi-calendar2-check me-2"></i> Looking to
            schedule?</NuxtLink
          >
          <div class="content fs-18 mt-5">
            <p class="fs-24 fw-bold ff-heading text-black">
              Responsive Centers is open 8:00 a.m. - 5:00 p.m. Monday through
              Friday.
            </p>
            <p>
              Appointments vary by clinician. Please use the link above to
              schedule and request new client appointments or create follow-up
              appointments through the myHealthspot client portal.
            </p>
            <p>
              For questions regarding scheduling and clinician information,
              please call
              <NuxtLink
                to="tel:(913)451-8550"
                class="text-secondary"
                target="_blank"
                ><b>(913)451-8550</b></NuxtLink
              >
              and our caring staff will return your call as soon as possible.
            </p>
            <p>
              For general inquiries regarding community involvement and
              partnerships, please email
              <NuxtLink
                to="mailto:info@responsivecenters.com"
                class="text-secondary"
                target="_blank"
                ><b>info@responsivecenters.com</b></NuxtLink
              >.
            </p>
          </div>

          <!-- <div class="form-black contact-form mt-5">
                        <Form action="" v-slot="{ errors }" @submit="frmContact">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <div class="form-group">
                                        <div class="label-wrap">
                                            <Field name="firstName" :class="{'has-error': errors.firstName}" class="form-control" rules="required" />
                                            <label for="">First Name*</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="form-group">
                                        <div class="label-wrap">
                                            <input type="text" class="form-control">
                                            <label for="">Last Name*</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="form-group">
                                        <div class="label-wrap">
                                            <Field name="email" type="email" :class="{'has-error': errors.email}" class="form-control" rules="required|email" />
                                            <label for="">Email Address*</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="form-group">
                                        <div class="label-wrap">
                                            <Field name="number" type="tel" :class="{'has-error': errors.number}" class="form-control" rules="required|min:10|max:10" />
                                            <label for="">Phone No*</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <div class="label-wrap">
                                            <textarea name="" id="" cols="30" rows="6" class="form-control"></textarea>
                                            <label for="">Message (If any)</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group mb-0 text-center">
                                        <button type="submit" class="btn min-w-114 btn-primary rounded-2">Submit <i class="bi bi-send ms-2"></i></button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div> -->
        </div>
      </div>
    </div>
  </div>

  <div class="section pt-0 animFade">
    <div class="map-wrapper ratio" style="--bs-aspect-ratio: 30%">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.8665935854665!2d-94.6734125!3d38.9270266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0ea4f0abca8bf%3A0xe7d95dd010ebc606!2s7501%20College%20Blvd%20%23250%2C%20Overland%20Park%2C%20KS%2066210%2C%20USA!5e0!3m2!1sen!2sin!4v1691481472388!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>
