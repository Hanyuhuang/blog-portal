<template>
     <Layout>
       <!--导航栏-->
       <Menu mode="horizontal" :active-name="activeName" ref="activeName" style="letter-spacing:2px">
         <Col span="3" offset="1">
           <span style="font-size: 30px;color: coral;letter-spacing:5px">博客</span>
         </Col>
         <Col span="3" >
           <MenuItem name="home" to="/home" style="font-size: large;">首页</MenuItem>
         </Col>
         <Col span="3" >
           <MenuItem name="article" to="/article" style="font-size: large;">文章</MenuItem>
         </Col>
         <Col span="3" >
           <MenuItem name="message" to="/message" style="font-size: large;">留言板</MenuItem>
         </Col>
         <Col span="3" >
           <MenuItem name="contact" to="/contact" style="font-size: large;">联系我们</MenuItem>
         </Col>
         <!--搜索框-->
         <Col span="3">
           <Input size="large" search placeholder="搜索文章" style="border-radius:10px" @on-search="search"></Input>
         </Col>
         <!--登录、注册、个人中心-->
         <Col span="3" offset="1">
           <Button v-if="this.$user!=null" type="text" to="/info" style="color: coral;font-size: larger"><Badge dot :count="count">个人中心</Badge></Button>
           <Button v-if="this.$user==null" type="primary" shape="circle" ghost style="font-size:15px;" @click="showForm(true)">登录</Button>
           <Button v-if="this.$user==null" type="warning" shape="circle" ghost style="font-size: 15px;" @click="showForm(false)">注册</Button>
         </Col>
       </Menu>
       <!--登录注册-->
       <Modal :title="isLogin?'登录':'注册'"
              v-model="isShow"
              :mask-closable="false"
              :loading="isShow"
              footer-hide>
         <!--登录表单-->
         <Form v-if="isLogin" v-model="user" style="width: 400px;margin-left: 50px">
           <FormItem >
             <Input prefix="ios-contact" size="large" v-model="user.loginName" placeholder="ID/手机/邮箱"></Input>
           </FormItem>
           <FormItem>
             <Input prefix="ios-lock" type="password" size="large" v-model="user.password" placeholder="密码"></Input>
           </FormItem>
           <FormItem>
             <Button type="primary" size="large" long @click="login">登录</Button>
           </FormItem>
         </Form>
         <!--注册表单-->
         <Form v-else  v-model="user"  :label-width="80" style="margin-left: 50px">
           <FormItem label="用户名" >
             <Input v-model="user.name" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="密码" >
             <Input type="password" v-model="user.password" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="手机" >
             <Input v-model="user.phone" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="邮箱" >
             <Input type="email" v-model="user.email" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="验证码" >
             <Input v-model="user.code" style="width: 105px"></Input>
             <Button :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
           </FormItem>
           <FormItem >
             <Button type="primary" style="margin-left:35px" @click="handleSubmit('user')">注册</Button>
             <Button style="margin-left:20px" @click="handleReset('user')">重置</Button>
           </FormItem>
         </Form>
       </Modal>
       <Content>
         <div style="width: 70%;margin-left: 216px;margin-top: 20px">
           <router-view></router-view>
         </div>
       </Content>
       <!--返回顶部-->
       <BackTop></BackTop>
       <!--底侧-->
       <Footer style="text-align: center;letter-spacing:2px;">
         <p>关于我们·联系我们·加入我们·帮助中心·合作伙伴</p>
         <p>&copy;2019-2019</p>
       </Footer>
     </Layout>
</template>

