<template>
   <div>
       <Layout v-if="user.id!=null">
         <!--侧边栏-->
         <Sider>
           <Menu :active-name="activeName" style="text-align: center;">
             <br/><br/>
             <Tooltip content="点击更换头像">
               <Upload
                 :format="['jpg','jpeg','png']"
                 :max-size="2048*5"
                 :on-success="handleSuccess"
                 :show-upload-list="false"
                 type="drag"
                 action="http://localhost:8091/upload/image"
                 style="display: inline-block;">
                 <img :src="user.image" style="border-radius:50%;height: 60px;width: 60px;">
               </Upload>
             </Tooltip>
             <br/><br/><br/>
             <MenuItem name="info" to="/info">基本信息</MenuItem>
             <MenuItem name="myMessage" to="/myMessage">我的消息</MenuItem>
             <MenuItem name="myArticle" to="/myArticle">我的文章</MenuItem>
             <MenuItem name="follow" to="/myFollow">我的收藏</MenuItem>
             <MenuItem name="star" to="/myStar">我赞过的</MenuItem>
             <MenuItem name="view" to="/myView">浏览历史</MenuItem>
             <MenuItem name="logout" to="/logout">退出登录</MenuItem>
             <br/><br/><br/><br/><br/><br/><br/><br/>
           </Menu>
         </Sider>
         <!--主要部分-->
           <Content style="margin-left: 50px">
             <Card style="height: 660px">
               <router-view></router-view>
             </Card>
           </Content>
       </Layout>
       <div v-else style="height: 600px;text-align: center;font-size: 50px">
         <br/><br/><br/>
         请登录后查看
       </div>
   </div>
</template>

<script>
    export default {
        name: "Personal",
        data(){
          return{
             activeName:'info',
             user:{
               id:'',
               name:'',
               image:'https://i.loli.net/2017/08/21/599a521472424.jpg',
               birthday:'',
               sex:'',
               email:'',
               phone:'',
               address:''
             }
          }
        },
       methods:{
          getUserById(id){
             if (id==null) return;
             this.$axios.get(this.$USER_URL+"/user/"+id).then((resp)=>{
                 this.user = resp.data
             })
          },
           //图片上传成功
           handleSuccess(response, file, fileList){
             this.user.image = response
             this.$axios.put(this.$USER_URL+"/user",this.user).then(()=>{

             })
           },
       },
       mounted() {
          this.getUserById(sessionStorage.getItem("user"))
       },
        watch:{
          $route(to,from){
            const path = to.path.split("/")
            this.activeName = path[1]
          }
        }
    }
</script>

<style scoped>

</style>
