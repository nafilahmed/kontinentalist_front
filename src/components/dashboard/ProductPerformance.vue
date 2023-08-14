<template>
    <v-card elevation="10" class="">
        <v-card-item class="pa-6">
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-bold">Title</th>
                    <th class="text-subtitle-1 font-weight-bold">Content</th>
                    <th class="text-subtitle-1 font-weight-bold">Status</th>
                    <th class="text-subtitle-1 font-weight-bold">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in allStories" :key="item.name" class="month-item">
                    <td>
                        <p class="text-15 font-weight-medium">{{ item.title }}</p>
                    </td>
                    <td>
                        <div class="">
                            <div class="text-13 mt-1 text-muted">{{ item.content }}</div>
                        </div>
                    </td>
                    <td>
                        <h6 class="text-body-1 text-muted">{{ item.status }}</h6>
                    </td>
                    <td>
                        <button @click="openViewModal(item.id)"><v-icon color="info" icon="mdi-eye"></v-icon></button>
                        <button v-if="item.is_edit || item.is_admin" @click="openEditModal(item.id)"><v-icon color="info" icon="mdi-pencil"></v-icon></button>
                        <button v-if="item.is_edit || item.is_admin" @click="openDeleteModal(item.id)"><v-icon color="info" icon="mdi-delete"></v-icon></button>                        
                    </td>
                </tr>
            </tbody>
        </v-table>
        </v-card-item>
    </v-card>

    <div class="text-center">
        <v-dialog v-model="this.showStory" width="auto">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{this.storyTitle}}</span>
                </v-card-title>
                <v-card-text>
                    {{this.storyContent}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showStory = false"> Close </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>


    <div class="text-center">
        <v-dialog v-model="this.editStory" width="auto">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{type}} Story</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-row class="d-flex mb-3">
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">Title</v-label>
                                <v-text-field v-model="this.storyTitle" variant="outlined" hide-details color="primary" :rules="titleRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">Content</v-label>
                                <v-textarea v-model="this.storyContent" variant="outlined" :rules="contentRules" required></v-textarea>
                            </v-col>

                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">Status</v-label>
                                <v-select v-model="this.storyStatus" :items="items" :rules="[v => !!v || 'Status is required']" required ></v-select>

                                <v-checkbox v-model="this.storyDraftView" @click="toggleViewDraft()" label="Allow other to view draft" ></v-checkbox>
                            </v-col>

                            <v-col cols="12" v-if="this.isUpdated != 0">
                            <v-alert :color="(this.isUpdated == 200) ? 'success' : 'error'" :icon="(this.isUpdated == 200) ? $success : $error" :title="this.alertMsg" ></v-alert>
                            </v-col>

                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info" variant="text" @click="(this.type == 'Create') ? createStory() : updateStory()"> {{(this.type == 'Create') ? 'Create' : 'Save'}} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>



    <div class="text-center">
        <v-dialog v-model="this.deleteStory" width="auto">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Are you Sure ?</span>
                </v-card-title>
                <v-card-text>
                    <v-col cols="12" v-if="this.isUpdated != 0">
                    <v-alert :color="(this.isUpdated == 200) ? 'success' : 'error'" :icon="(this.isUpdated == 200) ? $success : $error" :title="this.alertMsg" ></v-alert>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info" variant="text" @click="this.delete = false"> No </v-btn>
                    <v-btn color="error" variant="text" @click="deleteStoryFun()"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
    import axios from 'axios';
    import http from '@/services/http.ts';
    import {useAuth} from '@/stores/auth.ts';
    import { inject } from 'vue'
    
    export default {
        name : 'ProductPerformance',
        data()
        {
            return {
                titleRules: [
                    v => !!v || 'Title is required',
                    v => (v && v.length <= 10) || 'Title must be less than 10 characters',
                ],
                contentRules: [
                    v => !!v || 'Content is required',
                    v => (v && v.length > 4) || '4 chars minimum',
                ],
                showStory: false,
                editStory: false,
                storyTitle: '',
                storyContent: '',
                storyStatus: '',
                storyId: '',
                auth : useAuth(),
                configHeader : {},
                allStories: {},
                items: ['Draft', 'Published'],
                isUpdated:0,
                type:'Create',
                emitter:inject('emitter'),
                alertMsg:'',
                storyDraftView:false,
                deleteStory:false

            }
        },
        mounted() {
            this.configHeader = { "headers": { "Authorization": 'Bearer '+this.auth.token} };

            this.getStories();

            this.emitter.on("openCreateStory", isOpen => {
                this.storyTitle = ''
                this.storyContent = ''
                this.storyStatus = ''
                this.storyId = ''
                this.type = "Create"
                this.editStory = true;
            });
        },
        watch:{
            editStory:function(newValue, old){
                if(!newValue){
                    this.storyTitle = ''
                    this.storyContent = ''
                    this.storyStatus = ''
                    this.storyId = ''
                    this.getStories()
                    this.isUpdated = 0
                    this.storyDraftView = false
                }
            },
            deleteStory:function(newValue, old){
                if(!newValue){
                    this.alertMsg = ''
                    this.isUpdated = 0
                    this.getStories()
                }
            }
        },
        methods : {
            openViewModal: async function (id){

                let {data} = await http.get('/story/'+id,this.configHeader);

                if(data.status_code == 200){
                    this.storyTitle = data.story.title  
                    this.storyContent = data.story.content
                    this.showStory = true
                }
            },
            openEditModal: async function (id){

                let {data} = await http.get('/story/'+id,this.configHeader);

                if(data.status_code == 200){
                    this.type = "Update"  
                    this.storyTitle = data.story.title  
                    this.storyContent = data.story.content
                    this.storyStatus = data.story.status
                    this.storyId = data.story.id
                    this.storyDraftView = data.story.view_draft ? true : false
                    this.editStory = true
                }
            },

            updateStory: async function (){
                this.isUpdated = 0
                let {data} = await http.put('/story/'+this.storyId,
                {
                    "title": this.storyTitle,
                    "content": this.storyContent,
                    "status" : this.storyStatus,
                    "view_draft" : this.storyDraftView
                },
                this.configHeader);

                this.alertMsg = data.message
                this.isUpdated = (data.status_code == 200) ? 200 : 500;
            },

            createStory: async function (){

                const { valid } = await this.$refs.form.validate()

                if (valid){
                    this.isUpdated = 0
                    let {data} = await http.post('/story/',
                    {
                        "title": this.storyTitle,
                        "content": this.storyContent,
                        "status" : this.storyStatus,
                        "view_draft" : this.storyDraftView
                    },
                    this.configHeader);
                    this.alertMsg = data.message
                    this.isUpdated = (data.status_code == 200) ? 200 : 500;

                }
            },

            getStories: async function (id){
                let {data} = await http.get('/story',this.configHeader)

                if(data.status_code == 200){
                    this.allStories = data.stories;
                }
            },
            toggleViewDraft: function (){
                this.storyDraftView = !this.storyDraftView;
            },
            openDeleteModal: function (id){
                this.storyId = id
                this.deleteStory = true
            },
            deleteStoryFun: async function (){

                let {data} = await http.delete('/story/'+this.storyId,
                this.configHeader);
                this.alertMsg = data.message
                this.isUpdated = (data.status_code == 200) ? 200 : 500;
            },
        }
    }
</script>