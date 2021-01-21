<template>
  <div id="app" class="app">
    <component :is="layout">
       <router-view/>
    </component>
  </div>
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout" 
import MainLayout from "@/layouts/MainLayout" 
export default {
    name: 'App',
    computed:{
      layout(){
        return (this.$route.meta.layout || 'empty') + '-layout'
      }
    },
    mounted(){
    },
    methods:{
      
    },
    components:{
      EmptyLayout , MainLayout
    },
}
</script>

<style lang='sass'>
@import '~materialize-css/dist/css/materialize.min.css'
@import 'assets/scss/style.scss'
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css'
</style>
