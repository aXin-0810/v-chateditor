import chateditor from './src/components/chatScreen'

export default {
    install(Vue, options){

        // 声明组件
        Vue.component('v-chateditor', chateditor);

        // 添加全局实例方法
        // Vue.prototype.$objName={
        //     a:function(){},
        //     b:function(){},
        // }

        // 过滤器
        // Vue.filter('filterName', function (value) {
            
        // })

        
        // 注册一个全局自定义指令 `v-focus`
        // Vue.directive('focus', {
        //     // 当被绑定的元素插入到 DOM 中时……
        //     inserted (el) {
        //         // 元素
        //         el
        //     },
        //     // 只调用一次，指令第一次绑定到元素时调用。初始化设置。
        //     bind (el, binding, vnode, oldVnode) {
        //         // 逻辑...
        //     },
        //     // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
        //     update () {

        //     },
        //     // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
        //     componentUpdated () {

        //     },
        //     // 只调用一次，指令与元素解绑时调用。
        //     unbind () {

        //     },
        // })
        


    }
};