<script>
    export default {
        name: "MyLayout",
        data(){
          return{
            isShow:false,
            isLogin:true,
            activeName:'home',
            user:{
              id:'',
              name:'',
              password:'',
              phone:'',
              email:'',
              loginName:'',
              code:'',
            },
            btnClickable:true,
            btnText:'获取验证码',
            count:0,
          }
        },
        methods:{
          showForm(isLogin){
             this.isLogin = isLogin;
             /*注册*/
             if(!isLogin){
               this.user={}
             }
             this.isShow = true;
          },
          // 发送验证码
          sendCode(){
            // 验证邮箱是否存在
            if(!this.checkEmailIsValid()) return;
            // 发送验证码
            this.$axios.get(this.$BASE_URL+"/user/code",{params:{email:this.user.email}}).then(()=>{
              this.$Message.success("发送成功,注意查收!")
            }).catch(()=>{this.$Message.error("发送失败!")})
            // 验证码倒计时
            this.reSendTime = 60;
            this.btnClickable = false;
            this.getSecond(60);
          },
          // 获取验证码倒计时
          getSecond(num){
             if (num==0){
               this.btnClickable = true;
               this.btnText = "获取验证码"
             } else {
               this.btnText="验证码  " + num + " s"
               num--;
               setTimeout(()=>{
                 this.getSecond(num)
               },1000)
             }
          },
          // 验证邮箱是否合法和存在
          checkEmailIsValid(){
            // 验证邮箱格式
            const myReg =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
            if (!myReg.test(this.user.email)) {
              this.$Message.error("邮箱格式错误!")
              return false
            } else {
              return true
            }

          },
          // 验证手机是否合法和存在
          checkPhoneIsValid(){
            const phoneRegNoArea = /^1[34578]\d{9}$/
            if(!phoneRegNoArea.test(this.user.phone)){
              this.$Message.error("手机格式错误!")
              return false
            }else {
              return true
            }
          },
          // 注册
          handleSubmit (name) {
            // 验证 邮箱 手机
             if (!this.checkEmailIsValid() || !this.checkPhoneIsValid())  return;
            this.$axios.get(this.$BASE_URL+"/user/email/"+this.user.email).then((resp)=>{
              if (resp.data==1){
                this.$Message.error("该邮箱已存在!")
                return
              }
            })
            this.$axios.get(this.$BASE_URL+"/user/phone/"+this.user.phone).then((resp)=>{
              if (resp.data==1){
                this.$Message.error("该手机已存在!")
                return
              }
            })
            // 注册
              this.$axios.post(this.$BASE_URL+"/user/register",this.user).then(()=>{
                this.$Message.success('注册成功!');
                this.isShow = false;
                this.user={};
              }).catch(()=>{
                this.$Message.error('注册失败!');
              })
          },
          // 重置表单
          handleReset (name) {
            this.user={}
          },
          // 登录
          login(){
            this.$axios.get(this.$BASE_URL+"/user/login",{
                params:{
                  loginName:this.user.loginName,
                  password:this.user.password
                }
              }).then((resp)=>{
              this.$Message.success("登录成功!")
              this.countNotice()
              this.$user = resp.data.id
              sessionStorage.setItem("user",resp.data.id)
              this.isShow = false;
              this.connect(resp.data.id)
            }).catch(()=>{
              this.$Message.error("用户名或密码错误!")
            })
          },
          // 搜索
          search(){
            this.$Message.info("该功能暂未实现，敬请期待~~")
          },
          // 查询是否有未读消息
          countNotice(){
             this.$axios.get(this.$BASE_URL+"/article/notice/count").then((resp)=>{
                localStorage.setItem("countNotice",resp.data)
                this.count = resp.data
             })
          },
          // websocket
          connect(id){
            const socket = new WebSocket("ws://212.64.122.153:8092/websocket/"+id)
            socket.onopen = this.onOpen
            socket.onclose = this.onClose
            socket.onmessage = this.onMessage
            socket.onerror = this.onError
          },
          onOpen(){},
          onClose(){},
          onError(){},
          onMessage(resp){
            this.countNotice()
            this.$Notice.info({
              title:'你有一条新的消息，注意查收',
              desc:resp.data
            })
          },
        },
      watch:{
          $route(to,from){
            const path = to.path.split("/")
            this.activeName = path[1]
          },
      },
      mounted() {
          this.count = parseInt(localStorage.getItem("countNotice"))
      },
      created() {
          if (sessionStorage.getItem("user")!=null){
            this.connect(sessionStorage.getItem("user"))
          }
      }
    }
</script>

<style scoped>

</style>
