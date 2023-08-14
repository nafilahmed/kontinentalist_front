
<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Name</v-label>
            <v-text-field v-model="this.name" variant="outlined" :rules="nameRules" required color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Email Address</v-label>
            <v-text-field v-model="this.email" variant="outlined" type="email" :rules="emailRules" required color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Password</v-label>
            <v-text-field v-model="this.password" variant="outlined" type="password" :rules="passwordRules" required color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" >
            <v-btn @click="registerUser" color="primary" size="large" block flat>Sign up</v-btn>
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
                nameRules: [
                    v => !!v || 'Name is required',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length > 4) || '4 chars minimum',
                ],
                email: '',
                password: '',
                name: '',
                auth : useAuth(),

            }
        },
        methods : {

            registerUser: async function (){
                let {data} = await http.post('/register',
                {
                    "email" : this.email,
                    "password" : this.password,
                    "name" : this.name
                });
                if(data.status == 200){
                    this.auth.setToken(data.access_token);
                    console.log(this.auth.token)
                    router.push('/stories')
                }
            }
        }
    }

</script>