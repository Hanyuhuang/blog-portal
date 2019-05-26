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
          <FormItem v-if="isEdit" label="验证码">
            <Input v-model="code" style="width: 100px"></Input>
            <Button v-if="isEdit" :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
          </FormItem>
          <FormItem v-if="isEdit" label="新手机" >
            <Input :disabled="!isEdit" type="email" v-model="user.newPhone" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit">
            <Button type="success" @click="updatePhone">修改手机</Button>
          </FormItem>
          <Divider v-if="isEdit"></Divider>
          <FormItem label="原邮箱" >
            <Input disabled type="email" v-model="user.email" style="width: 170px"></Input>
          </FormItem>
          <FormItem v-if="isEdit" label="验证码">
            <Input v-model="code" style="width: 100px"></Input>
            <Button v-if="isEdit" :disabled="!btnClickable" @click="sendCode">{{btnText}}</Button>
          </FormItem>
          <FormItem v-if="isEdit" label="新邮箱" >
            <Input :disabled="!isEdit" type="email" v-model="user.newEmail" style="width: 170px"></Input>
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
            },
            isEdit:false,
            selectedCity:[],
            btnClickable:true,
            btnText:'验证码',
            code:'',
          }
        },
        methods:{
          // 查询用户信息
          getUser(id){
            if (id==null) return;
            this.$axios.get(this.$USER_URL+"/user/"+id).then((resp)=>{
                 this.user = resp.data;
                 this.user.birthday = formatDate(new Date(resp.data.birthday),'yyyy-MM-dd')
                 this.selectedCity = resp.data.address.split("-")
             }).catch(()=>{
              this.$Message.info("你的登录已过期，请重新登录！")
              sessionStorage.removeItem("user")
              this.$router.push(this.$route.fullPath)
            })
          },
          // 发送验证码
          sendCode(){
            // 验证邮箱
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
              this.btnText = "验证码"
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
            if (!reg.test(this.user.newEmail)) {
              this.$Message.error("邮箱格式错误!")
              return;
            }
            this.$axios.get(this.$USER_URL+"/user/email/"+this.user.newEmail).then(()=>{
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
            //  地址处理
            this.user.address = this.selectedCity[0]+"-"+this.selectedCity[1]+"-"+this.selectedCity[2]+"-"+this.selectedCity[3];
            // 验证 邮箱 手机
            if (this.checkEmailIsValid() || this.checkPhoneIsValid())  return;
            // 注册
            this.$axios.put(this.$USER_URL+"/user",{user:this.user,code:this.code}).then(()=>{
              this.$Message.success('修改成功!');
              this.isShow = false;
              this.isLoginEd = true;
              this.user={};
            }).catch(()=>{
              this.$Message.error('修改失败!');
            })
          },
          // 修改状态为编辑
          edit(){
            this.isEdit = !this.isEdit;
          },
          // 修改密码
          updatePassword(){
            this.$axios.put(this.$USER_URL+"/user/password",this.user).then((resp)=>{
                this.$Message.success("修改成功!")
                setInterval(()=>{window.location.reload()},500)
            }).catch(()=>{
                this.$Message.error("修改失败!检查密码是否正确!")
            })
          },
          // 修改邮箱
          updateEmail(){
            // 验证邮箱
            if(this.checkEmailIsValid()) return;
            this.$axios.put(this.$USER_URL+"/user",this.user).then((resp)=>{
              this.$Message.success("修改成功!")
            }).catch(()=>{
              this.$Message.error("修改失败!邮箱不存在或邮箱已被使用!")
            })
          },
          // 修改手机
          updatePhone(){
            // 验证邮箱
            if(this.checkPhoneIsValid()) return;
            this.$axios.put(this.$USER_URL+"/user",this.user).then((resp)=>{
              this.$Message.success("修改成功!")
            }).catch(()=>{
              this.$Message.error("修改失败!手机号不存在或已被使用!")
            })
          },
          save(){
            //  地址处理
            this.user.address = this.selectedCity[0]+"-"+this.selectedCity[1]+"-"+this.selectedCity[2]+"-"+this.selectedCity[3];
            // 修改
            this.$axios.put(this.$USER_URL+"/user",this.user).then((resp)=>{
              this.getUser()
              this.$Message.success("修改成功!")
              this.isEdit = false;
            }).catch(()=>{
              this.$Message.error("修改失败!")
            })
          },
        },
        mounted() {
          this.getUser(sessionStorage.getItem("user"));
        }
    }
</script>

<style scoped>

</style>
