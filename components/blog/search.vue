<script setup>
const route = useRoute();
const searchVal = ref();
const selectVal = ref(1);

const frmSearch = () => {};
</script>
<template>
  <div class="search-section">
    <div class="container">
      <div class="search-wrapper">
        <form action="" class="h-100" @submit.prevent="frmSearch">
          <div class="row h-100">
            <div class="col-12 col-md-4 border-end">
              <select
                v-model="selectVal"
                name=""
                id=""
                class="form-select arrow-black"
              >
                <option value="1">Awareness</option>
              </select>
            </div>
            <div class="col-12 col-md">
              <div class="input-group h-100">
                <input
                  v-model="searchVal"
                  type="text"
                  class="form-control"
                  placeholder="Search by Keyword or Title ..."
                />
                <button type="submit" class="input-group-text">
                  <i class="bi bi-search fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
