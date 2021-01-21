<template>
    <div class="empty-block">
        <div class="main">
            <div class="block-1">
                <div class="circle"></div>
            </div>
            <div class="block-2">
                <div class="circle"></div>
            </div>
            <div class="block-3">
                <div class="circle"></div>
            </div>
            <p class="title unselectable">{{title}}</p>
        </div>
        <div class="block-shadow">
            <div class="shadow-1">
                <div class="circle"></div>
            </div>
            <div class="shadow-2">
                <div class="circle"></div>
                
            </div>
            <div class="shadow-3">
                <div class="circle"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'EmptyBlock',
    props:{
        title: String
    }
}
</script>