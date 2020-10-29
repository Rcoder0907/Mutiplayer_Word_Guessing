<template>
  <b-container class="mt-5">
    <h1 class="text-center">Register</h1>
    <b-row>
      <b-col>
        <b-form @submit.prevent="onSubmit">
          <b-form-group
            id="input-group-2"
            label="Your Name:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="form.name"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="registerEmail"
          >
            <b-form-input
              id="registerEmail"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-password"
            label="Password:"
            label-for="registerPassword"
          >
            <b-form-input
              id="registerPassword"
              v-model="form.password"
              required
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Register</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        name: "",
        password: ""
      }
    };
  },

  methods: {
    onSubmit() {
      this.axios
        .post("/register", {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        })
        .then(res => {
          if (!res.status === 200) {
            return this.Swal.fire(
              "Registration Failed!",
              res.message || "Unable to register",
              "error"
            );
          } else {
            this.$router.push("/");
          }
        })
        .catch(e => {
          return this.Swal.fire(
            "Registration Failed!",
            (e.response && e.response.data) || "Unable to register",
            "error"
          );
        });
    }
  }
};
</script>
