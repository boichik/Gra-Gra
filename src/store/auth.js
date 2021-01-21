import firebase from 'firebase/app'
export default{
    actions:{
        async Login({dispatch, commit}, {email,password}){
            try{
                await firebase.auth().signInWithEmailAndPassword(email,password)
                const uId = await dispatch('getUid')
            await firebase.database().ref(`/users/${uId}/info`).update({isOnline: true})

            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async LogOut({dispatch,commit}){
            const uId = await dispatch('getUid')
            await dispatch('removeStatus')
            await firebase.auth().signOut()
            await commit('ClearuInfo')
            await commit('ClearuID')
            await commit('ClearuPublish')
            await commit('ClearuInfo')
            await commit('ClearuFollowing')
            await commit('ClearuFollowers')
        },
        async Register({dispatch, commit}, {nickname, name, bio, photo, password, email, phone}){

            try{
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/info`).set({
                    nickname: nickname,
                    name: name,
                    bio: bio,
                    phone: phone,
                    isOnline: true,
                    isAdmin:false,
                    color: '#783939'
                })
                let data={}
                data[nickname] = uId
                await firebase.database().ref(`nicknames`).update(data)
                if(photo != null){
                    firebase.storage().ref(`/users/${uId}/avatar/`+'logo').putString(photo, 'data_url')
                    .then( res =>{
                        res.ref.getDownloadURL().then((downloadURL)=>{
                            firebase.database().ref(`/users/${uId}/info`).update({avatar: downloadURL})
                        })
                    })
                    .catch(err=> console.log(err))
                }
            }
            catch(e){
                commit('setError', e)
                throw e
            }

        },
        async ResetPassword({dispatch,commit}){
            try{
                const user = await firebase.auth().currentUser
                console.log(user)
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async getUid(){
           const user = await firebase.auth().currentUser
           return user ? user.uid : null
        }
    }
}