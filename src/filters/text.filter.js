import Vue from 'vue'
export default function textFilter(value, type){
    if(type=='text'){
        return (value == 'unsubscribe')? 'Подписаться' : 'Отписаться'
    }
    if(type=='date'){
        const option = {}
        option.day = '2-digit'
        option.month = 'numeric'
        option.year = 'numeric'

        return new Intl.DateTimeFormat('ru-RU', option).format(new Date(value))
    }
    if(type=='count'){
        if(!value){
            return 0
        }
        if(value.length <100){
            return value.length
        }
        else{
            return '99+'
        }

    }
    if(type=='message'){
        const decode = Vue.CryptoJS.AES.decrypt(value, `"${process.env.SECRET_KEY}"`).toString(Vue.CryptoJS.enc.Utf8)
        return decode
    }
}