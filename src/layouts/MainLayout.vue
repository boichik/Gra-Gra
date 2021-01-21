<template>
    <div>
        <Header/>
        <main class="main">
            <router-view/>
        </main>
        <Footer/>
  </div>
</template>
<script>
import Header from '@/components/app/Header'
import Footer from '@/components/app/Footer'
import firebase from 'firebase/app'

export default {
    name: 'main-layout',
    data:()=>({
        myId:null
    }),
    async created(){
        await this.$store.dispatch('setStatus')
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
        await this.$store.dispatch('fetchUserID')
        this.myId = this.$store.getters.uID.id
        await this.$store.dispatch('fetchChats')
    },
    async mounted(){
        if(!Object.keys(this.$store.getters.uInfo).length){
            await this.$store.dispatch('fetchUserInfo')
        }
        if(!Object.keys(this.$store.getters.uID).length){
            await this.$store.dispatch('fetchUserID')
            this.myId = this.$store.getters.uID.id
        }else{this.myId = this.$store.getters.uID.id}
        if(!Object.keys(this.$store.getters.uFollowing).length){
            await this.$store.dispatch('fetchUserFollowing')
        }
        if(!Object.keys(this.$store.getters.uFollowers).length){
            await this.$store.dispatch('fetchUserFollowers')
        }
        if(!Object.keys(this.$store.getters.uPublish).length){
            await this.$store.dispatch('fetchUserPublish')
        }
        if(!Object.keys(this.$store.getters.uChats).length){
            await this.$store.dispatch('fetchChats')
        }
        firebase.database().ref(`/users/${this.myId}/info`).on('child_changed', async snap=>{
            await this.$store.dispatch('fetchUserInfo')
        })
        firebase.database().ref(`/users/${this.myId}/followers`).on('child_added', async snap=>{
            await this.$store.dispatch('fetchUserFollowers')
        })
        firebase.database().ref(`/users/${this.myId}/followers`).on('child_removed', async snap=>{
            await this.$store.dispatch('fetchUserFollowers')
        })
        firebase.database().ref(`/users/${this.myId}/following`).on('child_changed', async snap=>{
            await this.$store.dispatch('fetchUserFollowing')
        })
    },
    methods:{
        async remove(){
            await this.$store.dispatch('removeStatus')
        },
        beforeunloadFn(e) {
            this.$store.dispatch('removeStatus')
            // ...
        }
    },
    components:{
        Footer, Header
    }, 
    destroyed(){
        this.$store.dispatch('removeStatus')
        window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    }
    
}
</script>