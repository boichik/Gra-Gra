<template>
    <div>
        <ModalMoreMedia v-if="isModalMoreMedia" @close='SetModalMoreMedia' :publishId='selectItem' @deleteMedia='UpdatePage'/>
        <ModalFollowers v-if="isModalFollowers" :title="'Кому понравилась запись'" :followItem='selectItem.likes' :userID='selectItem.userId' @close='SetModalFollowers' />
        <ModalMoreComment v-if="isModalMoreComment" @close='CloseModalMoreMedia' :comment='selectCommentData' :publishId='selectItem.id' @deleteComment="UpdateSelect"/>
        <!-- Block Select Media (active) -->
        <div class="select-media active">
            <!-- Button close block -->
            <a @click="$emit('closeSelect')" class="btn-close"><i class="material-icons medium">close</i></a>
            <!-- Container -->
            <div class="select-media-container">
                <!-- Media (Photos, Videos) -->
                <div class="select-media-container__media">
                    <!-- Media -->
                    <Loader v-if="loading"/>
                    <div ref='carousel' class="carousel carousel-slider">
                        <img class="carousel-item" v-for="image in selectItem.items" :key="image.id"  :src="image.link" alt="">
                    </div>		
                    <!-- Media Info Block -->
                    <div v-if="!loading" class="select-media-container__media__info" :class="{max : isInfo}">
                        <!-- Info (count likes, count comments, date publish, button more) -->
                        <div class="info-media-header">
                            <div class="info-media-header-container">
                                <a @click="isLike ===false ? SetLike() : DisLike()" class="info-media-header-container__like-btn" :class="{active : isLike==true}"><i class="material-icons">favorite</i></a>
                                <a @click="SetModalFollowers" class="info-media-header-container__likes-count">{{(selectItem.likes != null) ? selectItem.likes.length : 0}}</a>
                            </div>
                            <p href="#!" class="info-media-header__coments"><i class="material-icons">mode_comment</i><span>{{(selectItem.comments != null) ? selectItem.comments.length : 0}}</span></p>
                            <p class="info-media-header__date">{{selectItem.date_publish | text('date')}}</p>
                            <a @click="isInfo = !isInfo" class="btn-drop-1 r-0"><i class="material-icons">{{ isInfo ? 'arrow_drop_up' : 'arrow_drop_down'}}</i></a>
                        </div>
                        <!-- Block Descriptions -->
                        <div class="info-media-main">
                            <p class="info-media-main__title">Описание:</p>
                            <!-- 870 znako -->
                            <p class="info-media-main__description">{{selectItem.description}}</p>
                        </div>
                        <!-- Block HashTags -->
                        <div v-if="selectItem.hashtag != null" class="info-media-footer">
                            <p class="info-media-footer__title">Хеш-тєг:</p>
                            <!-- 870 znako -->
                            <div class="info-media-footer__tag">
                                <a href="" v-for="(hashtag,index) in selectItem.hashtag" :key="index">{{hashtag.tag}}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Block Comments -->
                <div class="select-media-container__blockComent">
                    <div class="comment-header">
                        <div class="comment-header__photo">
                            <div class="circle-photo">
                                <img :src="info.avatar" alt="">
                            </div>
                        </div>
                        <a  class="user-name">{{info.nickname}}</a>
                        <a @click="SetModalMoreMedia" class="btn-more"><i class="material-icons">more_horiz</i></a>
                    </div>
                    <div class="comment-block">
                        <Loader v-if="loading"/>
                        <div v-else  class="comment-block-container">         
                            <div class="comment-item" v-for="comment in selectItem.comments" :key="comment.id"> 
                                <div class="comment-item-container">
                                    <div class="comment-item-container__user_info">
                                        <a href="#!" class="user_photo">
                                            <div class="circle-comment-photo">
                                                <div class="circle-photo">
                                                    <img :src="comment.user_avatar" alt="">
                                                </div>		
                                            </div>
                                        </a>
                                    </div>
                                    <a @click='SetModalMoreComment(comment.id, comment.userId)' class="btn-more comment"><i class="material-icons">more_horiz</i></a>
                                    <div class="comment-item-container__text">
                                        <a href="#!" class="user-name">{{comment.user_nickname}}</a>
                                        <p>{{comment.message}}</p>
                                    </div>
                                </div>
                                <div class="comment-item-container">
                                    <div class="comment-item-container__date">{{comment.data_comment | text('date')}}</div>
                                    <a @click="AnswerComment(comment.userId, comment.user_nickname)" class="btn-reply">Ответить</a>
                                </div>			
                            </div>
                        </div>
                    </div>
                    <div class="comment-bottom">
                        <form class="comment-bottom-container">
                            <textarea autocomplete="false" autocorrect="off" placeholder="Введите коментарий..." class="text-area" v-model="message"></textarea>
                            <a @click="SendComment" class="button-submit">Отправить</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/app'

