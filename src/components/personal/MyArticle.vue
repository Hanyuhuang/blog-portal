<template>
  <div style="margin-left: 10px">
    <span style="font-size: 30px;margin-left: 10px">我的文章</span>
    <Button type="warning" size="large" @click="showForm(false)" style="float: right;margin-right: 20px">
      <Icon type="ios-paper-plane" />
      写文章
    </Button><br><hr>
    <div v-for="article in articleList">
      <Card :dis-hover="true">
        <Button type="text"
                @click="getArticleDetail(article.id)"
                style="font-size: larger;color: #4a4a4a;font-weight: bold;letter-spacing:5px">
          {{article.title}}
        </Button>
        <a @click="remove(article.id)" style="color: red;float: right">删除</a>
        <a @click="showForm(true,article.id)" style="float: right;margin-right: 10px">编辑</a>
        <div>
          <p style="margin-left: 20px">{{toText(article.content)}}</p>
          <p >
            <span style="float: right">发表时间:{{dateFormat(article.createTime)}}</span>
          </p>
        </div>
        <br/>
      </Card>
    </div>
    <br/>
    <!--分页-->
    <Page :total="total"
          :page-size="pageSize"
          :current="pageCur"
          :page-size-opts="pageSizeOpts"
          show-sizer
          show-total
          show-elevator
          @on-change="changePage"
          @on-page-size-change ="changePageSize"
          style="float: right"/>
    <!--编辑页-->
    <Modal
      :title="isEdit?'修改文章':'写文章'"
      v-model="isShow"
      :mask-closable="false"
      :loading="isShow"
      footer-hide>
      <!--写文章-->
      <div>
          <Form v-model="article" :label-width="80" style="margin-left: 50px;margin-top: 20px" >
            <FormItem label="文章标题">
              <Input v-model="article.title" style="width: 260px"></Input>
            </FormItem>
            <FormItem label="文章标签">
              <Select v-model="selectedList" multiple style="width:260px">
                <Option v-for="item in tagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="文章图片">
              <img :src="article.image" style="height: 60px;width: 60px;margin-left: 20px">
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
            <mavon-editor ref="md" v-model="article.mdContent" @imgAdd="imgAdd" @change="showCode"/>
            <FormItem style="margin-top: 15px">
              <Button type="primary" @click="submit" style="margin-left: 60px;">提交</Button>
              <Button  @click="reset" >重置</Button>
            </FormItem>
          </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
    import {formatDate} from "@/common";
    export default {
        name: "MyArticle",
      data(){
        return{
          total:0,
          pageCur:1,
          pageSize:5,
          pageSizeOpts:[5,10,15,20,25,30,40,50],
          orderBy:'',
          desc:Boolean,
          keywords:'',
          selectedList:[],
          item:{},
          isShow : false,
          isEdit:false,
          loading:false,
          current:0,
          article:{
            id:'',
            title:'',
            image:'',
            content:'',
            mdContent:'',
            tag:'',
            createTime:'',
            user:{}
          },
          articleList:[],
          tagList:[{label:'Java',value:'Java'},{label:'C++',value:'C++'},{label:'Python',value:'Python'},{label:'MySql',value:'MySql'},{label:'计算机网络',value:'计算机网络'},{label:'操作系统',value:'操作系统'},],
        }
      },
      methods:{
        // 获取文章数据列表
        getArticleList(){
          this.loading = true;
          this.$axios.get(this.$BASE_URL+"/article/myArticle",{
            params:{
              pageCur:this.pageCur,
              pageSize:this.pageSize,
              /*orderBy:this.orderBy,
              desc:this.desc,*/
              //keywords:this.keywords
            }
          }).then((resp)=>{
            this.total = resp.data.total
            this.articleList = resp.data.items
            this.loading = false;
          }).catch((resp)=>{

          })
        },
        // 显示表单
        showForm(isEdit,id){
          this.article = {}
          this.isEdit = isEdit;
          if (isEdit){
            this.$axios.get(this.$BASE_URL+"/article/"+id).then((resp)=>{
              this.article = resp.data;
              this.selectedList = resp.data.tag.split(",")
            })
          }
          this.isShow = true;
        },
        // 表单提交
        submit(){
          if (this.isEdit){
            this.edit();
          } else {
            this.add();
          }
        },
        //  写文章
        add(){
          // 处理标签
          if (this.selectedList.length>1){
            this.selectedList.forEach((tag,i)=>{
              if (i==this.selectedList.length-1){
                this.article.tag+= tag
              } else{
                this.article.tag+= tag+","
              }
            })
          }
          this.$axios.post(this.$BASE_URL+"/article",this.article).then(()=>{
            this.$Message.success("添加成功!");
            this.getArticleList();
            this.isShow = false;
          }).catch(()=>{
            this.$Message.error("添加失败!");
          })
        },
        // 修改文章
        edit() {
          this.$axios.put(this.$BASE_URL+"/article",this.article).then(()=>{
            this.$Message.success("修改成功!");
            this.getArticleList();
            this.isShow = false;
          }).catch(()=>{
            this.$Message.error("修改失败!");
          })
        },
        // 显示HTML代码的文本内容
        toText(HTML) {
          const value = HTML
          return value.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
        },
        // 时间处理
        dateFormat(date){
          return  formatDate(new Date(date),'yyyy-MM-dd hh:mm:ss')
        },
        // 删除文章
        remove(id) {
          this.$Modal.confirm({
            title:'是否删除?',
            onOk:()=>{
              this.$axios.delete(this.$BASE_URL+"/article/"+id).then(()=>{
                this.getArticleList();
                this.$Message.success("删除成功!");
              }).catch(()=>{
                this.$Message.error("删除失败!");
              })
            }
          });
        },
        // 换页
        changePage(page){
          this.pageCur = page;
          this.getArticleList();
        },
        // 修改每页显示数量
        changePageSize(pageSize){
          this.pageSize = pageSize;
          this.getArticleList();
        },
        reset(){this.article={}},
        showCode(status,value){
          this.article.content = value;
        },
        //图片上传成功
        handleSuccess(response, file, fileList){
          console.log(response)
          this.article.image = response
        },
        imgAdd(pos, file){
          // 第一步.将图片上传到服务器.
          const formdata = new FormData();
          formdata.append('file', file);
          this.$axios({
            url: this.$BASE_URL+"/upload/image",
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': 'multipart/form-data' },
          }).then((resp) => {
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            // $vm.$img2Url 详情见本页末尾
            console.log(resp.data)
            this.$refs.md.$img2Url(pos, resp.data);
          })
        }
      },
      mounted() {
        this.article.userId = sessionStorage.getItem("user")
        this.getArticleList();
      },
      watch:{
        keywords:{
          deep:true,
          handler(val){
            this.getArticleList();
          }
        }
      }

    }
</script>

<style scoped>
</style>
