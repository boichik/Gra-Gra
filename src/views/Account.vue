<template>
<div>
    <Settings v-if="isSettings" @close="isSettings=false" @update="FetchNewData" @updateData="RenderComponentAccount"/>
    <div class="m-container">
        <Loader v-if="loading"/>
        <div v-else class="main-container account">
            <!-- Block User Info (user_name, user_photo...) -->
            <AuserInfo :key="renderKey" :info='info' :userID='user_id' :followers='followers' :following='following' :publish='publish' @getSettings='isSettings=true' @update='CreateComponentAccount'  @getFollowers='getFollowers()' @getFollowing='getFollowing'/>
            <ModalFollowers  v-if="isModalFollowers" :followItem='followers' :title="title" :userID='user_id' @close='CloseModalFollowers' @sendValue='RenderComponentAccount' />
            <ModalFollowers  v-if="isModalFollowing" :followItem='following' :title="title" :userID='user_id' @close='CloseModalFollowers' @sendValue='RenderComponentAccount' />
            <ModalSelectMedia v-if="isModalSelect" :selectItem='selectItem' :info='info' @closeSelect='isModalSelect=false' @updateSelect='SetSelectMedia' @update='CreateComponentAccount'/>
            <!-- Container for User Media (photo, video) -->
            <AuserMedia :publish='publish' @selectMedia='SetSelectMedia' />
        </div>
    </div>
</div>
</template>
<script>
import AuserInfo from '@/components/accountBlock/AuserInfo'
import AuserMedia from '@/components/accountBlock/AuserMedia'
import { keys } from 'materialize-css'

export default {
    name:'account',
    data:()=>({
        loading:true,
        renderKey:0,
        isSettings: false,
        isModalSelect:false,
        isModalFollowers:false,
        isModalFollowing:false,
        selectItem:{},
        followers:[],
        user_id:null,
        info:[],
        publish:[],
        following:[],
        title:'',
        myId:''
    }),
    created(){
      this.CreateComponentAccount()
    },
    mounted(){
        
    },
    components:{
        AuserInfo, AuserMedia
    },
    watch:{
        '$route'(to,from){
            this.loading=true
            this.CreateComponentAccount()
        }
        
    },
    methods:{
        async CreateComponentAccount(){
            this.isModalSelect = false
            this.isModalFollowers = false
            this.isModalFollowing = false
            this.isSettings=false
            
            await this.FetchNewData()
            this.renderKey++
            this.loading = false
        },
        async FetchNewData(){
            await this.$store.dispatch('fetchUserFollowing')
            await this.$store.dispatch('fetchUserFollowers')
            this.user_id = await this.$store.dispatch('GetUserIdByNickname', this.$route.params.id)
           
            const following = await this.$store.dispatch('fetchUserIDFollowing',this.user_id)
            this.info = await this.$store.dispatch('fetchUserInfoById', this.user_id)
            const followers = await this.$store.dispatch('fetchUserIDFollowers',this.user_id)
            this.myId = await this.$store.getters.uID.id
            const publish = await this.$store.dispatch('fetchUserIDPublish', this.user_id)
            this.publish = publish.map(item=>
                    item={
                        id: item.id,
                        items :  Object.keys(item.items).map(key=>({...item.items[key], id:key})),
                        comments : (item.comments != null) ? Object.keys(item.comments).map(keys=>({...item.comments[keys], id:keys})) : item.comments,
                        likes : (item.likes != null) ? Object.keys(item.likes).map(keys=>({...item.likes[keys], id:keys})) : item.likes

                    }
            )
            this.following = following.map(item=>
                    item={
                        id: item.id,
                        userId: item.userId,
                        user_avatar: item.user_avatar,
                        user_nickname: item.user_nickname,
                        isSubscribe: this.$store.getters.uFollowers.map(f=> f.userId).some(f=>f==item.userId)
                    }
            )
            
            this.followers = followers.map(item=>
                    item={
                        id: item.id,
                        userId: item.userId,
                        user_avatar: item.user_avatar,
                        user_nickname: item.user_nickname,
                        isSubscribe: this.$store.getters.uFollowers.map(f=> f.userId).some(f=>f==item.userId)
                    }
            )
        },
        RenderComponentAccount(value){
            this.$router.push(`/a/${value}`)
        },
        async SetSelectMedia(value){
            if(document.body.clientWidth <= 1024){
                this.$router.push(`/m/${value}`)
            }
            else{
                const formData = {
                    user_id: this.user_id,
                    publishId : value
                }
                const selectItem = await this.$store.dispatch('GetPublishById', formData)
                selectItem.id = value
                selectItem.items = Object.keys(selectItem.items).map(key=>({...selectItem.items[key], id:key}));

                this.selectItem = selectItem

                this.isModalSelect=true
            }
        },
        CloseModalFollowers(value){
            this.isModalFollowers = false
            this.isModalFollowing = false
            this.isModalSelect= false

        },
        async LogOut(){
            await this.$store.dispatch('LogOut')
                this.$router.push('/auth')
            
        },
        getFollowers(){
            this.title = 'Подписки'
            this.isModalFollowers=true

        },
        getFollowing(){
            this.title = "Подписчики"
            this.isModalFollowing=true
        }
    }
}
</script>