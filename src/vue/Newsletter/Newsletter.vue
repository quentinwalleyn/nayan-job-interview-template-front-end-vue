<template>
<form class="" v-on:submit.prevent="submitForm" method="post">
  <input type="email" name="input" value="" v-model="email" placeholder="Enter your email">
  <input type="submit" name="submit" value="">
</form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: ''
    };
  },
  methods: {
    submitForm() {
      axios.post('/api/newsletter-subscribe/?email=' + this.email)
      .then(response => {
        this.success = "You've been subscribed to our newsletter!";
        this.response = JSON.stringify(response, null, 2)
      }).catch(error => {
        this.response = 'Error: ' + error.response.status
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Newsletter.scss';
</style>
