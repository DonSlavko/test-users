<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-end" v-if="auth">
                    <div class="navbar-item">
                        <div class="buttons">
                            <a class="button is-primary" @click="logout">
                                <strong>Logout</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            auth: localStorage.getItem('authenticated'),
        }
    },

    watch:{
        $route (to, from){
            this.auth = localStorage.getItem('authenticated');
        }
    },

    methods: {
        logout() {
            localStorage.removeItem('authenticated');

            this.$router.push('/login');
        }
    }
};
</script>
