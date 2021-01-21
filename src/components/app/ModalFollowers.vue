<template>
    <div class="modal-block active">
        <!-- Container -->
        <div class="modal-block-container modal-liker">
            <!-- Title and button close modal block -->
            <div class="modal-block-container__title">
                <p>{{title}}</p>
                <a @click="closeM()" class="modal-block-container__btn-close"><i class="material-icons">close</i></a>
            </div>
            <Loader v-if="loading"/>
            <!-- Modal Body -->
            <div class="modal-block-main">
                <!-- Items Container -->
                <div class="modal-block-main-container">
                    <div class="input-container">
                        <input placeholder="Поиск..." class="input-container__input-search browser-default" type="text" v-model="searchText">
                    </div>
                    <!-- Items (Liker) -->
                        <div v-if="!followItem.length" class="modal-block-main__items-like">
                            <p>Ничего не найдено</p>
                        </div>
                        <div v-else class="modal-block-main__items-like">
                            <!-- Cotainer item -->
                            <div class="items-like-container" v-for="(follower, index) in filteredList" :key="index">
                                <!-- User photo -->
                                <div @click="$emit('sendValue', follower.user_nickname)" class="items-like-container__user-photo">
                                    <div class="circle-liker-photo">
                                        <div class="circle-photo poiner">
                                            <img :src="follower.user_avatar">
                                        </div>		
                                    </div>
                                </div>
                                <!-- User name -->
                                <div @click="$emit('sendValue', follower.user_nickname)"  class="items-like-container__user-name">{{follower.user_nickname}}</div>
                                <!-- Buttons subscribe ro unsubscribe -->
                                <div 
                                    v-if="!follower.isSubscribe && myId != follower.userId"  
                                    @click="Subscribe(follower.userId, follower.id)" 
                                    class="items-like-container__btn btn-subscribe"
                                >
                                    Подписаться
                                </div>
                                <div 
                                    v-if="follower.isSubscribe && myId != follower.userId "  
                                    @click="Unsubscribe(follower.userId, follower.id)" 
                                    class="items-like-container__btn btn-unsubscribe"
                                >
                                    Отписаться
                                </div>
                                <p v-if="myId === follower.userId" class="items-like-container__btn static-btn">You</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'ModalFollow',
    data:()=>({
        loading:true,
        searchText:'',
        myId:'',
        myFollowers:[],
        myFollowing:[],
        statusItem:[],
    }),
    props:{
        title:{
            type:String,
            required: true
        },
        followItem:{
            type: Array,
            required: true
        },
        userID:{required:true}
    },
    created(){
        this.myId = this.$store.getters.uID.id
        this.myFollowers = this.$store.getters.uFollowers
        this.myFollowing = this.$store.getters.uFollowing
    },
    mounted(){
        this.loading = false
    },
    methods:{
        isSubscribe(value){
            //console.log(value+' || '+text+' || '+this.myFollowers.map(item=> item.userId).some(s=> s != value))
            let foll = this.myFollowers.find(item=> item.userId = value)
            if(foll) return false
            if(!foll) return true
            //console.log(this.myFollowers.map(item=> item.userId).some(s=> s=== value))
            //return this.myFollowers.map(item=> item.userId).some(s=> s=== value)
        },
        async Subscribe(userid, id){
            const formData ={
                userId: userid,
            }
            try{
                await this.$store.dispatch('Subscribe', formData)
                await this.$store.dispatch('fetchUserFollowers')
                this.followItem.map(item=>{
                       if(item.id === id){
                           item.isSubscribe = true
                       }
                   })
                
            }
            catch(e){}
        },
        async Unsubscribe(userid, followID){
            const followingUser = await this.$store.dispatch('fetchUserIDFollowing',userid)
                let followingID = ''
                followingUser.map(follower =>{
                    if(follower.userId === this.myId){
                        followingID=follower.id
                    }  
                    
                })
                const userData ={
                    followersID: followID,
                    followingID: followingID,
                    user_id: userid
                }
               try{
                   await this.$store.dispatch('UnSubscribe', userData)
                   await this.$store.dispatch('fetchUserFollowers')
                   this.followItem.map(item=>{
                       if(item.id === followID){
                           item.isSubscribe = false
                       }
                   })

               }
               catch(e){}
        },
        sendRend(value){
            this.$emit('sendValue', value)
        },
        closeM(){
            this.$emit('close')
        }
    },
    computed:{
        filteredList() {
            return this.followItem.filter(follow => {
                return follow.user_nickname.toLowerCase().includes(this.searchText.toLowerCase())
        })

    }
    }
    
}
</script>