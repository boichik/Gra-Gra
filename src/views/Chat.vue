<template>
   		<div class="chat">
			<div class="chat-container">
                <ChatsBlock :key="renderC" @SetChat='SetMessageBlock' :myId='myID' :allChats='allChats' @rerenderChat="SetChats" @update='renderC++'/>
                <MessagesBlock :key="renderM" v-if="isMessagesBlock" :chat='selectedChat' :myId='myID' @closeMessageBlock="isMessagesBlock=false" @changeChat='SetChats' @changeMess='RenderChat'/>
                <div v-else class="chat-container-info">
                    <div class="open-chat-container active">
                        <h5>Ваши сообщения</h5>
                        <p>Отправляйте личные фото и сообщения другу или группе.</p>
                    </div>
                </div>
			</div>
		</div> 
</template>
<script>
import ChatsBlock from '@/components/chatBlock/ChatsBlock'
import MessagesBlock from '@/components/chatBlock/MessagesBlock'
import firebase from 'firebase/app'

export default {
    name:'Chat',
    data:()=>({
        allChats:[],
        width: 0,
        selectedChat:{},
        isMessagesBlock:false,
        myID:'',
        renderM:0,
        renderC:200
    }),
    components:{
        ChatsBlock, MessagesBlock
    },
    async created(){
        this.myID = await this.$store.dispatch('fetchUserIDDispatch')
        this.SetChats()
    },
    async mounted(){
        firebase.database().ref('/').child(`chats`).orderByChild('userId2').equalTo(this.myID).on('child_changed', snapshot => {
            this.$store.dispatch('fetchChats')
            this.SetChats()
        })
        firebase.database().ref('/').child(`chats`).orderByChild('userId1').equalTo(this.myID).on('child_changed', snapshot => {
            this.$store.dispatch('fetchChats')
            this.SetChats()
        })
        firebase.database().ref('/').child(`chats`).orderByChild('userId2').equalTo(this.myID).on('child_added', snapshot => {
            this.$store.dispatch('fetchChats')
            this.SetChats()
        })
        firebase.database().ref('/').child(`chats`).orderByChild('userId1').equalTo(this.myID).on('child_added', snapshot => {
            this.$store.dispatch('fetchChats')
            this.SetChats()
        })
    },
    beforeDestroy(){
        // firebase.database().ref('/').child(`chats`).orderByChild('userId2').equalTo(this.myID).off('child_changed', snapshot => {})
        // firebase.database().ref('/').child(`chats`).orderByChild('userId1').equalTo(this.myID).off('child_changed', snapshot => {})
        // firebase.database().ref('/').child(`chats`).orderByChild('userId1').equalTo(this.myID).off('child_added', snapshot => {})
        // firebase.database().ref('/').child(`chats`).orderByChild('userId2').equalTo(this.myID).off('child_added', snapshot => {})
    },
    methods:{
      async  RenderChat(id){
          console.log(id)
            const form ={
                id:id
            }
            try{
               const chat = await this.$store.dispatch('fetchChat', form)
               SetMessageBlock(chat)
            }
            catch(e){}
        },
        SetMessageBlock(value){
            this.selectedChat=value
            this.isMessagesBlock = true
            this.renderM++
        },
        UpdateBlock(){
            this.renderC++
        },
        SetChats(){
            const chats = this.$store.getters.uChats
            console.log(chats)
            chats != null ? chats.map(item=> item.messages = (item.messages != null) ? Object.keys(item.messages).map(key=>({ ...item.messages[key], id:key })) : []) : []
            this.allChats = chats
        }
    }
    
}
</script>