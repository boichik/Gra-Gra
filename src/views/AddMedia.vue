<template>
    <div class="m-container">
        <div class="add-media-block">
           		<p class="title">Загрузить новое изображение</p>
           		<div v-if="isError" class="info-block">
           			<p><i class="material-icons header_ico">info</i>{{this.errorMsg}}</p>
           		</div>
           		<div class="add-media-block-container">
           			<div class="select-media-block">
           				<img id="SelectItem" alt="">
           			</div>
           			<div class="other-media-block">
           				<div class="item-container">
           					<div class="item" v-for="(img, index) in ImageURL" :key="index" :id="'item-'+index" >
           						<img :src="img" @click="SelectImg(img, index)" alt="">
           						<div class="btn-delete" @click="DeleteImg(img, index)"><i class="material-icons header_ico">clear</i></div>
           					</div>
           				</div>
           				<div class="button">
           					<div class="input-file-container">
    							<input type="file" name="file" id="file" class="input-file" :disabled='!isAddBtn' multiple @change="getMedia">
								<label for="file" class="btn btn-tertiary" :class="{disabled : !isAddBtn}">
     								<i class="material-icons header_ico">file_upload</i>
									<span class="js-fileName">Загрузить файл</span>
    							</label>
							</div>
           				</div>
           			</div>
           		</div>
           		<div class="text-block">
           			<div class="input-field description">
          				<input placeholder="Мое первое фото" id="description" type="text" class="validate" data-length="365" v-model="description">
          				<label for="description">Описание</label>
        			</div>
        			<div ref="chips" class="chips chips-placeholder"></div>
           		</div>
           		<div class="bottom-btn">
           			<div class="btn-save" @click="SavePublish">Сохранить</div>
           			<div class="btn-cancel" @click="ClearDataMedia">Отменить</div>
           		</div>
        </div>
    </div>
</template>
<script>
//Внимание! Загрузка возможна только до 6 файлов. Размер файла не должен превышать более 3 МБ
export default {
    name: 'AddMedia',
    data:()=>({
        description:'',
        hashtag:[],
        loadedImages:[],
        ImageURL:[],
        chips:null,
        lastInxImg:null,
        isAddBtn: true,
        errorMsg:'',
        isError:false,
    }),
    mounted(){
        M.updateTextFields();
        this.chips = M.Chips.init(this.$refs.chips, {placeholder: 'Хеш-тэг'});
        this.hashtag = this.chips.chipsData
       
    },
    methods:{
        getMedia(e){
            var count = 5 - this.ImageURL.length
            var image = e.target.files
            for(var i=0; i<count; i++){
                let reader = new FileReader()
                if(image[i] !='undefined'){
                    reader.readAsDataURL(image[i]);
                    reader.onloadend = e =>{
                    this.ImageURL.push(e.target.result)
                    this.ImageURL.length >= 5 ? this.isAddBtn = false : this.isAddBtn = true
                }
                }
            }
            
        },
        CheckLengh(){
            this.ImageURL.length >= 5 ? this.isAddBtn = false : this.isAddBtn = true
        },
        SelectImg(value, inx){

            if(this.lastInxImg != null) document.getElementById(`item-${this.lastInxImg}`).classList.remove('active')
            document.getElementById('SelectItem').src = value
            document.getElementById(`item-${inx}`).classList.add('active')
            this.lastInxImg = inx
        },
        DeleteImg(value, inx){
            if(document.getElementById(`item-${inx}`).classList.contains('active')){
                this.lastInxImg = null
            }
            const Index = this.ImageURL.indexOf(value)
            if(Index > -1){
                this.ImageURL.splice(Index, 1)
            }
            
            this.ImageURL.length > 0 ? this.SelectImg(this.ImageURL[0], 0) : document.getElementById('SelectItem').src = null
            this.CheckLengh()
        },
        setImg(value){
            this.$refs.croppieRef.bind({
                    url: value
                });
        },
        ClearDataMedia(){
            this.isError = false
            this.errorMsg = '',
            this.ImageURL = [],
            this.lastInxImg = null,
            this.description=''
            this.hashtag=[]
            this.loadedImages=[]
            this.isAddBtn = true
            this.chips = M.Chips.init(this.$refs.chips, {placeholder: 'Хеш-тэг'});
            document.getElementById('SelectItem').src = null
        },
        async SavePublish(){
            if(this.ImageURL.length <=0){
                this.errorMsg = 'Внимание! Перед сохранением публикации добавьте минимально одно изображение'
                this.isError = true
            }
            else{
                const userInfo = this.$store.getters.uInfo
                const uId = await this.$store.dispatch('fetchUserIDDispatch')
                const formData ={
                    date: new Date().toString(),
                    description : this.description,
                    hashtag: this.hashtag,
                    items: this.ImageURL,
                    id: uId,
                }
                try{
                    await this.$store.dispatch('SavePublish', formData)
                    this.ClearDataMedia()
                }
                catch(e){}
            }

        }
    }
}
</script>