<template>
    <div class="form-container sign-in" >
        <div class="form-container__header">
            <p>Войти в систему</p>
        </div>
        <form  class="form-container__form" @submit.prevent="submitHandler">
            <div class="input-field col s6">
                <input 
                    id="email_login" 
                    type="email"  
                    class="validate"
                    v-model.trim="email"
                    :class="{invalid: $v.email.$dirty && !$v.email.required || $v.email.$dirty && !$v.email.email}"
                >
                <label for="email_login">Email</label>
                <span
                    class="helper-text invalid text-red"
                    v-if="isErrorCode === 'user-not-found'"
                >Не правильный емейл
                </span>
                <span
                    class="helper-text invalid text-red"
                    v-if="$v.email.$dirty && !$v.email.required"
                >Поле не должно быть пустым
                </span>
                <span
                    class="helper-text invalid text-red"
                    v-else-if="$v.email.$dirty && !$v.email.email"
                >Введите коректний емейл
                </span>
            </div>
            <div class="input-field col s6">
                <input 
                    id="password_login" 
                    :type="pHide ? 'password' : 'text'" 
                    class="validate"
                    v-model.trim="password"
                    :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
                >
                <div @click="pHide = !pHide" class="btn-hide-pass"><i class="material-icons">{{pHide ? 'visibility_off' : 'visibility'}}</i></div>
                <label for="password_login">Пароль</label>
                <span
                    class="helper-text invalid text-red"
                    v-if="isErrorCode === 'wrong-password'"
                >Не правильный пароль
                </span>
                <span
                    class="helper-text invalid text-red"
                    v-if="$v.password.$dirty && !$v.password.required"
                >Поле не должно быть пустым
                </span>
                <span
                    class="helper-text invalid text-red"
                    v-if="$v.password.$dirty && !$v.password.minLength"
                >Пароль должен быть {{$v.password.$params.minLength.min}} символов
                </span>
                <a href="#!" class="btn-recovery-pass">Забыли пароль...</a>
            </div>
            <div class="btn-container">
                <button class="btn-sign-in" type="submit">Войти</button>
            </div>  
        </form>
        <p class="sign-up">У меня нет аккаунта <a  @click="NextForm" class="btn-sign-up">Зарегестрироваться!</a></p>
    </div>
</template>
<script>
import  {email, required, minLength} from 'vuelidate/lib/validators'
export default {
    name:'login',
    data:()=>({
        email:'',
        password:'',
        pHide:true,
        isErrorCode:null
    }),
    validations: {
        email: { email, required },
        password: { required, minLength: minLength(6) }
    },
    computed:{
        error(){
            return this.$store.getters.error
        }
    },
    watch:{
        error(e){
            if(e.code === 'auth/user-not-found') return this.isErrorCode = 'user-not-found'
            if(e.code === 'auth/wrong-password') return this.isErrorCode = 'wrong-password'
        }
    },
    methods:{
       async submitHandler(){
            if(this.$v.$invalid){
                this.$v.$touch()
                    return
               
            }
            const user ={
                email:this.email,
                password:this.password
            }
            try{
                await this.$store.dispatch('Login', user)
                this.$router.push('/')
            }
            catch(e){}
          
        },
        NextForm(){
            this.$emit('changeForm', 'register')
        }
    }
}
</script>