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
                 action="http://212.64.122.153:8090/upload/image"
                 style="display: inline-block;">
                 <img :src="user.image" style="border-radius:50%;height: 60px;width: 60px;">
               </Upload>
             </Tooltip>
             <br/><br/><br/>
             <MenuItem name="info" to="/info"><Icon type="md-person" />基本信息</MenuItem>
             <MenuItem name="myNotice" to="/myNotice"><Icon type="md-notifications" /><Badge dot :count="count">我的消息</Badge></MenuItem>
             <MenuItem name="myArticle" to="/myArticle"><Icon type="ios-paper" />我的文章</MenuItem>
             <MenuItem name="myFollow" to="/myFollow"><Icon type="md-heart" />我的收藏</MenuItem>
             <MenuItem name="myStar" to="/myStar"><Icon type="md-thumbs-up" />我赞过的</MenuItem>
             <MenuItem name="myView" to="/myView"><Icon type="md-eye" />浏览历史</MenuItem>
             <MenuItem name="logout" to="/logout"><Icon type="md-exit" />退出登录</MenuItem>
             <br/><br/><br/><br/><br/><br/><br/><br/>
           </Menu>
         </Sider>
         <!--主要部分-->
           <Content style="margin-left: 50px">
             <Card :dis-hover="true" style="height: 669px">
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
               image:'',
               birthday:'',
               sex:'',
               email:'',
               phone:'',
               address:''
             },
             count:0,
          }
        },
       methods:{
          getUserById(id){
             if (id==null) return;
             this.$axios.get(this.$BASE_URL+"/user/"+id).then((resp)=>{
               this.user = resp.data
             })
          },
           //图片上传成功
           handleSuccess(response, file, fileList){
             this.user.image = response
             this.$axios.put(this.$BASE_URL+"/user",this.user).then(()=>{
             })
           },
       },
       mounted() {
         this.getUserById(sessionStorage.getItem("user"))
          this.count = parseInt(localStorage.getItem("countNotice"))
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
