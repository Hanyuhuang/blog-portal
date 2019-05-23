<template>
  <div>
    <Row>
      <Col span="8">
        <Button size="large" @click="removeAll">批量删除</Button>
        <Button type="success"size="large" @click="showForm()">写文章</Button>
      </Col>
      <Col span="6" offset="8">
        <Input search size="large" placeholder="输入搜索内容" model="keywords">{{keywords}}</Input>
      </Col>
    </Row>
    <br>
    <Table border ref="selection" :loading="loading" :columns="cols" :data="articleList" @on-selection-change="selected">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" @click="showForm(true,row)">修改</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </Table>
    <br>
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
      <div v-if="!isEdit">
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
              <img v-if="article.image!=''" :src="article.image" style="height: 60px;width: 60px;margin-left: 20px">
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
            <mavon-editor @change="showCode"/>
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
            tag:'',
            createTime:'',
            userId:'',
            views:[],
            follows:[],
            stars:[],
          },
          articleList:[],
          tagList:[{label:'Java',value:'Java'},{label:'C++',value:'C++'},{label:'Python',value:'Python'},],
          cols:[
            {
              type: 'selection',
              align: 'center',
              width:50
            },
            {
              title:'Id',
              key:'id',
              sortable: true,
              align: 'center',
              width:50
            },
            {
              title:'标题',
              key:'title',
              tooltip:true,
              align: 'center'
            },
            {
              title:'配图',
              key:'image',
              align: 'center',
              render:(h,params)=>{
                return h('img',{attrs:{src:params.row.image,height:60,width:60}})
              }
            },
            {
              type:'html',
              title:'内容',
              key:'content',
              tooltip:true,
              align: 'center'
            },
            {
              title:'发表时间',
              key:'createTime',
              sortable:true,
              tooltip:true,
              render: (h,params)=>{
                return h('div',
                  formatDate(new Date(params.row.createTime),'yyyy-MM-dd hh:mm')
                  //'yyyy-MM-dd hh:mm' 对应的时间格式2018-12-21 ：18：46
                  //格式可以自行修改，例如 'yyyy-MM-dd' 'yyyy-MM'
                  //Date是后台时间戳参数名字
                )
              }
            },
            {
              title: '操作',
              slot: 'action',
              align: 'center'
            }
          ],
        }
      },
      methods:{
        // 获取文章数据列表
        getArticleList(){
          this.loading = true;
          this.$axios.get(this.$ARTICLE_URL+"/article/list",{
            params:{
              pageCur:this.pageCur,
              pageSize:this.pageSize,
              /*orderBy:this.orderBy,
              desc:this.desc,*/
              //keywords:this.keywords
            }
          }).then((resp)=>{
            this.total = resp.data.total;
            this.articleList = resp.data.items;
            this.loading = false;
            console.log(this.articleList)
          })
        },
        // 显示表单
        showForm(isEdit,row){
          this.isEdit = isEdit;
          if (isEdit){
            this.$axios.get("/article/"+row.id).then((resp)=>{
              this.article = resp.data;
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
          this.selectedList.forEach((tag,i)=>{
              if (i==this.selectedList.length-1){
                this.article.tag+= tag
              } else{
                this.article.tag+= tag+","
              }
          })
          this.$axios.post(this.$ARTICLE_URL+"/article",this.article).then(()=>{
            this.$Message.success("添加成功!");
            this.getArticleList();
            this.isShow = false;
          }).catch(()=>{
            this.$Message.error("添加失败!");
          })
        },
        // 修改文章
        edit() {
          console.log(user)
          this.$axios.put(this.$ARTICLE_URL+"/article",this.article).then(()=>{
            this.getArticleList();
            this.$Message.success("修改成功!");
            this.isShow = false;
          }).catch(()=>{
            this.$Message.error("修改失败!");
          })
        },
        // 删除用户
        remove() {
          this.$Modal.confirm({
            title:'是否删除?',
            onOk:()=>{
              this.$axios.delete(this.$ARTICLE_URL+"/article/"+this.article.id).then(()=>{
                this.getArticleList();
                this.$Message.success("删除成功!");
              }).catch(()=>{
                this.$Message.error("删除失败!");
              })
            }
          });
        },
        // 多选框选中事件
        selected(row){
          this.selectedList = row;
        },
        // 批量删除
        removeAll(){
          // 判断是否选中
          if (this.selectedList.length>0){
            // 确认框
            this.$Modal.confirm({
              title:'是否删除?',
              onOk:()=>{
                const ids = [];
                this.selectedList.some((item)=>{
                  ids.push(item.id)
                })
                // 发起删除请求
                this.$axios.delete("user",{
                  params:{
                    ids:ids
                  },
                  paramsSerializer: params => {
                    return this.$qs.stringify(params, { indices: false })
                  }
                  // 请求成功
                }).then(()=>{
                  this.getArticleList()
                  this.$Message.success("删除成功!")
                  // 请求失败
                }).catch(()=>{
                  this.$Message.error("删除失败!")
                })
              }
            })
          }else {
            this.$Message.info("请选择一行再删除!");
          }
        },
        // 换页
        changePage(page){
          this.pageNow = page;
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
          this.article.image = response
        },
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
