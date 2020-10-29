<template>
  <b-container class="mt-5">
    <h1 class="text-center">Login</h1>
    <b-row>
      <b-col>
        <b-form @submit.prevent="onSubmit">
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="registerEmail"
          >
            <b-form-input
              id="loginEmail"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-password"
            label="Password:"
            label-for="loginPassword"
          >
            <b-form-input
              id="loginPassword"
              v-model="form.password"
              required
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Login</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { setToken } from "../util/authHelper";
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },

  methods: {
    onSubmit() {
      this.axios
        .post("/login", {
          email: this.form.email,
          password: this.form.password
        })
        .then(res => {
          if (!res.status === 200) {
            return this.Swal.fire(
              "Login Failed!",
              res.message || "Unable to Login",
              "error"
            );
          } else {
            setToken(res.data);
            this.$router.push("/dashboard");
          }
        })
        .catch(e => {
          return this.Swal.fire(
            "Login Failed!",
            (e.response && e.response.data) || "Unable to login",
            "error"
          );
        });
    }
  }
};
</script>
