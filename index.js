import chateditor from './src/components/chatScreen'

export default {
    install(Vue, options){

        // 声明组件
        Vue.component('v-chateditor', chateditor);

        


    }
};
