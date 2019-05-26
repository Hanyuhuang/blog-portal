<template>

</template>

<script>
    export default {
        name: "MyMessage",
        data(){
          return{

          }
        },
        methods:{
           getMyMessages(){
              this.$axios.get().then((resp)=>{

              }).catch(()=>{
                this.$Message.info("你的登录已过期，请重新登录！")
                sessionStorage.removeItem("user")
                this.$router.push(this.$route.fullPath)
              })
           }
        }
    }
</script>

<style scoped>

</style>
