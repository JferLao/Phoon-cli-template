<template>
  <div @click="show">
    <div class="example">{{ msg }}</div>
    <img src="../assets/images/avatar06.svg" alt="">
    <img :src="avatar">
    <div class="logo">
      <i class="icon icon-jianzhang"></i>
    </div>
    <div class="test"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello world!",
      avatar:require('@/assets/images/avatar08.png')
    };
  },
  methods:{
    show(e){
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/css/sprite';
@import '../assets/css/test';
.example {
  color: yellow;
}

.logo{
  margin:  0 auto;
  width: 200px;
  height: 200px;
  border: 1px solid red;
  .icon{
    display: inline-block;
   
  }
  
}
</style>