<template>
    <div class="chat-container-messages active">
        <div class="message-block active">
            <div class="message-block-header">
                <a @click="BackMessage" class="btn-back"><i class="material-icons">keyboard_backspace</i></a>
                <div class="chats-photo-container">
                    <div class="circle-photo">
                        <img :src="(chat.userId2 === myId) ? chat.user1_avatar : chat.user2_avatar" alt="">
                    </div>
                    <span class="indicator-online" :class="{active : chat.isOnline}"></span>
                </div>
                <a @click="PushtoAcc((chat.userId2 === myId) ? chat.userId1 : chat.userId2)" class="user-name">{{(chat.userId2 === myId) ? chat.user1_nickname : chat.user2_nickname}}</a>
                <a href="#!" class="btn-select-user-for-chat">
                    <i class="material-icons">info_outline</i>
                </a>
            </div>
            <div class="message-block-main">
                <div ref='messageDisplay' @scroll="onBodyScroll" class="message-block-main-container">
                    <div  v-for="message in Items" :key="message.idx" class="message" :class="message.to != myId ? 'to' : 'from'">
                        <div class="message-text"><p>{{message.message | text('message')}}</p></div>
                        <div class="message-date">{{message.date}}</div>
                    </div>
                </div>
            </div>
            <div class="message-block-bottom">
                <div class="message-block-bottom-container">
                    <div class="input-container">
                        <textarea type="text"
                        placeholder="Напишите сообщение..." class="input-container__input-message
                        browser-default" v-model="message"></textarea>
                    </div>
                    <a @click="SendMessage" class="button-submit">Отправить</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/app'
import messageLoad from '@/mixins/messageLoad.mixin'

export default {
    name:'MessagesBlock',
    props:{
        chat:{
            required:true
        },
        myId:{
            required:true
        }
    },
    mixins:[messageLoad],
    data:()=>({
        messages:null,
        message:'',
        messageDisplay:null,
        isMobile: true,
        isfirstLoad : true
    }),
    created(){
        this.messages = this.chat.messages
        this.myId = this.$store.getters.uID.id
       // this.messageDisplay = this.$refs.messageDisplay    
        this.sPagination(this.messages, 10)
    },
    mounted(){
            firebase.database().ref(`/chats/${this.chat.id}/messages`).on('child_added', snapshot => { 
               if(this.isfirstLoad == false){
                    this.messages.push(snapshot.val())
                    this.sPaginationNew(this.messages, 10)

                    this.ScrollBottom()
               } 

            })
        

        
        this.messageDisplay = this.$refs.messageDisplay
        this.ScrollBottom()
        this.SetRead(this.chat.id)
        this.isfirstLoad=false
    },
    methods:{
        ScrollBottom(){
            this.messageDisplay.scrollTop = this.messageDisplay.scrollHeight;
        },
        onBodyScroll(){
            if(this.messageDisplay.scrollTop <=100){
                if(this.Items.length != this.messages.length) this.sPagination(this.messages, 10)
            }
        },
        async SetRead(id){
            const form = {
                chatId: id
            }
            try{
                await this.$store.dispatch('isRead', form)
            }
            catch(e){}
        },
        BackMessage(){
            this.$emit('closeMessageBlock')
        },
        PushtoAcc(value){
            this.$router.push(`/account/${value}`)
        },
        async SendMessage(){
            const option={
                day : '2-digit',
                month : 'numeric',
                year : 'numeric',
                hour : '2-digit',
                minute : '2-digit',
                second : '2-digit',
            }
            
            
            const formData={
                date: new Intl.DateTimeFormat('ru-RU', option).format(new Date()).toString(),
                chatId: this.chat.id,
                to: (this.chat.userId1 != this.myId) ? this.chat.userId1 : this.chat.userId2,
                message: this.CryptoJS.AES.encrypt(this.message, `"${process.env.SECRET_KEY}"`).toString()
            }
            try{
                await this.$store.dispatch('SendMessage', formData)
                this.message=''
                this.ScrollBottom()
            }
            catch(e){}
        }
    }
}

</script>


