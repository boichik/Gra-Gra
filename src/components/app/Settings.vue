<template>
    <div class="settings-block active">
        <a @click="$emit('close')" class="btn-close"><i class="material-icons medium">close</i></a>
        <div class="settings-block__container">
            <ul ref="tabsbar" class="sidebar" :class="{active: !isShowBlock}">
                <li class="tab"><a href="#block-1" @click="isShowBlock=true" class="s-tab active"><p>Редактировать профиль</p></a></li>
                <li class="tab"><a href="#block-2" @click="isShowBlock=true" class="s-tab"><p>Настройки аккаунта</p></a></li>
                <li class="tab"><a href="#block-3" @click="isShowBlock=true" class="s-tab"><p>Помощь</p></a></li>
                <li><a @click="LogOut" class="s-tab exit"><p>Выйти</p></a></li>
            </ul>
            <div class="show-block" :class="{active :isShowBlock ===true}">
                <div class="btn-replay" @click="isShowBlock=false"><i class="material-icons">arrow_back</i></div>
                <div class="item" id="block-1">
                    <div class="title">
                        <p>Редактировать профиль</p>	
                    </div>
                    <div class="photo-and-color">
                        <div class="photo">
                            <div v-if="!isCrippier" class="photo-container" :style="`background: url(${myInfo.avatar})`" ></div>
                            <vue-croppie 
                                v-else 
                                ref="croppieRef" 
                                :enableOrientation="false"
                                :boundary="{ width: 150, height: 150}"
                                :viewport="{ width: 150, height: 150, type: 'circle' }"
                                :showZoomer="false"
                                :enableResize="false"
                            >
                            </vue-croppie>
                            <div class="photo-buttons">
                                <div class="input-file-container ">
                                    <input type="file" name="file" id="file" class="input-file" @change="NewImg">
                                    <label for="file" class="btn btn-tertiary">
                                    <span class="js-fileName">Изменить</span>
                                    </label>
                                </div>
                                <div v-if="isCrippier" @click="SaveImg" class="btn-save">
                                    <p class="btn-text unselectable">Сохранить</p>
                                </div>
                            </div>
                        </div>
                        <color-picker
                            :hue='color.hue' 
                            :saturation="color.saturation" 
                            :luminosity="color.luminosity" 
                            :alpha="1" 
                            :initiallyCollapsed="true"
                            @select="onColorSelect"
                        >
                        </color-picker>
                    </div>
                    <div class="date-block ">
                        <div class="input-field col s6">
                            <input id="nickname" type="text" class="validate" value="" v-model="nickname">
                            <label for="nickname">Никнейм</label>
                        </div>
                        <div class="input-field col s6">
                            <input id="name" type="text" class="validate" v-model="name">
                            <label for="name">Имя</label>
                        </div>
                        <div class="input-field col s6">
                            <input id="bio" type="text" class="validate" v-model="bio">
                            <label for="bio">О себе</label>
                        </div>
                    </div>
                    <div class="buttons">
                        <div @click="SaveInfo" class="btn-save">
                            <p class="btn-text unselectable">Сохранить</p>
                        </div>
                    </div>
                </div>
                <div class="item" id="block-2">
                    <div class="title">
                        <p>Настройки аккаунта</p>	
                    </div>
                    <div class="info-block">
                        <p><i class="material-icons header_ico">info</i>Внимание! На ваш емейл было отправлено письмо для подтверждения изминений</p>
                    </div>
                    <div class="edit-email">
                        <p class="edit-email-txt">Изменить емейл</p>
                        <div class="input-field email-input">
                            <input id="email" type="email" class="validate" placeholder="gragra@.info.com">
                        </div>
                        <div class="edit-email-button">
                            <div class="btn-edit">
                                <p class="btn-text unselectable">Изменить</p>
                            </div>
                        </div>
                    </div>
                    <div class="edit-pass">
                        <p class="edit-pass-title">Изменить пароль</p>
                        <div class="input-field ">
                            <input id="password" type="password" class="validate">
                            <label for="password">Пароль</label>

                        </div>
                        <div class="input-field ">
                            <input id="newpassword" type="password" class="validate" >
                            <label for="newpassword">Новый пароль</label>

                        </div>
                        <div class="input-field ">
                            <input id="confimpassword" type="password" class="validate" >
                            <label for="confimpassword">Повторите пароль</label>
                        </div>
                        <div class="btn-save">
                            <p class="btn-text unselectable">Сохранить</p>
                        </div>
                    </div>
                </div>
                <div class="item" id="block-3">
                    
                </div>
            </div>
        </div>
    </div>  
</template>
<script>
import ColorPicker from '@radial-color-picker/vue-color-picker';
export default {
    name: 'Settings',
    data:()=>({
        isShowBlock:false,
        isCrippier: false,
        tabsbar: null,
        myInfo: {},
        newImages: null,
        nickname:'',
        oldnickname:'',
        name:'',
        bio:'',
        select: null,
        color:null,
    }),
    components: { ColorPicker },
    created(){
        this.StartSettings()
        
    },
    mounted(){
        this.tabsbar = M.Tabs.init(this.$refs.tabsbar);
        M.updateTextFields()
    },
    methods:{
        StartSettings(){
            this.$store.dispatch('fetchUserInfo')
            try{
                this.$store.dispatch('ResetPassword')
                this.myInfo = this.$store.getters.uInfo
                this.oldnickname = this.myInfo.nickname
                this.nickname = this.myInfo.nickname
                this.name = this.myInfo.name
                this.bio = this.myInfo.bio
                this.color= this.$hexToHsl(this.myInfo.color)
            }
            catch(e){}
            
        },
        async onColorSelect(hue){
            const newColor = this.$hslToHex(hue, this.color.saturation, this.color.luminosity)
            try{
                await this.$store.dispatch('UpdateUserColor', newColor)
                this.UpdateParent()
            }
            catch(e){}
        },
        async SaveInfo(){
            const formData={
                oldnick: this.oldnickname,
                nickname:this.nickname,
                name: this.name,
                bio: this.bio
            }
            try{
                await this.$store.dispatch('UpdateUserInfo', formData)
                this.$emit('updateData', this.nickname)
            }
            catch(e){}
        },
        async NewImg(e){
            if(e.target.files != null){
                this.isCrippier= true
                let image = e.target.files[0]
                let reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    //this.newImages = e.target.result
                    this.$refs.croppieRef.bind({
                        url: e.target.result
                    });
                }
            }
        },
        CropImg(){
            let options = {
                type:'base64',
                format: 'jpeg', 
                circle: false
            }
            this.$refs.croppieRef.result(options, (output) => {
                this.newImages = output;
            });
        },
        async SaveImg(){
            await this.CropImg()
            try{
                await this.$store.dispatch('UpdateUserAvatar', this.newImages)
                this.isCrippier= false
                setTimeout(()=>{
                    this.StartSettings()
                    this.UpdateParent()
                }, 0)
                
            }
            catch(e){}
        },
        UpdateParent(){
            this.$emit('update')
        },
        async LogOut(){
			try{
				await this.$store.dispatch('LogOut')
				this.$router.push('/auth')
			}
			catch(e){}
			
		}

    }
}
</script>