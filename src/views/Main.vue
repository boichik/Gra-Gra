<template>
    <div class="m-container">
        <ModalSelectMedia :key="renderSelect" v-if="isModalSelect"  :selectItem='selectItem' @closeSelect='isModalSelect=false' @updateSelect="SetSelectMedia"/>
        <div class="main-page">
            <div class="main-page-content">
                <div class="main-page-content-container">
                    <div v-for="(item, index) in Items" :key="index" @click="SetSelectMedia(item.id, item.userId)" class="item">
                        <img :src="item.items[0].link" alt="">
                        <div class="item-info">
                            <div class="user-info">
                                <div class="avatar">
                                    <div class="circle-photo">
                                        <img :src="item.user_avatar" alt="">
                                    </div>
                                </div>
                                <p class="user-name">{{item.user_nickname}}</p>
                            </div>
                            <div class="media-info">
                                <div class="like">
                                    <i class="material-icons header_ico">favorite</i>
                                    <span>{{(item.likes != null) ? item.likes.length : 0}}</span>	
                                </div>
                                <div class="comment">
                                    <i class="material-icons header_ico">comment</i>
                                    <span>{{(item.comments != null) ? item.comments.length : 0}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/app'
import messageLoad from '@/mixins/messageLoad.mixin'


export default {
    name: 'Main',
    data:()=>({
        myId:'',
        publish:[],
        userId:'',
        isModalSelect:false,
        selectItem:{},
        renderSelect:0,
    }),
    mixins:[messageLoad],
    async created(){
        this.publish = await this.$store.dispatch('fetchPublishByMain')
        this.sortedList()
    },
    mounted(){
        document.addEventListener('scroll', (e)=>{
            const body = e.target.body
            //console.log(body.clientHeight)
            if(body.clientHeight + body.scrollTop >= body.scrollHeight - 50){
               if(this.Items.length != this.publish.length) this.sPagination(this.publish, 3)

            }
        })
    },
    methods:{
        sortedList() {
            this.publish.sort((a,b)=>{
                var c = new Date(a.date_publish)
                var d = new Date(b.date_publish)
                return d-c
            })
            this.sPagination(this.publish, 3)
           // console.log(this.publish)
        },
        RerenderSelect(id, userId){
            this.selectItem={}
            this.SetSelectMedia(id, userId)
        },
        async SetSelectMedia(id, userId){
            this.selectItem={}
            const data ={
                user_id: userId,
                publishId: id
            }
            this.selectItem = await this.$store.dispatch('GetPublishById', data) 
            this.isModalSelect=true
            this.renderSelect++
             
        }
    }
}
</script>