export default {
    name:'ModalSelectMedia',
    data:()=>({
        loading: false,
        carousel:null,
        isInfo:false,
        message:'',
        answerUser:[],
        selectCommentData:{},
        isLike:false,
        myId:'',
        myInfo:null,
        userInfo: null,
        isModalFollowers:false,
        isModalMoreMedia:false,
        isModalMoreComment:false,

    }),
    props:{
        selectItem:{
            required:true
        },
        info:{
            required:true
        }
    },
    async created(){
        //this.userInfo = await this.$store.dispatch('fetchUserInfoById', this.selectItem.userId)
        this.myId =  this.$store.getters.uID.id
        this.myInfo = this.$store.getters.uInfo
        if(this.selectItem.likes !=null){
          this.isLike = this.selectItem.likes.map(like=> like.userId).some(l=> l ==this.myId)
        } else{this.isLike = false}
    },
    mounted(){
        M.Carousel.init(this.$refs.carousel, {indicators: true})
        window.addEventListener('resize', (e)=>{
            this.carousel = M.Carousel.init(this.$refs.carousel, {indicators: true})
        })
    },
    methods:{
        async SendComment(){
            const formData ={
                publishId: this.selectItem.id,
                user_id: this.selectItem.userId,
                date: new Date().toString(),
                message: this.message
            }
            try{
                await this.$store.dispatch('AddComment', formData)
                this.message=''
                this.UpdateSelect() 
            }
            catch(e){}
        },
        async SetLike(){
            const formData ={
                publishId: this.selectItem.id,
                user_id: this.selectItem.userId,
                date: new Date().toString(),
            }
            try{
                await this.$store.dispatch('AddLike', formData)
                this.isLike = true
                this.UpdateSelect()
            }
            catch(e){}
            
        },
        async DisLike(){
            
            let LikeID = null
            this.selectItem.likes !=null ? LikeID = this.selectItem.likes.map(like=> like.userId === this.myId ? like.id : null).toString() : null
            if(LikeID == null){
                return
            }
            const formDataLike = {
                publishId: this.selectItem.id,
                userId: this.selectItem.userId,
                likeId: LikeID  
            }
            try{
                await this.$store.dispatch('ResetLike', formDataLike)
                this.isLike = false
                this.UpdateSelect()
            }
            catch(e){}
        },
        UpdateSelect(){
            const data ={
                id: this.selectItem.id,
                userId: this.selectItem.userId
            }
           
            this.$emit('updateSelect', this.selectItem.id,this.selectItem.userId )
        },
        CloseModalMoreMedia(){
            this.isModalMoreComment=false
        },
        SetModalMoreComment(id,userId){
            this.selectCommentData = {
                id,
                userId,
                originalUserId: this.selectItem.userId
            }
            this.isModalMoreComment = true
        },
        SetModalMoreMedia(){
            this.isModalMoreMedia = !this.isModalMoreMedia
        },
        SetModalFollowers(){
            this.isModalFollowers= !this.isModalFollowers
        },
        AnswerComment(id, nickname){
            this.answerUser.push(id)
            this.message='@'+nickname
        }
    }
    
}
</script>