<template>
   <div>
     <!--导航栏-->
     <Menu mode="horizontal" active-name="home" style="letter-spacing:2px">
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
       <Col span="3">
         <Input size="large" search placeholder="搜索文章" style="border-radius:10px"></Input>
       </Col>
       <Col span="3" offset="1">
         <Button v-if="isLoginEd" type="text" style="color: coral;font-size: larger">个人中心</Button>
         <Button v-if="!isLoginEd" type="primary" shape="circle" ghost style="font-size:15px;" @click="showForm(true)">登录</Button>
         <Button v-if="!isLoginEd" type="warning" shape="circle" ghost style="font-size: 15px;" @click="showForm(false)">注册</Button>
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
       <Form v-else  v-model="user"  :label-width="80">
         <FormItem label="用户名" >
           <Input v-model="user.name"></Input>
         </FormItem>
         <FormItem label="密码" >
           <Input type="password" v-model="user.password"></Input>
         </FormItem>
         <FormItem label="生日" >
           <DatePicker v-model="user.birthday"></DatePicker>
         </FormItem>
         <FormItem label="性别" >
           <RadioGroup v-model="user.sex">
             <Radio label="男"></Radio>
             <Radio label="女"></Radio>
           </RadioGroup>
         </FormItem>
         <FormItem label="手机" >
           <Input v-model="user.phone"></Input>
         </FormItem>
         <FormItem label="邮箱" >
           <Input type="email" v-model="user.email"></Input>
         </FormItem>
         <FormItem label="验证码" >
           <Input v-model="code" style="width: 260px"></Input>
           <Button :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
         </FormItem>
         <FormItem label="地址">
           <Cascader :data="addressList" v-model="selectedCity"></Cascader>
         </FormItem>
         <FormItem >
           <Button type="primary" style="margin-left:85px" @click="handleSubmit('user')">注册</Button>
           <Button style="margin-left:20px" @click="handleReset('user')">重置</Button>
         </FormItem>
       </Form>
     </Modal>
     <!--主体半部分-->
     <div style="height: 1400px;width: 70%;margin-left: 216px;margin-top: 20px">
       <router-view></router-view>
     </div>
     <!--返回顶部-->
     <BackTop></BackTop>
     <!--底侧-->
     <Footer style="text-align: center;letter-spacing:2px;">
       <p>关于我们·联系我们·加入我们·帮助中心·合作伙伴</p>
       <p>&copy;2019-2019</p>
     </Footer>
   </div>
</template>

<script>
    export default {
        name: "MyLayout",
      data(){
          return{
            isShow:false,
            isLogin:true,
            isLoginEd:false,
            user:{
              id:'',
              name:'',
              password:'',
              sex:'男',
              birthday:'',
              phone:'',
              email:'',
              address:'',
              loginName:'',
            },
            code:'',
            btnClickable:true,
            btnText:'获取验证码',
            addressList:[{id:'', label:'', value:'', type:'', children:[],}],
            selectedCity:[],
          }
        },
        methods:{
          showForm(isLogin){
             this.isLogin = isLogin;
             /*注册*/
             if(!isLogin){
               this.user={}
               this.loadCity()
             }
             this.isShow = true;
          },
          sendCode(){
            const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            // 验证邮箱格式
            if (!reg.test(this.user.email)) {
              this.$Message.error("邮箱格式错误!")
              return;
            }
            // 验证邮箱是否存在
            if(this.checkEmailIsValid()) return;
            // 发送验证码
            this.$axios.get("/user/code",{params:{email:this.user.email}}).then(()=>{
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
          checkEmailIsValid(){
            this.$axios.get("/user/email/"+this.user.email).then(()=>{
                return true;
            }).catch(()=>{
               this.$Message.error("该邮箱已存在")
               return false;
            })
          },
          checkPhoneIsValid(){
            this.$axios.get("/user/phone/"+this.user.phone).then(()=>{
              return true;
            }).catch(()=>{
              this.$Message.error("该手机已存在")
              return false;
            })
          },
          loadCity(){
            // 查询一级城市
            this.$axios.get("/city/list").then((resp)=>{
              this.addressList = resp.data;
              console.log(this.addressList);
            })
          },
          handleSubmit (name) {
              //  地址处理
              this.user.address = this.selectedCity[0]+"-"+this.selectedCity[1]+"-"+this.selectedCity[2];
              // 验证 邮箱 手机
              if (this.checkEmailIsValid() || this.checkPhoneIsValid())  return;
              // 注册
              this.$axios.post("/user",{user:this.user,code:this.code}).then(()=>{
                this.$Message.success('注册成功!');
                this.isShow = false;
                this.isLoginEd = true;
                this.user={};
              }).catch(()=>{
                this.$Message.error('注册失败!');
              })
          },
          handleReset (name) {
            this.user={}
          },
          login(){
            this.$axios.get("/user/login",{
                params:{
                  loginName:this.user.loginName,
                  password:this.user.password
                }
              }).then(()=>{
              this.$Message.success("登录成功!")
              this.isShow = false;
              this.isLoginEd = true;
            }).catch(()=>{
              this.$Message.error("用户名或密码错误!")
            })
          }
        }
    }
</script>

<style scoped>

</style>
