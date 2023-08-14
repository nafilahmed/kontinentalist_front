<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Email</v-label>
            <v-text-field v-model="this.email" variant="outlined" color="primary"  :rules="emailRules" required ></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Password</v-label>
            <v-text-field v-model="this.password" variant="outlined" type="password" hide-details color="primary" :rules="emailRules" required ></v-text-field>
        </v-col>

        <v-col cols="12" class="pt-0">
            <v-btn @click="loginUser" color="primary" size="large" block flat>Sign in</v-btn>
        </v-col>
    </v-row>
</template>

<script>
    import axios from 'axios';
    import http from '@/services/http.ts';
    import {useAuth} from '@/stores/auth.ts';
    import router from '@/router';

    export default {
        name : 'LoginForm',
        data()
        {
            return {
                emailRules: [ 
                    v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length > 4) || '4 chars minimum',
                ],
                email: '',
                password: '',
                auth : useAuth(),

            }
        },
        methods : {

            loginUser: async function (){
                let {data} = await http.post('/login',{
                    "email" : this.email,
                    "password" : this.password
                });
                if(data.status == 200){
                    console.log(data.token)
                    this.auth.setToken(data.token);
                    router.push('/stories')
                }
            }
        }
    }

</script>