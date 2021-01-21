<template>
    <div class="chat-container-chats active">
         <ModalCreateNewChat v-if="isModalCreate" @close="isModalCreate=false" @createNew="createNew" :chats="chats" @selectOldChat='selectOldChat'/>
        <div class="chats-header">
            <div class="input-container">
                <input placeholder="Поиск..." class="input-container__input-search browser-default" type="text" v-model="searchText">
            </div>
            <a @click="isModalCreate=true" class="btn-select-user-for-chat">
                <i class="material-icons">border_color</i>
            </a>
        </div>
        <!-- <ul v-if="!chats.length" class="chats-container">
            <p>На данный момент чатов нет!</p>
        </ul> -->
        <ul v-if="loading" class="chats-container">
            <Loader/>
        </ul>
        <ul v-else class="chats-container">
            <li v-for="(chat) in filteredList" 
               :class="{select : chat.id === select, unread : chat.messages.filter(message=> message.to === myId).some(s=> s.isRead === false), online : chat.isOnline===true }"
                @click="selectChat(chat), select = chat.id" :key="chat.id" 
                class="chats-container-item" 
              
            >
                <a class="chats-container-item__user-photo">
                    <div class="chats-photo-container">
                        <div class="circle-photo">
                            <img :src="(chat.userId2 === myId) ? chat.user1_avatar : chat.user2_avatar" alt="">
                        </div>
                        <span class="indicator-online"></span>
                    </div>
                </a>
                <div class="chats-container-item__message-info">
                    <a href="#!" class="user-name">{{(chat.userId2 === myId) ? chat.user1_nickname : chat.user2_nickname}}</a>
                    <p  class="last-message">{{(!chat.messages.length) ? 'Новых сообщений нет' : chat.messages[chat.messages.length -1].message | text('message') }}</p>
                    <p v-if="chat.isOnline" class="text-online">Сейчас в сети</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import ModalCreateNewChat from '@/components/app/ModalCreateNewChat'
import firebase from 'firebase/app'
import _ from 'lodash'
import not from 'vuelidate/lib/validators/not'
//:class="{select : chat.id === select , online: chat.isOnline===true, unread : chat.messages.filter(message=> message.to === myId).some(s=> s.isRead === false)}"

export default {
    name:'ChatsBlock',
    props:{
        allChats:{
            required: true
        },
        myId:{
            required:true
        },
    },
    data:()=>({
        loading:true,
        isModalCreate: false,
        select:null,
        chats:[],
        searchText:''
    }),
    created(){
       
    },
    computed:{
        filteredList() {
        return this.allChats.filter(chat => {
                return  (chat.userId2===this.myId) ? chat.user1_nickname.toLowerCase().includes(this.searchText.toLowerCase()) : chat.user2_nickname.toLowerCase().includes(this.searchText.toLowerCase())
            })    
        },
    },
    mounted(){
        this.SettingObject(this.filteredList)
        
        this.loading = false
    },
    components:{
        ModalCreateNewChat
    },
    methods:{
        Class(chat){
            let classOption =[]
            if(chat.isOnline == true) classOption.push('online')
            return classOption
        },
        SettingObject(value){
            value.sort((a,b)=>{
                var c = new Date(a.last_change)
                var d = new Date(b.last_change)
                return d-c
            })
            return value
        },
        createNew(){
            this.isModalCreate=false
            this.$emit('rerenderChat')
        },
        selectOldChat(id){
            this.isModalCreate=false
            let chatId = {}
            this.allChats.map(chat => { 
                if(chat.userId1 === id || chat.userId2 === id) return chatId = chat})
            this.$emit('SetChat', chatId)
        },
        selectChat(value){
            value.messages = (value.messages != null) ? Object.keys(value.messages).map(key=> ({...value.messages[key], id:key})) : [];
            this.$emit('SetChat', value)
        }
    }
}
</script>