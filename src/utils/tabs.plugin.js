export default{
    install(Vue, options){
        Vue.prototype.$tabs = function(){
          // var tabcontent = document.getElementsByClassName("item");
           //tabcontent[0].classList.add('active')
           function onTabClick(event){
               console.log(event)
            // var actives = document.querySelectorAll('.active');

            // // deactivate existing active tab and panel
            // for (var i=0; i < actives.length; i++){
            //   actives[i].className = actives[i].className.replace('active', '');
            // }

            // // activate new tab and panel
            // event.target.parentElement.className += ' active';
            // document.getElementById(event.target.href.split('#')[1]).className += ' active';
          }
          var el = document.getElementById('sidebar');

          el.addEventListener('click', onTabClick, false);
        }
    }
}