import firebase from 'firebase/app'
import _ from 'lodash'

export default{
    state:{
        uInfo:{},
        uID:{},
        uFollowing:[],
        uFollowers:[],
        uPublish:[],
    },
    mutations:{
        SetuInfo(state, info){
            state.uInfo = info
        },
        SetId(state, id){
            state.uID = id
        },
        SetuPublish(state, data){
            state.uPublish = data
        },
        SetuFollowing(state, data){
            state.uFollowing = data
        },
        SetuFollowers(state, data){
            state.uFollowers = data
        },
        ClearuFollowing(state){
            state.uFollowing = []
        },
        ClearuFollowers(state){
            state.uFollowers = []
        },
        ClearuPublish(state){
            state.uPublish = []
        },
        ClearuInfo(state){
            state.uInfo = {}
        },
        ClearuID(state){
            state.uID = {}
        }
    },
    actions:{
        async fetchUserIDDispatch({dispatch, commit}){
            try{
                const uId = await dispatch('getUid')
                return uId
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async fetchUserID({dispatch,commit}){
            try{
                const uId = await dispatch('getUid')
                const data ={
                    id: uId
                }
                commit('SetId', data)
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
       async fetchUserInfo({dispatch, commit}){
            try{
                const uId = await dispatch('getUid')

                const Info = (await firebase.database().ref(`/users/${uId}/info`).once('value')).val()
                commit('SetuInfo', Info)
            }
            catch(e){
               commit('setError', e)
               throw e
            }
       },
       async GetUserIdByNickname({commit}, nickname){
            try{
                let id=''
                const info = (await firebase.database().ref('/nicknames').once('value')).val()
                _.mapKeys(info, (value, keys)=>{
                    if(keys === nickname) return id=value
                })
                return id
            }
            catch(e){
                commit('setError', e)
                throw e
            }
       },
       async fetchUserInfoById({commit}, id){
        try{
            const Info = (await firebase.database().ref(`/users/${id}/info`).once('value')).val()
            return Info
        }
        catch(e){
           commit('setError', e)
           throw e
        }
   },
       async fetchUserInfoById({dispatch, commit}, idx){
            try{

               const Info = (await firebase.database().ref(`/users/${idx}/info`).once('value')).val()
               return Info
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
       async fetchUserIDFollowing({dispatch,commit}, idx){
           try{
                let Following= null
                await firebase.database().ref(`/users/${idx}/following`).once('value', snapshot=>{
                    if(snapshot.val() === null){ return Following = [] }
                    else{
                        let data = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                        data.forEach(item =>{ 
                            firebase.database().ref(`/users/${item.userId}/info`).once('value').then(info=>{
                                item.user_avatar = info.val().avatar,
                                item.user_nickname = info.val().nickname
                            })          
                        })
                        Following = data
                    }
                })
                return Following
           }
           catch(e){
                commit('setError',e)
                throw e

           }
       },
       async fetchUserFollowing({dispatch,commit}){
            try{
                const uId = await dispatch('getUid')

                const Following= (await firebase.database().ref(`/users/${uId}/following`).once('value')).val() || {}
                commit('SetuFollowing', Object.keys(Following).map(key=> ({...Following[key], id:key})))
            }
            catch(e){
                commit('setError',e)
                throw e

            }
        },
       async fetchUserIDFollowers({commit}, idx){
           try{
                let Followers= null
                await firebase.database().ref(`/users/${idx}/followers`).once('value', snapshot=>{
                    if(snapshot.val() === null){ return Followers = [] }
                    else{
                        let data = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                        data.forEach(item =>{ 
                            firebase.database().ref(`/users/${item.userId}/info`).once('value').then(info=>{
                                item.user_avatar = info.val().avatar,
                                item.user_nickname = info.val().nickname
                            })          
                        })
                        Followers = data
                    }
                    
                })
                return Followers
           }
           catch(e){
                commit('setError',e)
                throw e
           }
       },
        async fetchUserFollowers({dispatch,commit}){
                try{
                    const uId = await dispatch('getUid')

                    const Followers= (await firebase.database().ref(`/users/${uId}/followers`).once('value')).val() || {}
                    commit('SetuFollowers', Object.keys(Followers).map(key=> ({...Followers[key], id:key})))
                }
                catch(e){
                    commit('setError',e)
                    throw e
                }
            },
        async fetchUserPublish({dispatch, commit}){
            try{
                const uId = await dispatch('getUid')
                const Publish= (await firebase.database().ref(`/publish`).orderByChild('userId').equalTo(uId).once('value')).val() || {}
                commit('SetuPublish', Object.keys(Publish).map(key=> ({...Publish[key], id:key})) )
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async fetchUserIDPublish({commit}, idx){
            try{
                    const Publish= (await firebase.database().ref(`/publish`).orderByChild('userId').equalTo(idx).once('value')).val() || {}
                    return Object.keys(Publish).map(key=> ({...Publish[key], id:key}))
            }
            catch(e){
                    commit('setError',e)
                    throw e
            }
        },
        async Subscribe({dispatch,commit}, {userId}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/followers/`).push({
                    userId: userId,
                })
                await firebase.database().ref(`/users/${userId}/following/`).push({
                    userId: uId,
                })
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async UnSubscribe({dispatch, commit}, {followersID, followingID, user_id}){
           try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/followers/`+followersID).remove()
                await firebase.database().ref(`/users/${user_id}/following/`+followingID).remove()

           }
           catch(e){
               commit('setError',e)
               throw e
           }
        },
        async fetchStatusUser({dispatch, commit}, id){
            try{
                const data = (await firebase.database().ref(`users/${id}/info`).once('value')).val() || {}
             
                return data.isOnline
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async removeStatus({dispatch, commit}){
            try{
                
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/info`).update({isOnline: false})
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async setStatus({dispatch, commit}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/info`).update({isOnline: true})
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async UpdateUserAvatar({dispatch, commit}, photo){
            try{
                const uId = await dispatch('getUid')
                await firebase.storage().ref(`/users/${uId}/avatar/`+'logo').putString(photo, 'data_url')
                        .then( res =>{
                            res.ref.getDownloadURL().then((downloadURL)=>{
                                firebase.database().ref(`/users/${uId}/info`).update({avatar: downloadURL})
                            })
                        })
                        .catch(err=> console.log(err))
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async UpdateUserInfo({dispatch, commit}, {oldnick,nickname, name, bio}){
            try{
                console.log(oldnick)
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/info`).update({
                    nickname,
                    name,
                    bio
                })
                await firebase.database().ref(`/nicknames/${oldnick}`).set(null)

                
                let data={}
                data[nickname] = uId
                await firebase.database().ref(`/nicknames`).update(data)
                

            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async UpdateUserColor({dispatch, commit}, color){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/users/${uId}/info`).update({color: color})
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        }

    },
    getters:{
       uInfo: s => s.uInfo,
       uPublish: s=> s.uPublish,
       uID: s=> s.uID,
       uFollowing: s=> s.uFollowing,
       uFollowers: s=> s.uFollowers,

    }
}