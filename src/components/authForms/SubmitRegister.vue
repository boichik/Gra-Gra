<template>
    <div class="form-container sign-up-finish">
        <div class="form-container__header">
            <p>Регестрация</p>
        </div>
        <p class="step-text">Шаг 2</p>
        <div  class="form-container__form">
            <div class="form-upload-image-block">
                <vue-croppie 
                    ref="croppieRef" 
                    :enableOrientation="false"
                    :boundary="{ width: 200, height: 200}"
                    :viewport="{ width: 150, height: 150, type: 'circle' }"
                    :showZoomer="false"
                    :enableResize="false"
                >
                </vue-croppie>
                <!-- <div class="btn-container">
                    <button class="btn-sign-in" @click="Crop">Сохранить</button>
                </div> -->
                <div class="form-upload-image-block__buttons">
                    <input type="file" name="fileUpload" id="fileUpload" @change="GetImage">
                </div>
            </div>
            <div class="input-field col s6">
                <input 
                    id="nickname" 
                    type="text" 
                    class="validate"
                    v-model.trim='nickname'
                    :class="{invalid: $v.nickname.$dirty && !$v.nickname.required}"
                >
                <label for="nickname">Никнейм</label>
                <span 
                    v-if="($v.nickname.$dirty && !$v.nickname.required)"
                    class="helper-text invalid left"
                >Введите Никнейм</span>
            </div>
            <div class="input-field col s6">
                <input 
                    id="name" 
                    type="text" 
                    class="validate"
                    v-model="name"
                    :class="{invalid: $v.name.$dirty && !$v.name.required}"

                >
                <label for="name">Имя</label>
                <span 
                    v-if="($v.name.$dirty && !$v.name.required)"
                    class="helper-text invalid left"
                >Введите ваше Имя</span>
            </div>
            <div class="input-field col s6">
                <input id="bio" type="text" class="validate" v-model="bio">
                <label for="bio" >Описание\БИО</label>
            </div>
            <div class="btn-container">
                    <button class="btn-sign-in" @click="FinishSubmit">Регестрация</button>
            </div>  
        </div>
        <p class="sign-up">Уже есть аккаут, <a  @click="NextForm" class="btn-sign-up">Войдите!</a></p>
    </div>
</template>
<script>
import  {required} from 'vuelidate/lib/validators'
export default {
    name:'submit-register',
    data:()=>({
       newImage:null,
       ImageURL:null,
       nickname:'',
       name:'',
       bio:''
    }),
    validations:{
      nickname:{ required},
      name:{required}, 
    },
    methods:{
        GetImage(e){
           let image = e.target.files[0]
           let reader = new FileReader();
           reader.readAsDataURL(image);
           reader.onload = e =>{
               this.ImageURL = e.target.result
                this.$refs.croppieRef.bind({
                    url: e.target.result
                });
           }
           
        },
        Crop(){
            let options = {
                type:'base64',
                format: 'jpeg', 
                circle: false
            }
            this.$refs.croppieRef.result(options, (output) => {
                this.newImage = output;
            });
        },
        async FinishSubmit(){   
            await this.Crop()    
            if(this.$v.$invalid){
                this.$v.$touch()
                 return 
            }
            const user={
                photo: this.newImage,
                nickname : this.nickname,
                name: this.name,
                bio: this.bio
            }
            this.$emit('finishSubmit', user)
        },
        NextForm(){
            this.$emit('changeForm', 'login')
        }
    }
    
}
</script>