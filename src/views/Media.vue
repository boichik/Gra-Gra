<template>
    <div class="m-container">
        <ModalMoreMedia v-if="isModalMoreMedia" @close='SetModalMoreMedia' :publishId='selectedPublish' @deleteMedia='UpdatePage'/>
        <ModalFollowers v-if="isModalFollowers" :title="'Кому понравилась запись'" :followItem='selectedPublish.likes' :userID='selectedPublish.userId' @close='SetModalFollowers' />
        <ModalMoreComment v-if="isModalMoreComment" @close='CloseModalMoreMedia' :comment='selectCommentData' :publishId='selectedPublish.id' @deleteComment="SetSelectPublish"/>
        
        <a @click="$router.go(-1)" class="btn-main-back">Назад</a>
        <Loader v-if="loading"/>
        <div v-else class="main-container">
            <div  class="view-media">
                <div class="view-media-container">
                    <div class="view-media-container__media">
                        <div ref="car" class="carousel carousel-slider">
                            <img class="carousel-item" v-for="(img, index) in selectedPublish.items" :key="index" :src="img.link">
                        </div>
                        <div class="view-media-container__media__info" :class="{max : isInfo}">
                            <!-- Info (count likes, count comments, date publish, button more) -->
                            <div class="info-media-header">
                                <div class="info-media-header-container">
                                    <a @click="SetLike()" class="info-media-header-container__like-btn" :class="{active : isLike==true}"><i class="material-icons">favorite</i></a>
                                    <a @click="SetModalFollowers" class="info-media-header-container__likes-count">{{(selectedPublish.likes != null) ? selectedPublish.likes.length : 0}}</a>
                                </div>
                                <p href="#!" class="info-media-header__coments"><i class="material-icons">mode_comment</i><span>{{(selectedPublish.comments != null) ? selectedPublish.comments.length : 0}}</span></p>
                                <p class="info-media-header__date">{{selectedPublish.date_publish | text('date')}}</p>
                                <a @click="isInfo = !isInfo" class="btn-drop-1 r-0"><i class="material-icons">{{ isInfo ? 'arrow_drop_up' : 'arrow_drop_down'}}</i></a>
                            </div>
                            <!-- Block Descriptions -->
                            <div class="info-media-main">
                                <p class="info-media-main__title">Описание:</p>
                                <!-- 870 znako -->
                                <p class="info-media-main__description">{{selectedPublish.description}}</p>
                            </div>
                            <!-- Block HashTags -->
                            <div class="info-media-footer">
                                <p class="info-media-footer__title">Хеш-тєг:</p>
                                <!-- 870 znako -->
                                <div class="info-media-footer__tag">
                                    <a href="" v-for="(hashtag,index) in selectedPublish.hashtag" :key="index">{{hashtag.tag}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="view-media-container__comments">
                        <div class="comment-header">
                                <div class="comment-header__photo">
                                    <div class="circle-photo">
                                        <img :src="Info.avatar" alt="">
                                    </div>
                                </div>
                                <a  class="user-name">{{Info.nickname}}</a>
                                <a @click="SetModalMoreMedia" class="btn-more"><i class="material-icons">more_horiz</i></a>
                            </div>
                            <div class="comment-block">
                                <div class="comment-block-container">
                                    <div class="comment-item" v-for="(comment, index) in selectedPublish.comments" :key="index">
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
                                            <a @click='SetModalMoreComment(comment.id, comment.userId)' class="btn-more"><i class="material-icons">more_horiz</i></a>
                                            <div class="comment-item-container__text">
                                                <a  class="user-name">{{comment.user_nickname}}</a>
                                                <p>{{comment.message}}</p>
                                            </div>
                                        </div>
                                        <div class="comment-item-container bottom">
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
            <h5>Смотри так же:</h5>
            
            <div  class="main-container-usermedia ">
                <!-- Title -->
                <!-- User Media -->

                <div class="main-container-usermedia__media views-media">
                    <a  v-for="(item, index) in otherPublish" :key="index" @click="SetNewItem(item.id)" class="media-item">
                        <img :src="item.items[0].link" alt="">
                        <div class="media-item-info">
                            <div class="media-item-info__like ta-r">
                                <i class="material-icons">favorite</i><span>{{(item.likes != null) ? item.likes.length : 0}}</span>
                            </div>
                            <!-- Count comments -->
                            <div class="media-item-info__comment">
                                <i class="material-icons">mode_comment</i><span>{{(item.comments != null) ? item.comments.length : 0}}</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div @click="GotoUser" class="btn-more-media-user">Все публикации</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'Media',
    data:()=>({
        publishId:'',
        selectedPublish:{},
        isLike:false,
        otherPublish:[], 
        car:null,
        loading: true,
        isInfo:false,
        message:'',
        answerUser:[],
        selectCommentData:{},
        myId:'',
        myInfo:null,
        Info:null,
        isModalFollowers:false,
        isModalMoreMedia:false,
        isModalMoreComment:false,
    }),
    created(){
        this.StartMedia()
    },
    async mounted(){
        window.addEventListener('resize', (e)=>{
            this.car = M.Carousel.init(this.$refs.car, {indicators: true})
        })
    },
    watch:{
        '$route'(to,from){
            this.loading=true
            //this.car = null
            this.StartMedia()
            
        }    
    },
    methods:{
        async StartMedia(){
            this.publishId = this.$route.params.id
            
            try{
                
                this.selectedPublish = await this.$store.dispatch('GetPublishById', {publishId: this.publishId})
                this.Info = await this.$store.dispatch('fetchUserInfoById', this.selectedPublish.userId )
                const formData = {
                    user_id : this.selectedPublish.userId,
                    limit: 8 
                }
                this.otherPublish = await this.$store.dispatch('GetPublishByUserIdLimit', formData)
                this.otherPublish.map(item=> {
                    item.items= item.items != null ? Object.keys(item.items).map(key=> ({...item.items[key], id:key})) : [],
                    item.likes= item.likes != null ? Object.keys(item.likes).map(key=> ({...item.likes[key], id:key})) : [],
                    item.comments = item.comments != null ? Object.keys(item.comments).map(key=> ({...item.comments[key], id:key})) : []
                })
                this.myId = await this.$store.getters.uID.id
                this.myInfo = await this.$store.getters.uInfo
                if(this.selectedPublish.likes !=null){
                this.isLike = this.selectedPublish.likes.map(like=> like.userId).some(l=> l ==this.myId)
                } else{this.isLike = false}
                this.loading=false
                   
            }
            catch(e){}
            this.$nextTick(() => {
                this.car = M.Carousel.init(this.$refs.car, {indicators: true})
            });
            
        },
        GotoUser(){
            const nickname = this.Info.nickname
            this.$router.push(`/a/${nickname}`)
        },
        SetNewItem(id){
            this.$router.push(`/m/${id}`)
        },
        async SetSelectPublish(){
            this.selectedPublish = await this.$store.dispatch('GetPublishById', {publishId: this.publishId})
        },
        async SendComment(){
            const formData ={
                publishId: this.selectedPublish.id,
                user_id: this.selectedPublish.userId,
                avatar: this.myInfo.avatar,
                nickname: this.myInfo.nickname,
                date: new Date().toString(),
                message: this.message
            }
            try{
                await this.$store.dispatch('AddComment', formData)
                this.message=''
                this.SetSelectPublish()
            }
            catch(e){}
        },
        async SetLike(){
            if(this.isLike==false){
                const formData ={
                    publishId: this.selectedPublish.id,
                    user_id: this.selectedPublish.userId,
                    avatar: this.myInfo.avatar,
                    nickname: this.myInfo.nickname,
                    date: new Date().toString(),
                }
                try{
                    console.log('like')

                    await this.$store.dispatch('AddLike', formData)
                    this.isLike = true
                    this.SetSelectPublish()

                }
                catch(e){}
            }
            else{
                if(this.isLike==true){
                    let LikeID = null
                    this.selectedPublish.likes !=null ? LikeID = this.selectedPublish.likes.map(like=> like.userId === this.myId ? like.id : null).toString() : null
                    if(LikeID == null){
                        return
                    }
                    const formDataLike = {
                        publishId: this.selectedPublish.id,
                        userId: this.selectedPublish.userId,
                        likeId: LikeID  
                    }
                    try{
                        console.log('dislike')

                        await this.$store.dispatch('ResetLike', formDataLike)
                        this.isLike = false
                        this.SetSelectPublish()

                    }
                    catch(e){}
                }
            }
        },
        CloseModalMoreMedia(){
            this.isModalMoreComment=false
        },
        SetModalMoreComment(id,userId){
            this.selectCommentData = {
                id,
                userId,
                originalUserId: this.selectedPublish.userId
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