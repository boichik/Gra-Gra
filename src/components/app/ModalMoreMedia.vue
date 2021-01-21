<template>
    <!-- Modal Block More Media -->
    <div class="modal-block active">
        <!-- Container -->
        <div class="modal-block-container more-content">
            <!-- Title and button close modal block -->
            <div class="modal-block-container__title">
                <p>Больше...</p>
                <a @click="$emit('close')" class="modal-block-container__btn-close"><i class="material-icons">close</i></a>
            </div>
            <!-- Modal Body -->
            <div class="modal-block-main">
                <!-- Items Container -->
                <div class="modal-block-main-container main-more-content">
                    <div class="items-more-content-container">
                        <a href="#!">Копировать ссылку</a>
                        <a href="#!">Поделится</a>
                        <a href="#!">Помощь</a>
                        <a v-if="isMyMedia" class="modal-btn-delete-photo active" @click="DeleteMedia" >Удалить</a>
                        <a v-else class="modal-btn-delete-photo active" >Пожаловаться</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'ModalMoreMedia',
    props:{
        publishId:{
            required:true
        }
    },
    data:()=>({
        myPublish:[],
        myId:[],
        isMyMedia: false
    }),
    async mounted(){
        await this.$store.dispatch('fetchUserPublish')
        this.myPublish = await this.$store.getters.uPublish
        this.myId = await this.$store.getters.myId

        this.isMyMedia = this.myPublish.map(item=> item.id).some(s=> s===this.publishId.id)
    },
    methods:{
        async DeleteMedia(){
            const FormData= {
                publishId: this.publishId.id
            }
            try{
                await this.$store.dispatch('DeleteMedia', FormData)
                this.$emit('deleteMedia')
            }
            catch(e){}
        }
    }
    
}
</script>