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
            onlineUsers: [],
            requests: []
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

        socket.on('chat message', function (msg) {
            console.log('Message:', msg);
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
        })
    },

    methods: {

        doLogin () {
            axios
                .post('/login', {
                    email: this.login.email,
                    password: this.login.password
                })
                .then(res => {
                    if (res.status === 200) {
                        localStorage.setItem('authToken', res.data);
                        location.reload();
                    } else {
                        alert('Login failed');
                    }
                })
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
        },

        logout () {
            localStorage.removeItem('authToken');
            location.reload();
        }
    }
});
