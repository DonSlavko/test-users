<template>
    <div class="box">
        <button class="button is-primary" @click="openCreate">
            Create User
        </button>

        <table class="table is-fullwidth">
            <thead>
            <tr>
                <th>Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Birthdate</th>
                <th>Options</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users">
                <th>{{ user.id }}</th>
                <th>{{ user.first_name }}</th>
                <th>{{ user.last_name }}</th>
                <th>{{ user.email }}</th>
                <th>{{ user.phone }}</th>
                <th>{{ user.birthdate }}</th>
                <th>
                    <button class="button is-small is-outlined is-primary" @click="openEdit(user)">
                        Edit User
                    </button>
                </th>
            </tr>
            </tbody>
        </table>

        <div id="modal-user-form" class="modal" :class="{'is-active': modalActive}">
            <div class="modal-background" @click="close"></div>
            <div class="modal-card" @click.stop="">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ editUser ? 'Edit User' : 'Create User' }}</p>
                    <button class="delete" @click="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">First Name</label>
                                <div class="control">
                                    <input type="text" name="first_name" class="input"
                                           :class="{'is-danger': msg['first_name']}"
                                           v-model="formData.first_name">
                                </div>
                                <p class="help is-danger" v-if="msg['first_name']">{{ msg['first_name'] }}</p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Last Name</label>
                                <div class="control">
                                    <input type="text" name="last_name" class="input"
                                           :class="{'is-danger': msg['last_name']}"
                                           v-model="formData.last_name">
                                </div>
                                <p class="help is-danger" v-if="msg['last_name']">{{ msg['last_name'] }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">Email</label>
                                <div class="control">
                                    <input type="email" name="email" class="input"
                                           :class="{'is-danger': msg['email']}"
                                           v-model="formData.email">
                                </div>
                                <p class="help is-danger" v-if="msg['email']">{{ msg['email'] }}</p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Password</label>
                                <div class="control">
                                    <input type="password" name="password" class="input"
                                           :class="{'is-danger': msg['password']}"
                                           v-model="formData.password">
                                </div>
                                <p class="help is-danger" v-if="msg['password']">{{ msg['password'] }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">Phone</label>
                                <div class="control">
                                    <input type="tel" name="phone" class="input"
                                           :class="{'is-danger': msg['phone']}"
                                           v-model="formData.phone">
                                </div>
                                <p class="help is-danger" v-if="msg['phone']">{{ msg['phone'] }}</p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Birthdate</label>
                                <div class="control">
                                    <input type="date" name="birthdate" class="input"
                                           :class="{'is-danger': msg['birthdate']}"
                                           v-model="formData.birthdate">
                                </div>
                                <p class="help is-danger" v-if="msg['birthdate']">{{ msg['birthdate'] }}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" :disabled="!canSave" @click="save">Save</button>
                    <button class="button" @click="close">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modalActive: false,
            editUser: false,

            users: [],

            formData: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: null,
                birthdate: null,
            },

            msg: [],

            auth: localStorage.getItem('authenticated')
        }
    },

    computed: {
        canSave() {
            let fullData = 0;

            let totalData = Object.keys(this.formData).length;

            Object.values(this.formData).forEach((data) => {
                if (data) {
                    fullData++
                }
            });

            let passValidation = Object.values(this.msg).every(x => x === null);

            return passValidation && fullData === totalData;
        }
    },

    mounted() {
        this.initData()
    },

    watch: {
        "formData.first_name"(first_name) {
            this.validateFirstName(first_name)
        },
        "formData.last_name"(last_name) {
            this.validateLastName(last_name)
        },
        "formData.email"(email) {
            this.validateEmail(email)
        },
        "formData.password"(password) {
            this.validatePassword(password)
        },
        "formData.phone"(phone) {
            this.validatePhone(phone)
        },
        "formData.birthdate"(birthdate) {
            this.validateBirthdate(birthdate)
        }
    },

    methods: {
        initData() {
            axios.defaults.headers.common = {
                'Authorization': `bearer ${this.token}`,
                'Content-Type': 'application/json'
            }

            axios.get('/api/users',).then((response) => {
                this.users = response.data.data;
            }).catch((error) => {

            })
        },

        validateFirstName(value) {
            if (value.length < 3) {
                this.msg['first_name'] = 'First Name has to be longer than 2 chars';
            } else {
                this.msg['first_name'] = null;
            }
        },
        validateLastName(value) {
            if (value.length < 3) {
                this.msg['last_name'] = 'Last Name has to be longer than 2 chars';
            } else {
                this.msg['last_name'] = null;
            }
        },
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
        validatePhone(value) {
            const validationRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
            if (!value) {
                this.msg['phone'] = "Phone number can't be empty";
            } else if (value.match(validationRegex)) {
                this.msg['phone'] = null;
            } else {
                this.msg['phone'] = 'Phone number is not correct';
            }
        },
        validateBirthdate(value) {
            const regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!value) {
                this.msg['birthdate'] = 'Please select date';
            } else if (!value.match(regEx)) {
                this.msg['birthdate'] = 'Invalid Date';
            } else {
                this.msg['birthdate'] = null;
            }
        },

        openCreate() {
            this.formData = {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: null,
                birthdate: null,
            };

            this.modalActive = true;
        },
        openEdit(user) {

            this.formData = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: "",
                phone: user.phone,
                birthdate: user.birthdate,
            };

            this.editUser = user.id;
            this.modalActive = true;
        },
        close() {
            this.formData = {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: null,
                birthdate: null,
            };

            this.editUser = false;
            this.modalActive = false;
            setTimeout(() => {
                this.msg = [];
            }, 100)
        },
        save() {
            if (this.editUser) {
                axios.put('/api/users/' + this.editUser, {
                    ...this.formData
                }).then((_) => {
                    this.close();
                    this.initData();
                });
            } else {
                axios.post('/api/users', {
                    ...this.formData
                }).then((_) => {
                    this.close();
                    this.initData();
                });
            }
        }
    }
}
</script>
