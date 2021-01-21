<template>
    <footer class="footer">
		<div class="m-container">
			<!-- Sidebar for mobile version -->
			<div class="footer-nav-mobile">
				<router-link
					v-for="link in links"
					:key="link.url"
					tag="a"
					:class="link.class"
					active-class="active"
					:to="link.url"
          			exact
        		>
				<a href="#!" class="footer-btn"><i class="material-icons">{{link.ico}}</i></a>
				</router-link>
			</div>
			<div class="footer-nav">
				<p>@GRA GRAM</p>
			</div>
		</div>
	</footer>
</template>
<script>
export default {
	name: 'Footer',
	data:()=>({
		nickname:'',
		links:[
			{ url:'/',ico:'home', class:'footer-nav-mobile__main-btn footer-btn'},
           	{ url:'/add-media',ico:'add_circle_outline', class:'footer-nav-mobile__add-btn footer-btn'},
           	{ url:'/chat',ico:'chat', class:'footer-nav-mobile__chat-btn footer-btn'},
           	{ url:`/a/`,ico:'account_circle', class:'footer-nav-mobile__account-btn footer-btn'},
		],
	}),
	async created(){
		await this.$store.dispatch('fetchUserInfo')
		this.nickname = this.$store.getters.uInfo.nickname
		this.setUrl()
	},
	methods:{
		async setUrl(){
			await this.$store.dispatch('fetchUserID')
			let nickname = this.$store.getters.uInfo.nickname
			this.links[3].url = `/a/${nickname}`
		}
	}
}
</script>