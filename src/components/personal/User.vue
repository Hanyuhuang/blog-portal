<template>
  <div style="width: 90%;margin-left: 50px">
    <Button type="warning" @click="edit" style="margin-left: 180px">{{isEdit?'取消编辑':'编辑'}}</Button>
    <Button type="success" @click="save" style="margin-left: 20px">保存</Button>
    <Divider/>
    <div>
      <!--注册表单-->
      <Form v-model="user" :label-width="80">
        <div style="width: 50%;float: left">
          <FormItem label="ID" >
            <Input disabled v-model="user.id" style="width: 170px"></Input>
          </FormItem>
          <FormItem label="用户名" >
            <Input :disabled="!isEdit" v-model="user.name" style="width: 170px"></Input>
          </FormItem>
          <FormItem label="生日" >
            <DatePicker :disabled="!isEdit" v-model="user.birthday" style="width: 170px"></DatePicker>
          </FormItem>
          <FormItem label="性别" >
            <RadioGroup v-model="user.sex">
              <Radio :disabled="!isEdit" label="男"></Radio>
              <Radio :disabled="!isEdit" label="女"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="地址">
            <al-cascader :disabled="!isEdit" :value="selectedCity" v-model="selectedCity" data-type="name" style="width: 170px"></al-cascader>
          </FormItem>
          <Divider v-if="isEdit"></Divider>
          <FormItem v-if="isEdit" label="原密码" >
            <Input :disabled="!isEdit" type="password" v-model="user.password" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit" label="新密码" >
            <Input :disabled="!isEdit" type="password" v-model="user.newPassword" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit">
            <Button type="success" @click="updatePassword">修改密码</Button>
          </FormItem>
        </div>
        <div style="float: left;width: 50%">
          <FormItem label="原手机" >
            <Input disabled v-model="user.phone" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit" label="新手机" >
            <Input :disabled="!isEdit" v-model="user.newPhone" style="width: 170px"></Input>
          </FormItem>
<!--          <FormItem v-if="isEdit" label="验证码">
            <Input disabled v-model="" style="width: 100px"></Input>
            <Button v-if="isEdit" disabled>验证码</Button>
          </FormItem>-->
          <FormItem v-if="isEdit">
            <Button type="success" @click="updatePhone">修改手机</Button>
          </FormItem>
          <Divider v-if="isEdit"></Divider>
          <FormItem label="原邮箱" >
            <Input disabled type="email" v-model="user.email" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit" label="新邮箱" >
            <Input :disabled="!isEdit" type="email" v-model="user.newEmail" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit" label="验证码">
            <Input v-model="user.code" style="width: 100px"></Input>
            <Button v-if="isEdit" :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
          </FormItem>
          <FormItem v-if="isEdit">
            <Button type="success" @click="updateEmail">修改邮箱</Button>
          </FormItem>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
    import {formatDate} from "@/common";

    export default {
        name: "User",
        data(){
          return {
            user:{
              id:'',
              name:'',
              password:'',
              newPassword:'',
              sex:'男',
              birthday:'',
              phone:'',
              newPhone:'',
              email:'',
              newEmail:'',
              address:'',
              code:'',
            },
            isEdit:false,
            selectedCity:[],
            btnClickable:true,
            btnText:'验证码',
          }
        },
        methods:{
          // 查询用户信息
          getUser(){
            this.$axios.get(this.$BASE_URL+"/user/"+this.user.id).then((resp)=>{
                 this.user = resp.data;
                 this.user.birthday = formatDate(new Date(resp.data.birthday),'yyyy-MM-dd')
                 if (resp.data.address!=null){
                   this.selectedCity = resp.data.address.split("-")
                 }
             }).catch(()=>{
              this.$Message.info("你的登录已过期，请重新登录！")
            })
          },
          // 发送验证码
          sendCode(){
            // 验证邮箱
            if(!this.checkEmailIsValid()) return;
            // 发送验证码
            this.$axios.get(this.$BASE_URL+"/user/code",{params:{email:this.user.newEmail}}).then(()=>{
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
              this.btnText = "验证码"
            } else {
              this.btnText="验证码  " + num + " s"
              num--;
              setTimeout(()=>{
                this.getSecond(num)
              },1000)
            }
          },
          // 验证邮箱是否合法
          checkEmailIsValid(){
            const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            // 验证邮箱格式
            if (!reg.test(this.user.newEmail)) {
              this.$Message.error("邮箱格式错误!")
              return false
            } else {
              return true
            }
          },
          // 验证手机是否合法
          checkPhoneIsValid(){
            if(!(/^1[34578]\d{9}$/.test(this.user.newPhone))){
              this.$Message.error("手机格式错误!")
              return false
            }else {
              return true
            }
          },
          // 修改状态为编辑
          edit(){
            this.isEdit = !this.isEdit;
          },
          // 修改密码
          updatePassword(){
            this.$axios.put(this.$BASE_URL+"/user/password",this.user).then((resp)=>{
              if (resp.data==0){
                this.$Message.error("修改失败!密码错误!")
              } else {
                this.$Message.success("修改成功!")
                this.getUser()
                this.user.newPassword = null
              }
            }).catch(()=>{
                this.$Message.error("发生了未知的错误!")
            })
          },
          // 修改邮箱
          updateEmail(){
            // 验证邮箱格式
            if(!this.checkEmailIsValid()) return;
            // 验证邮箱是否存在
            this.$axios.get(this.$BASE_URL+"/user/email/"+this.user.newEmail).then((resp)=>{
              if (resp.data==1){
                this.$Message.error("该邮箱已存在！")
              } else {
                // 修改邮箱
                this.$axios.put(this.$BASE_URL+"/user/email",this.user).then((resp)=>{
                  this.getUser()
                  this.user.newEmail = null
                  this.$Message.success("修改成功!")
                }).catch((resp)=>{
                  console.log(resp)
                  this.$Message.error("修改失败！！！！!")
                })
              }
            })
          },
          // 修改手机
          updatePhone(){
            // 验证手机
            if(!this.checkPhoneIsValid()) return
            // 验证手机是否存在
            this.$axios.get(this.$BASE_URL+"/user/phone/"+this.user.newPhone).then((resp)=>{
              if (resp.data==1){
                this.$Message.error("该手机已存在!")
              } else {
                // 修改
                this.$axios.put(this.$BASE_URL+"/user/phone",this.user).then((resp)=>{
                  this.getUser()
                  this.user.newPhone = null
                  this.$Message.success("修改成功!")
                }).catch(()=>{
                  this.$Message.error("修改失败!")
                })
              }
            })
          },
          // 修改基本信息
          save(){
            //  地址处理
            this.user.address = this.selectedCity[0]+"-"+this.selectedCity[1]+"-"+this.selectedCity[2]+"-"+this.selectedCity[3];
            // 修改
            this.$axios.put(this.$BASE_URL+"/user",this.user).then((resp)=>{
              this.getUser()
              this.$Message.success("修改成功!")
            }).catch(()=>{
              this.$Message.error("修改失败!")
            })
          },
        },
        mounted() {
          this.user.id = sessionStorage.getItem("user")
          this.getUser()
        }
    }
</script>

<style scoped>

</style>
