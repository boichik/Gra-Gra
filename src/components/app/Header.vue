<template>
    <header class="header">
		<div class="m-container">
			<!-- Header Navbar Mobile version -->
			<div class="header-nav-mobile">
				<div class="header-nav__logo"><h3>Gra Gra</h3></div>
				<a @click="LogOut" class="header-nav__button">Выйти</a>
            </div>

			<!-- Header Navbar Desctop version -->
			<div class="header-nav">
				<div class="header-nav__logo"><h3>Gra Gra</h3></div>
				<div class="input-container">
                	<input placeholder="Поиск..." class="input-container__input-search browser-default" type="text">
            	</div>
				<router-link
					v-for="link in links"
					:key="link.url"
					tag="a"
					:class="link.class"
					active-class="active"
					:to="link.url"
          			exact
        		>
				<a href="#!" class="header-btn"><i class="material-icons header_ico">{{link.ico}}</i></a>
				</router-link>
			</div>
		</div>
	</header>
</template>
<script>
export default {
	name: 'Header',
	data:()=>({
		nickname:'',
		links:[
			{ url:'/',ico:'home', class:'header-nav__main-btn header-btn'},
           	{ url:'/add-media',ico:'add_circle_outline', class:'header-nav__add-btn header-btn'},
           	{ url:'/chat',ico:'chat', class:'header-nav__chat-btn header-btn'},
           	{ url:`/a/`,ico:'account_circle', class:'header-nav__account-btn header-btn'},
		],
	}),
	async created(){
		await this.$store.dispatch('fetchUserInfo')
		this.nickname = this.$store.getters.uInfo.nickname
		
		
		this.setUrl()
	},
	methods:{
		async setUrl(){
			this.links[3].url = `/a/${this.nickname}`
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