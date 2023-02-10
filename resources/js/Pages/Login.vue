<template>
    <div class="columns">
        <div class="column"></div>
        <div class="column is-half">
            <div class="box">
                <p class="help is-danger" v-if="error">{{ error }}</p>

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input type="email" name="email" class="input"
                               :class="{'is-danger': msg['email']}"
                               v-model="email">
                    </div>
                    <p class="help is-danger" v-if="msg['email']">{{ msg['email'] }}</p>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input type="password" name="password" class="input"
                               :class="{'is-danger': msg['password']}"
                               v-model="password">
                    </div>
                    <p class="help is-danger" v-if="msg['password']">{{ msg['password'] }}</p>
                </div>

                <button class="button is-success" :disabled="!canLogin" @click="login">Login</button>
            </div>
        </div>
        <div class="column"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',

            msg: [],
            error: null,
        }
    },

    computed: {
        canLogin() {
            let formData = this.email !== "" && this.password !== "";
            let passValidation = Object.values(this.msg).every(x => x === null);

            return passValidation && formData;
        }
    },

    watch: {
        "email"(email) {
            this.validateEmail(email)
        },
        "password"(password) {
            this.validatePassword(password)
        },
    },

    methods: {
        validateEmail(value){
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
            {
                this.msg['email'] = null;
            } else{
                this.msg['email'] = 'Invalid Email Address';
            }
        },
        validatePassword(value) {
            if (value.length < 8) {
                this.msg['password'] = 'Password need to be at least 8 char long';
            } else {
                this.msg['password'] = null;
            }
        },

        login() {
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/api/auth/login', {
                    email: this.email,
                    password: this.password
                }).then((response) => {
                    let token = response.data.token;

                    localStorage.setItem('authenticated', token);

                    this.$router.push('/');
                }).catch((error) => {
                    this.error = error.response.data.message;
                });
            });
        }
    }
}
</script>

<style scoped>

</style>
