<template>
    <Loader v-if="loading"/>
    <div v-else class="main-container-usermedia ">
        <!-- User Media -->
        <div class="main-container-usermedia__media">
            <a v-for="item in publish" :key="item.id" @click="getModalSelect(item.id)"  class="media-item">
                <img :src="item.items[0].link" alt="">
                <div class="media-item-info">
                    <div class="media-item-info__like">
                        <i class="material-icons">favorite</i><span>{{item.likes | text('count')}}</span>
                    </div>
                    <!-- Count comments -->
                    <div class="media-item-info__comment">
                        <i class="material-icons">mode_comment</i><span>{{item.comments | text('count')}}</span>
                    </div>
                </div>
            </a>
        </div>
        <EmptyBlock v-if="!publish.length" :title="'Публикаций нет'" />
    </div>
</template>
<script>
export default {
    name:'AuserMeida',
    data:()=>({
        loading: true,
    }),
    props:{
        publish:{
            required:true
        }
    },
    mounted(){
        this.loading = false
    },
    methods:{
        getModalSelect(value){
            this.$emit('selectMedia', value)
        }
    }
}
</script>