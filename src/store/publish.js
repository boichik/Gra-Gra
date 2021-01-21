import firebase from 'firebase/app'
export default{
    actions:{
        async SavePublish({dispatch, commit}, {date, description, hashtag, items, id}){
            try{
                var publishId =''
                await firebase.database().ref(`/publish`).push({
                    date_publish : date,
                    description : description,
                    hashtag: hashtag,
                    items:[],
                    comments:[],
                    userId:id,
                }).then(res=> publishId = res.key)
                for(var i=0; i<items.length; i++){     
                    firebase.storage().ref(`/publish/${publishId}/`+`item_${i}`).putString(items[i], 'data_url')
                    .then( res =>{
                        res.ref.getDownloadURL().then((downloadURL)=>{
                            firebase.database().ref(`/publish/${publishId}/items`).push({link:downloadURL})
                        })

                    })
                    .catch(err=> console.log(err))
                }
            }
            catch(e){
                commit('setError',e)
                throw e
            }
        },
        async GetAllPublishByUserId({commit}, user_id){
            try{
                return (await firebase.database().ref(`/users/${user_id}/publish`).once('value')).val() || {}
                
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async GetPublishById({dispatch, commit} ,{publishId}){
            try{
                let data = null
                await firebase.database().ref(`/publish/${publishId}`).once('value', snapshot =>{
                    data = snapshot.val()
                    if(data.comments != null){
                        let com = Object.keys(data.comments).map(key=> ({...data.comments[key], id:key}))
                        com.forEach(item=>{
                            firebase.database().ref(`/users/${item.userId}/info`).once('value').then(info=>{
                                item.user_avatar = info.val().avatar,
                                item.user_nickname = info.val().nickname
                            })  
                        })
                        data.comments = com
                    }
                    else{data.comments = []}
                    if(data.likes != null){
                        let com = Object.keys(data.likes).map(key=> ({...data.likes[key], id:key}))
                        com.forEach(item=>{
                            firebase.database().ref(`/users/${item.userId}/info`).once('value').then(info=>{
                                item.user_avatar = info.val().avatar,
                                item.user_nickname = info.val().nickname
                            })  
                        })
                        data.likes = com
                    }
                    else{data.likes = []}
                    data.id = snapshot.key
                    data.items = data.items != null ? Object.keys(data.items).map(key=> ({...data.items[key], id:key})) : []
                    return data
                }) 
                return data
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async GetPublishByUserIdLimit({dispatch, commit}, {user_id, limit}){
            try{
                const Publish= (await firebase.database().ref(`/publish`).orderByChild('userId').equalTo(user_id).limitToLast(limit).once('value')).val() || {}
                return Object.keys(Publish).map(key=> ({...Publish[key], id:key}))
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async DeleteMedia({dispatch, commit}, {publishId}){
            try{
                await firebase.database().ref(`/publish/`+publishId).remove()
            }
            catch(e){
                commit('setError',e)
                throw e 
            }
        },
        async AddComment({dispatch,commit},{publishId, date, message}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/publish/${publishId}/comments`).push({
                        userId: uId,
                        data_comment: date,
                        message: message
                })
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async RemoveComment({commit},{publishId, commentId}){
            try{
                await firebase.database().ref(`/publish/${publishId}/comments/`+commentId).remove()
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async AddLike({dispatch, commit}, {publishId, date}){
            try{
                const uId = await dispatch('getUid')
                await firebase.database().ref(`/publish/${publishId}/likes`).push({
                        userId: uId,
                        data_like: date,
                })
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async ResetLike({ commit}, {publishId, likeId}){
            try{
               await firebase.database().ref(`/publish/${publishId}/likes/`+likeId).remove()
            }
            catch(e){
                commit('setError', e)
                throw e
            }
        },
        async fetchPublishByMain({dispatch,commit}){
            let publish = []
            try{
                const uId = await dispatch('getUid')
                let followers =  (await firebase.database().ref(`/users/${uId}/followers`).once('value')).val() || {}
                followers = Object.keys(followers).map(key=> ({...followers[key], id:key}))
                await followers.forEach(element => {
                    firebase.database().ref(`/publish`).orderByChild('userId').equalTo(element.userId).once('value', snapshot=>{
                        var info = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                        info.map(item=> {
                            item.items = item.items != null ? Object.keys(item.items).map(key=> ({...item.items[key], id:key})) : []
                            item.likes = item.likes != null ? Object.keys(item.likes).map(key=> ({...item.likes[key], id:key})) : []
                            item.comments = item.comments != null ? Object.keys(item.comments).map(key=> ({...item.comments[key], id:key})) : []
                        })
                        publish.push(...info)
                    })   
                })
                await firebase.database().ref(`/publish`).orderByChild('userId').equalTo(uId).once('value', snapshot=>{
                    var info = Object.keys(snapshot.val()).map(key=> ({...snapshot.val()[key], id:key}))
                    info.map(item=> {
                        item.items = item.items != null ? Object.keys(item.items).map(key=> ({...item.items[key], id:key})) : []
                        item.likes = item.likes != null ? Object.keys(item.likes).map(key=> ({...item.likes[key], id:key})) : []
                        item.comments = item.comments != null ? Object.keys(item.comments).map(key=> ({...item.comments[key], id:key})) : []
                    })
                    publish.push(...info)
                })
            }
            catch(e){
                commit('setError', e)
                throw e 
            }
            return publish
        }
    }
}