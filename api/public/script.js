/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const Dialog = Swal.mixin({
    title: 'Oh no!',
    confirmButtonText: 'Okay'
});

const Prompt = Swal.mixin({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
});

window.Toast = Toast;
window.Dialog = Dialog;
window.Prompt = Prompt;

var app = new Vue({
    el: '#app',
    data: {
        page: 'Login',
        socket: socket,
        loggedIn: false,

        dashboard: {
            onlineUsers: [], // List of all online users
            quiz: {}, // Current live guess
            question: '', // Question to be asked by player
            awaitingAnswer: false, // Player waiting for answer on a question they asked
            awaitingQuestion: true // Owner waiting for question on a guess they started.
        },

        login: {
            email: '',
            password: ''
        },

        register: {
            email: '',
            password: '',
            name: ''
        }
    },

    mounted: function () {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            this.loggedIn = true;
            this.page = 'Dashboard';
        } else {
            this.loggedIn = false;
            this.page = 'Login';
        }

        socket.on('user joined', (message) => {
            Toast.fire({
                icon: 'success',
                title: message
            });
        });

        socket.on('user left', (message) => {
            Toast.fire({
                icon: 'error',
                title: message
            });
        });

        socket.on('unauthorized', (id) => {
            if (id === 0) {
                if (this.loggedIn) {
                    const token = localStorage.getItem('authToken')
                    socket.emit('token', token);
                }
            }
        });

        socket.on('users updated', (users) => {
            this.dashboard.onlineUsers = users;
        });

        socket.on('new guess', (guess) => {
            this.dashboard.quiz = guess;
        });

        socket.on('question asked', (payload) => {
            const { question, quizId } = payload;
            if (quizId !== this.dashboard.quiz.quizId) {
                return false;
            }
            this.dashboard.question = question;
            this.dashboard.quiz.questionsAsked++;
            this.dashboard.awaitingQuestion = false;
        });

        socket.on('quiz replied', (payload) => {
            const { quizId, value } = payload;
            Dialog.fire({
                icon: 'Success',
                title: value
            });

            if (quizId !== this.dashboard.quiz.quizId) {
                return false;
            }
            this.dashboard.awaitingAnswer = false;
            this.dashboard.question = '';
            this.dashboard.awaitingQuestion = true;
        })

        socket.on('correct guess', (payload) => {
            const { quizId, value } = payload;
            Swal.fire(
                'Correct!',
                this.quizRole === 'Player' ? 'You guessed it correct.' : 'Guess was correct',
                'success'
            );
            this.dashboard.quiz = {};
            this.dashboard.qustion = '';
            this.dashboard.awaitingQuestion = true;
            this.dashboard.awaitingAnswer = false;
        });

        socket.on('incorrect guess', (payload) => {
            const { quizId, value } = payload;
            Swal.fire(
                'Oops!',
                'Better luck next time.',
                'error'
            );
            this.dashboard.quiz = {};
            this.dashboard.qustion = '';
            this.dashboard.awaitingQuestion = true;
            this.dashboard.awaitingAnswer = false;
        });
    },

    methods: {
        doLogin () {
            axios
                .post('/login', {
                    email: this.login.email,
                    password: this.login.password
                })
                .then(res => {
                    localStorage.setItem('authToken', res.data);
                    location.reload();
                })
                .catch(e => {
                    return Swal.fire(
                        'Login Failed!',
                        e.response.data || 'Unable to login',
                        'error'
                    );
                });
        },

        doRegister () {
            axios
                .post('/register', {
                    name: this.register.name,
                    email: this.register.email,
                    password: this.register.password
                })
                .then(res => {
                    if (!res.status === 200) {
                        alert('Registration failed');
                    } else {
                        this.page = 'Login'
                    }
                })
                .catch(e => {
                    return Swal.fire(
                        'Registration Failed!',
                        e.response.data || 'Unable to register',
                        'error'
                    );
                });
        },

        logout () {
            localStorage.removeItem('authToken');
            location.reload();
        },

        // Prompt to start a new guess
        showDialog: (player) => {
            Swal.fire({
                title: 'Enter word to be guessed',
                input: 'text',
                inputLabel: 'Answer',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }
                }
            }).then(response => {
                if (!response.value) return;
                this.socket.emit('new', {
                    player,
                    answer: response.value
                });
            })
        },

        // Prompt to show question dialog to help in guess
        askAQuestion () {
            Swal.fire({
                title: 'Enter your question',
                input: 'text',
                inputLabel: 'Question',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }
                }
            })
                .then(response => {
                    if (!response.value) return;
                    this.socket.emit('ask question', {
                        question: response.value,
                        quizId: this.dashboard.quiz.quizId
                    });
                    this.dashboard.quiz.questionsAsked++;
                    this.dashboard.awaitingAnswer = true;
                })
        },

        submitAnswer () {
            Swal.fire({
                title: 'Enter word to be guessed',
                input: 'text',
                inputLabel: 'Answer',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }
                }
            }).then(response => {
                if (!response.value) return;
                this.socket.emit('submit answer', {
                    quizId: this.dashboard.quiz.quizId,
                    answer: response.value
                });
            })
        },

        // Reply to a question asked by player
        respondToQuiz (response) {
            this.socket.emit('quiz reply', { quizId: this.dashboard.quiz.quizId, value: response });
            this.dashboard.awaitingQuestion = true;
            this.dashboard.question = '';
        }
    },

    computed: {
        quizRole: function () {
            if (Object.keys(this.dashboard.quiz).length) {
                if (`${this.dashboard.quiz.owner.id}` === `${this.socket.id}`) {
                    return 'Owner';
                }
                return 'Player';
            }
            return false
        }
    }
});
