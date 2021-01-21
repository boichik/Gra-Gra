<template>
    <!-- Modal Block More Comment -->
    <div class="modal-block active">
        <!-- Container -->
        <div class="modal-block-container more-comment">
            <!-- Title and button close modal block -->
            <div class="modal-block-container__title">
                <p>Коментарий</p>
                <a @click="$emit('close')" class="modal-block-container__btn-close"><i class="material-icons">close</i></a>
            </div>
            <!-- Modal Body -->
            <div class="modal-block-main">
                <!-- Items Container -->
                <div class="modal-block-main-container main-more-comment">
                    <div class="items-more-comment-container">
                        <a href="#!">Пожаловатся</a>
                        <a href="#!">Помощь</a>
                        <a class="modal-btn-delete-photo" :class="{active : isMyPublish || isMyComment}" @click="DeleteComment">Удалить</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'ModalMoreComment',
    props:{
        comment:{
            required:true
        },
        publishId:{
            required:true
        }
    },
    data:()=>({
        myPublish:[],
        myId:'',
        isMyPublish:false,
        isMyComment:false
    }),
    async mounted(){
        await this.$store.dispatch('fetchUserPublish')
        this.myPublish = await this.$store.getters.uPublish;
        this.myId = await this.$store.getters.uID.id;

        this.isMyPublish = this.myPublish.map(item => item.id).some(s=> s===this.publishId);
        if(this.comment.userId === this.myId){
            this.isMyComment = true
        }
    },
    methods:{
        async DeleteComment(){
            const commentData={
                publishId: this.publishId,
                userId: this.comment.originalUserId,
                commentId: this.comment.id
            }
            try{
                await this.$store.dispatch('RemoveComment', commentData)
                this.$emit('deleteComment', this.publishId)
                this.$emit('close')
            }
            catch(e){}
        }
    }

}
</script>