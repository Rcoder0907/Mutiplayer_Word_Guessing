<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
    <b-navbar-brand>Guess It</b-navbar-brand>
    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav v-if="!isLoggedIn">
        <b-nav-item to="/">Login</b-nav-item>
        <b-nav-item to="/register">Register</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item @click.prevent="logout" href="#">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { isLoggedIn, deleteToken } from "../util/authHelper";
export default {
  mounted() {
    this.isLoggedIn = isLoggedIn();
  },

  data() {
    return {
      isLoggedIn: false
    };
  },

  methods: {
    logout() {
      deleteToken();
      return this.$router.push("/");
    }
  }
};
</script>
