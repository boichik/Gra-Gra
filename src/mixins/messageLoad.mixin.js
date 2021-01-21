import _ from 'lodash'
export default{
    data(){
        return{
            pageSize:0,
            countLoad:0,
            pageCount:0,
            allItems:[],
            Items:[],
            
        }
    },
    methods:{
        sPagination(allItems, size){
            this.pageSize = size
            if(allItems.length <= this.pageSize){
                this.Items = allItems
            }
            else{
                if(this.countLoad <= this.pageCount){
                    const reItem = allItems
                    this.allItems = _.chunk(reItem, this.pageSize)
                    _.reverse(this.allItems)
                    this.pageCount = _.size(this.allItems)
                    this.Items = this.countLoad === 0 ?  [...this.allItems[1],...this.allItems[0]] : [...this.allItems[this.countLoad], ...this.Items]
                    this.countLoad === 0 ? this.countLoad = 2 : this.countLoad++
                }
            }
        },
        sPaginationNew(allItems, size){
            this.pageSize = size
            if(allItems.length <= this.pageSize){
                this.Items = allItems
            }
            else{
                this.Items = []
                this.countLoad=0
                const reItem = allItems
                this.allItems = _.chunk(reItem, this.pageSize)
                _.reverse(this.allItems)
                this.pageCount = _.size(this.allItems)
                this.Items = this.pageCount >= 2 ? [...this.allItems[1],...this.allItems[this.countLoad],] : [...this.allItems[this.countLoad]]
                this.countLoad= this.pageCount >= 2 ? 2 : 1
            }
        }
    }
}