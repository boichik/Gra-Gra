<template>
    <div class="main-auth-container">
        <div class="e-logo unselectable">
            <div class="e-logo-circles">
                <div class="e-logo-circles__one circle"></div>
                <div class="e-logo-circles__two circle"></div>
                <div class="e-logo-circles__three circle"></div>
                <div class="e-logo-circles__four circle"></div>
                <div class="e-logo-text">
                    <h2><i class="material-icons">camera</i>Gra Gra</h2>
                    <p>new social messanger</p>
                </div>
            </div>
        </div>
        <div class="main-auth-container__forms">
            <Login :class="{active : isLogin}" @changeForm="activeClass"/>
            <Register :class="{active : isRegister}" @changeForm="activeClass" @start="FirstStap"/>
            <SubmitRegister :class="{active : isSubmitRegister}" @changeForm="activeClass" @finishSubmit="LastStap"/>
        </div>
        <div class="mobile-circle">
            <div class="m-circ-1"></div>
            <div class="m-circ-2"></div>
            <div class="m-circ-3"></div>
            <div class="m-circ-4"></div>
            <div class="e-logo-text">
                <h2><i class="material-icons">camera</i>Gra Gra</h2>
                <p>new social messanger</p>
            </div>
        </div>
    </div>
</template>
<script>
import Login from "@/components/authForms/Login"
import Register from "@/components/authForms/Register"
import SubmitRegister from "@/components/authForms/SubmitRegister"

export default {
    name:'auth',
    data:()=>({
        isLogin:true,
        isRegister: false,
        isSubmitRegister:false,

        password:'',
        email:'',
        phone:'',
        name:'',
        bio:'',
        nickname:'',

    }),
    components:{
        Login, Register, SubmitRegister
    },
    methods:{
        activeClass(value){
            if(value=='register'){
                this.isLogin=false,
                this.isRegister=true,
                this.isSubmitRegister=false
            }
            if(value=='login'){
                this.isLogin=true,
                this.isRegister=false,
                this.isSubmitRegister=false
            }
            if(value=='next'){
                this.isLogin=false,
                this.isRegister=false,
                this.isSubmitRegister=true
            }
        },
        FirstStap(data){
            this.password = data.password
            this.email = data.email
            this.phone = data.phone
            this.activeClass('next')
        },
       async LastStap(data){
           const userInfo ={
               nickname: data.nickname,
               name: data.name,
               bio: data.bio,
               photo: data.photo,
               password: this.password,
               email: this.email,
               phone: this.phone
           }
           try{
             await this.$store.dispatch('Register', userInfo)
              this.$router.push('/')
           }
           catch(e){

           }
           
        }
    }
    
}
</script>