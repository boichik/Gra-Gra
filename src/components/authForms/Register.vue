<template>
    <div class="form-container sign-up">
        <div class="form-container__header">
            <p>Регестрация</p>
        </div>
        <p class="step-text">Шаг 1</p>
        <form @submit.prevent="Submit()" class="form-container__form">
            <div class="input-field col s6">
                <input 
                    id="email" 
                    type="email" 
                    class="validate"
                    v-model.trim="email"
                    :class="{invalid: $v.email.$dirty && !$v.email.required || $v.email.$dirty && !$v.email.email}"
                >
                <label for="email">Email</label>
                <span
                    class="helper-text invalid"
                    v-if="$v.email.$dirty && !$v.email.required"
                >Введите свой емейл
                </span>
                <span
                    class="helper-text invalid"
                    v-else-if="$v.email.$dirty && !$v.email.email"
                >Не правильный емейл
                </span>
            </div>
            <div class="input-field col s6">
                <input id="phone" type="text" class="validate" v-model="phone">
                <label for="phone">Номер телефона</label>
            </div>
            <div class="input-field col s6">
                <input 
                    id="password"
                    :type="pHide1 ? 'password' : 'text'"  
                    class="validate"
                    v-model.trim="password"
                    :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
                >
                <a @click="pHide1 = !pHide1" class="btn-hide-pass"><i class="material-icons">{{pHide1 ? 'visibility_off' : 'visibility'}}</i></a>
                <label for="password">Пароль</label>
                <span 
                    v-if="$v.password.$dirty && !$v.password.required"
                    class="helper-text invalid left"
                >Введите коректный пароль</span>
                <span 
                    v-if="$v.password.$dirty && !$v.password.minLength"
                    class="helper-text invalid left"
                >Длина пароля должена быть {{$v.password.$params.minLength.min}} символов. Сейчас {{password.length}}
                </span>
            </div>
            <div class="input-field col s6">
                <input 
                   id="confim_pass_inline"
                   :type="pHide2 ? 'password' : 'text'" 
                   class="validate"
                   v-model="confimpassword"
                   :class="{invalid: ($v.password.$dirty && !$v.confimpassword.sameAsPassword)}"
                >
                <a @click="pHide2 = !pHide2" class="btn-hide-pass"><i class="material-icons">{{pHide2 ? 'visibility_off' : 'visibility'}}</i></a>
                <label for="confim_pass_inline">Повторите пароль</label>
                <span 
                    v-if="($v.password.$dirty && !$v.confimpassword.sameAsPassword)"
                    class="helper-text invalid left"
                >Пароли не совпадают</span>
            </div>
            <div class="checkbox">
                <p>
                    <label>
                    <input type="checkbox" v-model="check" />
                    <span>Я согласен (согласна) на обработку и хранение предоставленных персональных данных в соответствии с <a href="#">Согласием</a></span>
                    </label>
                </p>
            </div>
            <div class="btn-container">
                    <button class="btn-sign-in" type="submit" >Продолжить</button>
            </div>  
        </form>
        <p class="sign-up">Уже есть аккаут, <a  @click="NextForm" class="btn-sign-up">Войдите!</a></p>
    </div>
</template>
<script>
import  {email, required, minLength, sameAs} from 'vuelidate/lib/validators'
export default {
    name:'register',
    data:()=>({
      email:'',
      phone:'',
      password:'',
      confimpassword:'',
      check:false,
      pHide1:true,
      pHide2:true
    }),
    validations:{
      email:{email, required},
      //phone:{required},
      password:{required, minLength: minLength(8)},
      confimpassword:{required, sameAsPassword: sameAs('password')   
    },
      check:{ checked: v=> v}
    },
    methods:{
        Submit(){
            if(this.$v.$invalid){
                this.$v.$touch()
                 return 
            }
            const newUser={
                email:this.email,
                phone: this.phone,
                password:this.password
            }
            this.$emit('start', newUser) 
        },
        NextForm(){
            this.$emit('changeForm', 'login')
        }
    }
    
}
</script>