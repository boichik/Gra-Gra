<template>
    <div class="modal-block active">
        <!-- Container -->
        <div class="modal-block-container modal-liker">
            <!-- Title and button close modal block -->
            <div class="modal-block-container__title">
                <p>Создать новый чат</p>
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
                        <div v-if="!myFollowers.length" class="modal-block-main__items-like">
                            <p>Ничего не найдено</p>
                        </div>
                        <div v-else class="modal-block-main__items-like">
                            <!-- Cotainer item -->
                            <div class="items-like-container" v-for="follower in filteredList" :key="follower.id">
                                <!-- User photo -->
                                <div @click="$emit('sendValue', follower.userId)" class="items-like-container__user-photo">
                                    <div class="circle-liker-photo">
                                        <div class="circle-photo poiner">
                                            <img :src="follower.user_avatar">
                                        </div>		
                                    </div>
                                </div>
                                <!-- User name -->
                                <div @click="$emit('sendValue', follower.userId)"  class="items-like-container__user-name">{{follower.user_nickname}}</div>
                                <!-- Buttons subscribe ro unsubscribe -->
                                <a @click="CreateNewChat(follower.userId, follower.user_nickname, follower.user_avatar)" class="btn-send-mess">
                                    <p>Создать чат</p>
                                </a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'ModalCreateNewChat',
    props:{
        chats:{
            type:Array
        }
    },
    data:()=>({
        loading:true,
        searchText:'',
        myId:'',
        myFollowers:[],
        myInfo:{},
        statusItem:[],
    }),
    async mounted(){
        this.myId = await this.$store.getters.uID.id
        this.myFollowers = await this.$store.getters.uFollowers
        this.myInfo = await this.$store.getters.uInfo
        this.loading = false
    },
    methods:{
        async CreateNewChat(id, nickname, avatar){
            const stat = this.chats.some(chat=> (chat.userId1 === id || chat.userId2 ===id) ? true : false)
            if(stat==true){
                this.$emit('selectOldChat', id)
            }
            else{
                const formData={
                    date: new Date().toString(),
                    userId: id,
                    user1_avatar: avatar,
                    user1_nickname:  nickname,
                    user2_nickname: this.myInfo.nickname,
                    user2_avatar: this.myInfo.avatar
                }
                try{
                    await this.$store.dispatch('CreateNewChat', formData)
                    this.$emit('createNew')
                }
                catch(e){}
            }
        },
        closeM(){
            this.$emit('close')
        }
    },
    computed:{
        filteredList() {
            return this.myFollowers.filter(follow => {
                return follow.user_nickname.toLowerCase().includes(this.searchText.toLowerCase())
            })
        }
    }
    
}
</script>