<template>
  <b-container class="mt-5">
    <div class="row">
      <div class="col-md-4">
        <h6 class="text-muted">ONLINE</h6>
        <ul class="list-group">
          <template v-for="user in onlineUsers">
            <li
              v-if="socket.id == user.id"
              class="list-group-item"
              :key="user.id"
            >
              {{ user.name }}
              <span class="badge badge-primary badge-pill">You</span>
            </li>

            <li
              v-else
              class="list-group-item"
              @click="showDialog(user.id)"
              :key="user.id"
            >
              {{ user.name }}
            </li>
          </template>
        </ul>
      </div>
      <div class="col-md-8">
        <div v-if="quizRole" class="card text-center">
          <div class="card-header">Live Quiz - {{ quizRole }}</div>
          <div class="card-body">
            <div v-if="quizRole === 'Owner'">
              <h4 class="text-muted" v-if="question">
                {{ question }}
              </h4>
              <div v-if="!awaitingQuestion">
                <button @click="respondToQuiz('Yes')" class="btn btn-primary">
                  Yes
                </button>
                <button @click="respondToQuiz('No')" class="btn btn-danger">
                  No
                </button>
              </div>
              <h4 v-else class="text-muted">Waiting for question</h4>
            </div>

            <div v-else>
              <div v-if="awaitingAnswer">
                <h5 class="text-muted">Waiting for an answer.</h5>
              </div>
              <div v-else>
                <button
                  v-if="quiz.questionsAsked < 20"
                  @click="askAQuestion"
                  class="btn btn-primary"
                >
                  Ask A Question
                </button>
                <button @click="submitAnswer" class="btn btn-info">
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            Questions Asked: {{ quiz.questionsAsked }}
          </div>
        </div>
        <div v-else class="d-flex justify-content-center align-items-center">
          No live quiz, click on any user to start
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import { apiUrl } from "../util/constants";
import io from "socket.io-client";
import { isLoggedIn, getToken, deleteToken } from "../util/authHelper";
export default {
  mounted() {
    this.socket = io(`${apiUrl}`);
    this.loggedIn = isLoggedIn();

    this.socket.on("user joined", message => {
      this.Toast.fire({
        icon: "success",
        title: message
      });
    });

    this.socket.on("user left", message => {
      this.Toast.fire({
        icon: "error",
        title: message
      });
    });

    this.socket.on("unauthorized", id => {
      if (id === 0) {
        if (this.loggedIn) {
          this.socket.emit("token", getToken());
        }
      }
    });

    this.socket.on("users updated", users => {
      this.onlineUsers = users;
    });

    this.socket.on("new guess", guess => {
      this.quiz = guess;
    });

    this.socket.on("question asked", payload => {
      const { question, quizId } = payload;
      if (quizId !== this.quiz.quizId) {
        return false;
      }
      this.question = question;
      this.quiz.questionsAsked++;
      this.awaitingQuestion = false;
    });

    this.socket.on("quiz replied", payload => {
      const { quizId, value } = payload;
      this.Dialog.fire({
        icon: "success",
        title: value
      });

      if (quizId !== this.quiz.quizId) {
        return false;
      }
      this.awaitingAnswer = false;
      this.question = "";
      this.awaitingQuestion = true;
    });

    this.socket.on("correct guess", () => {
      // const { quizId, value } = payload;
      this.Swal.fire(
        "Correct!",
        this.quizRole === "Player"
          ? "You guessed it correct."
          : "Guess was correct",
        "success"
      );
      this.quiz = {};
      this.qustion = "";
      this.awaitingQuestion = true;
      this.awaitingAnswer = false;
    });

    this.socket.on("incorrect guess", () => {
      // const { quizId, value } = payload;
      this.Swal.fire("Oops!", "Better luck next time.", "error");
      this.quiz = {};
      this.qustion = "";
      this.awaitingQuestion = true;
      this.awaitingAnswer = false;
    });
  },

  data() {
    return {
      loggedIn: false,
      socket: null,
      onlineUsers: [], // List of all online users
      quiz: {}, // Current live guess
      question: "", // Question to be asked by player
      awaitingAnswer: false, // Player waiting for answer on a question they asked
      awaitingQuestion: true // Owner waiting for question on a guess they started.
    };
  },

  methods: {
    logout() {
      deleteToken();
      location.reload();
    },

    // Prompt to start a new guess
    showDialog: function(player) {
      this.Swal.fire({
        title: "Enter word to be guessed",
        input: "text",
        inputLabel: "Answer",
        showCancelButton: true,
        inputValidator: value => {
          if (!value) {
            return "You need to write something!";
          }
        }
      }).then(response => {
        if (!response.value) return;
        this.socket.emit("new", {
          player,
          answer: response.value
        });
      });
    },

    // Prompt to show question this.dialog to help in guess
    askAQuestion() {
      this.Swal.fire({
        title: "Enter your question",
        input: "text",
        inputLabel: "Question",
        showCancelButton: true,
        inputValidator: value => {
          if (!value) {
            return "You need to write something!";
          }
        }
      }).then(response => {
        if (!response.value) return;
        this.socket.emit("ask question", {
          question: response.value,
          quizId: this.quiz.quizId
        });
        this.quiz.questionsAsked++;
        this.awaitingAnswer = true;
      });
    },

    submitAnswer() {
      this.Swal.fire({
        title: "Enter word to be guessed",
        input: "text",
        inputLabel: "Answer",
        showCancelButton: true,
        inputValidator: value => {
          if (!value) {
            return "You need to write something!";
          }
        }
      }).then(response => {
        if (!response.value) return;
        this.socket.emit("submit answer", {
          quizId: this.quiz.quizId,
          answer: response.value
        });
      });
    },

    // Reply to a question asked by player
    respondToQuiz(response) {
      this.socket.emit("quiz reply", {
        quizId: this.quiz.quizId,
        value: response
      });
      this.awaitingQuestion = true;
      this.question = "";
    }
  },

  computed: {
    quizRole: function() {
      if (Object.keys(this.quiz).length) {
        if (`${this.quiz.owner.id}` === `${this.socket.id}`) {
          return "Owner";
        }
        return "Player";
      }
      return false;
    }
  }
};
</script>

<style></style>
