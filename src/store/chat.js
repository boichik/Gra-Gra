import firebase from 'firebase/app'
export default{
    state:{
        uChats:[]
    },
    mutations:{
        SetuChats(state, info){
            state.uChats = info
        },
    },
    getters:{
        uChats: s => s.uChats
    },
    actions:{
        async CreateNewChat({dispatch, commit}, {userId, date, user1_avatar,user1_nickname,user2_avatar,user2_nickname,}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/chats`).push({
                    date_created: date,
                    userId1: userId,
                    userId2: uId,
                    // user1_avatar: user1_avatar,
                    // user1_nickname: user1_nickname,
                    // user2_avatar,
                    // user2_nickname,
                    messages:[],
                    last_change: date,
                })
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async fetchChats({dispatch, commit}){
            try{
                var chats=[]
                const uId = await dispatch('getUid')
                await firebase.database().ref('/').child(`chats`).orderByChild('userId2').equalTo(uId).once('value', snapshot=>{
                    if(snapshot.val() !=null){
                        var data = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                        data.forEach(item =>{ 
                            //item.messages = item.messages != null ? Object.keys(item.messages).map(key=> ({...item.messages[key], id:key})) : []
                            firebase.database().ref(`/users/${item.userId1}/info`).once('value').then(info=>{
                                item.user1_avatar = info.val().avatar,
                                item.user1_nickname = info.val().nickname
                                item.isOnline = info.val().isOnline
                            })
                            firebase.database().ref(`/users/${item.userId2}/info`).once('value').then(info=>{
                                item.user2_avatar = info.val().avatar,
                                item.user2_nickname = info.val().nickname
                            })           
                        })
                        chats.push(...data)
                    }
                })
                await firebase.database().ref('/').child(`chats`).orderByChild('userId1').equalTo(uId).once('value', snapshot=>{
                    if(snapshot.val() !=null){
                        var data = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                        data.forEach(item =>{ 
                           // item.messages = item.messages != null ? Object.keys(item.messages).map(key=> ({...item.messages[key], id:key})) : []
                            firebase.database().ref(`/users/${item.userId1}/info`).once('value').then(info=>{
                                item.user1_avatar = info.val().avatar,
                                item.user1_nickname = info.val().nickname
                            }) 
                            firebase.database().ref(`/users/${item.userId2}/info`).once('value').then(info=>{
                                item.user2_avatar = info.val().avatar,
                                item.user2_nickname = info.val().nickname
                                item.isOnline = info.val().isOnline
                            })          
                        })
                        chats.push(...data)
                    }
                })
                commit('SetuChats', chats)

            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async fetchChat({dispatch,commit} ,{id}){
            try{
                return (await firebase.database().ref(`/chats/${id}`).once('value')).val() || {}      
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        // Not Use
        async FetchMessages({commit}, id){
            try{
               let mas=[]
              const data =  await firebase.database().ref(`/chats/${id}/message`).on('child_added', (snapshot, prevChildKey)=>{
                    snapshot.forEach(item =>{
                        console.log(item.val())
                    })
              })
                //console.log(mas)
               
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async SendMessage({dispatch, commit},{date, chatId, to, message}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/chats/${chatId}/messages`).push({
                    date: date,
                    to:to,
                    from: uId,
                    message: message,
                    isRead:false

                })
                await firebase.database().ref(`/chats/${chatId}`).update({last_change: new Date()})
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async isRead({dispatch, commit}, {chatId}){
            const uId = await dispatch('getUid')
            try{       
                await firebase.database().ref(`/chats/${chatId}/messages/`).orderByChild('to').equalTo(uId).once('value',snapshot=>{
                    snapshot.forEach(item=>{
                        if(item.val().isRead == false) {
                            firebase.database().ref(`/chats/${chatId}/messages/${item.key}`).update({isRead:true})
                        }
                    })
                })

            }
            catch(e){
                commit('setError',e)
                throw e
            }
        }
    }
}