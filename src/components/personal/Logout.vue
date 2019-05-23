<template>

</template>

<script>
    export default {
        name: "Logout",
        methods:{
          logout(){
            this.$Modal.confirm({
              title:'是否退出登录?',
              onOk:()=>{
                this.$axios.get(this.$USER_URL+"/user/logout").then(()=>{
                  sessionStorage.removeItem("user")
                  this.$Message.success("退出成功!");
                  window.location.href='http://localhost:8080'
                }).catch(()=>{
                  this.$Message.error("出现未知错误!");
                })
              }
            })
          }
        },
        mounted() {
           this.logout()
        }
    }
</script>

<style scoped>

</style>
