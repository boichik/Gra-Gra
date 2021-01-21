<template>
    <Loader v-if="loading" />
    <div v-else class="account-info">
        <div class="account-info__main" :style="`background:${info.color}`">
            <div class="user-info">
                <div class="photo ">
                    <div class="photo-container">
                        <div class="circle-photo ">
                            <img :src="info.avatar" class="unselectable" alt="">
                        </div>
                    </div>	
                </div>
                <div class="date">
                    <p class="date-nickname">{{info.nickname}}</p>
                    <p class="date-name">{{info.name}}</p>
                    <p class="date-bio">{{info.bio}}</p>
                </div>
            </div>
            <div class="btn-user-container">
                <div v-if="myId == userID" @click="$emit('getSettings')" class="btn-settings">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">settings</i> Редактировать профиль</p>
                </div>
            </div>
            <div class="btn-container">
                <div v-if="myId != userID" class="btn-sendMessage">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">mail</i> Написать Сообщение</p>
                </div>
                <div v-if="(status === false && myId != userID)" @click="Subscribe()" class="btn-subscribe">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">person</i> Подписаться</p>
                </div>
                <div v-if="(status === true && myId != userID)" @click="Unsubscribe()" class="btn-unsubscribe">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">person</i> Отписаться</p>
                </div>
            </div>
        </div>
        <div class="account-info__bottom">
            <div class="btn-container-mobile">
                <div v-if="myId != userID" class="btn-sendMessage">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">mail</i> Написать</p>
                </div>
                <div v-if="(status === false && myId != userID)" @click="Subscribe" class="btn-subscribe">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">person</i> Подписаться</p>
                </div>
                <div v-if="(status === true && myId != userID)" @click="Unsubscribe" class="btn-unsubscribe">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">person</i> Отписаться</p>
                </div>
                <div v-if="myId == userID" @click="$emit('getSettings')" class="btn-settings">
                    <p class="btn-text unselectable"><i class="material-icons unselectable">settings</i> Редактировать профиль</p>
                </div>
            </div>
            <div class="counter">
                <div class="publish">
                    <p class="publish-text unselectable">Публикаций</p>
                    <p class="publish-count unselectable">{{publish.length}}</p>
                </div>
                <div @click="getMFollowing()" class="following pointer">
                    <p class="following-text unselectable">Подписчиков</p>
                    <p class="following-count unselectable">{{following.length}}</p>
                </div>
                <div @click="getMFollowers()"  class="followers pointer">
                    <p class="followers-text unselectable">Подписок</p>
                    <p class="followers-count unselectable">{{followers.length}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        userID:{required:true},
        info:{required:true},
        followers:{type:Array,  required:true},
        following:{type:Array,  required:true},
        publish:{type:Array,  required:true},
    },
    data:()=>({
        loading:true,
        status: false,
        subscriberID:null,
        followersID:null,
        myFollowers:null,
        myId:''
    }),
    async created(){
        this.myId = await this.$store.dispatch('getUid')
        this.SetStatus()
        
    },
    async mounted(){
        this.SetStatus()
    },
    methods:{
        SetStatus(){
            this.myFollowers = this.$store.getters.uFollowers
            this.status = this.myFollowers.map(f=> f.userId).some(f=>f==this.userID)
            this.loading = false
        },
        async Subscribe(){
            const myInfo = this.$store.getters.uInfo
            const formData ={
                userId: this.userID,
            }
            try{
                await this.$store.dispatch('Subscribe', formData)
                    this.$emit('update')
            }
            catch(e){}
        },
        async Unsubscribe(){
            const myFollowers = await this.$store.getters.uFollowers
            this.following.find(item=> {if(item.userId === this.myId) this.subscriberID = item.id})
               for(var i=0;i<myFollowers.length;i++){
                   if(myFollowers[i].userId === this.userID){
                      this.followersID = myFollowers[i].id
                   }
               }

                const userData ={
                    followersID: this.followersID,
                    followingID: this.subscriberID,
                    user_id: this.userID
                }

               try{
                   await this.$store.dispatch('UnSubscribe', userData)
                    this.$emit('update')

               }
               catch(e){}
        },
        SetSettings(){
            this.$emit('getSettings')
        },
        getMFollowers(){
            this.$emit('getFollowers')
        },
        getMFollowing(){
            this.$emit('getFollowing')
        }

    }
    
}
</script>