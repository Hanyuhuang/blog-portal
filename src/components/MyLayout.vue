<template>
     <Layout>
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
           <Button v-if="this.user.id!=null" type="text" to="/info" style="color: coral;font-size: larger">个人中心</Button>
           <Button v-if="this.user.id==null" type="primary" shape="circle" ghost style="font-size:15px;" @click="showForm(true)">登录</Button>
           <Button v-if="this.user.id==null" type="warning" shape="circle" ghost style="font-size: 15px;" @click="showForm(false)">注册</Button>
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
           <FormItem label="头像">
             <img v-if="user.image!=''" :src="user.image" style="height: 60px;width: 60px;margin-left: 20px">
             <Upload
               :format="['jpg','jpeg','png']"
               :max-size="2048*5"
               :on-success="handleSuccess"
               :show-upload-list="false"
               type="drag"
               action="http://localhost:8091/upload/image"
               style="display: inline-block;width:58px;">
               <div style="width: 58px;height:58px;line-height: 58px;">
                 <Icon type="ios-camera" size="20"></Icon>
               </div>
             </Upload>
           </FormItem>
           <FormItem label="生日" >
             <DatePicker v-model="user.birthday" style="width: 200px"></DatePicker>
           </FormItem>
           <FormItem label="性别" >
             <RadioGroup v-model="user.sex">
               <Radio label="男"></Radio>
               <Radio label="女"></Radio>
             </RadioGroup>
           </FormItem>
           <FormItem label="手机" >
             <Input v-model="user.phone" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="邮箱" >
             <Input type="email" v-model="user.email" style="width: 200px"></Input>
           </FormItem>
           <FormItem label="验证码" >
             <Input v-model="code" style="width: 105px"></Input>
             <Button :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
           </FormItem>
           <FormItem label="地址">
             <al-cascader :value="selectedCity" v-model="selectedCity" data-type="name" style="width: 200px"></al-cascader>
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
            user:{
              id:'',
              name:'',
              password:'',
              image:'',
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
            selectedCity:[],
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
            if(this.checkEmailIsValid()) return;
            // 发送验证码
            this.$axios.get(this.$USER_URL+"/user/code",{params:{email:this.user.email}}).then(()=>{
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
            const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            // 验证邮箱格式
            if (!reg.test(this.user.email)) {
              this.$Message.error("邮箱格式错误!")
              return;
            }
            this.$axios.get(this.$USER_URL+"/user/email/"+this.user.email).then(()=>{
                return true;
            }).catch(()=>{
               this.$Message.error("该邮箱已存在")
               return false;
            })
          },
          // 验证手机是否合法和存在
          checkPhoneIsValid(){
            const reg = new RegExp("/^1(3|4|5|7|8)\\d{9}$/");
            if(reg.test(this.user.phone)){
              this.$Message.error("手机格式错误!")
              return false;
            }
            this.$axios.get(this.$USER_URL+"/user/phone/"+this.user.phone).then(()=>{
              return true;
            }).catch(()=>{
              this.$Message.error("该手机已存在")
              return false;
            })
          },
          handleSubmit (name) {
            // 验证 邮箱 手机
             if (this.checkEmailIsValid() || this.checkPhoneIsValid())  return;
            //  地址处理
            this.user.address = ''
            this.selectedCity.forEach((city,i)=>{
                if (i==this.selectedCity.length-1) this.user.address += city;
                else this.user.address += city+"-"
            })
            // 注册
              this.$axios.post(this.$USER_URL+"/user",{user:this.user,code:this.code}).then(()=>{
                this.$Message.success('注册成功!');
                this.isShow = false;
                this.isLoginEd = true;
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
            this.$axios.get(this.$USER_URL+"/user/login",{
                params:{
                  loginName:this.user.loginName,
                  password:this.user.password
                }
              }).then((resp)=>{
              this.$Message.success("登录成功!")
              this.user = resp.data
              sessionStorage.setItem("user",resp.data.id)
              this.isShow = false;
              setInterval(()=>{window.location.reload()},500)
            }).catch(()=>{
              this.$Message.error("用户名或密码错误!")
            })
          },
          //图片上传成功
          handleSuccess(response, file, fileList){
            this.user.image = response
          },
        },
        mounted() {
           this.user.id = sessionStorage.getItem("user")
        }
    }
</script>

<style scoped>

</style>
