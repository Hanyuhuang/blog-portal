<template>
  <div style="margin-left: 10px">
    <span style="font-size: 30px;margin-left: 10px">我浏览的文章数 ({{total}})</span>
    <Button type="error" size="large" @click="removeAll" style="float: right">清空浏览记录</Button>
    <br><hr>
    <div v-for="item in articleList">
      <Card :dis-hover="true">
        <Button type="text"
                @click="getArticleDetail(item.article.id)"
                style="font-size: larger;color: #4a4a4a;font-weight: bold;letter-spacing:5px">
          {{item.article.title}}
        </Button>
        <a @click="remove(item.article.id)" style="color: red;float: right">删除记录</a>
        <div>
          <p style="margin-left: 20px">{{toText(item.article.content)}}</p>
          <p >
            <!--<span style="margin-left: 20px">作者:{{item.user.name}}</span>-->
            <span style="float: right">发表时间:{{dateFormat(item.article.createTime)}}</span>
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
          show-total
          show-elevator
          @on-change="changePage"
          style="float: right"/>
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
          selectedList:[],
          loading:false,
          current:0,
          articleVo:{
            article:{id:'',title:'',content:'',createTime:''},
            user:{name:''}
          },
          articleList:[],
        }
      },
      methods:{
        // 获取文章数据列表
        getArticleList(){
          this.loading = true;
          this.$axios.get(this.$BASE_URL+"/article/view/list",{
            params:{
              pageCur:this.pageCur,
              pageSize:this.pageSize,
            }
          }).then((resp)=>{
            this.total = resp.data.total
            this.articleList = resp.data.items
          }).catch(()=>{
            this.$Message.info("你的登录已过期，请重新登录！")
            this.$router.push(this.$route.fullPath)
          })
          this.loading = false;
        },
        // 查看文章详情
        getArticleDetail(id){
          this.$router.push({
            path:'/article/detail',
            query:{
              id:id
            }
          })
        },
        // 删除记录
        remove(id) {
          this.$Modal.confirm({
            title:'是否删除该记录?',
            onOk:()=>{
              this.$axios.delete(this.$BASE_URL+"/article/view/"+id).then(()=>{
                this.getArticleList();
                this.$Message.success("操作成功!");
              }).catch(()=>{
                this.$Message.error("操作失败!");
              })
            }
          })
        },
        // 全部删除
        removeAll(){
          this.$Modal.confirm({
            title:'是否删除?',
            onOk:()=>{
              this.$axios.delete(this.$BASE_URL+"/article/view/all").then((resp)=>{
                this.$Message.success("共删除"+resp.data+"条记录！")
                this.getArticleList()
              }).catch(()=>{
                this.$Message.error("删除失败!")
              })
            }
          });
        },
        // 换页
        changePage(page){
          this.pageCur = page;
          this.getArticleList();
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
      },
      mounted() {
        this.getArticleList();
      },
    }
</script>

<style scoped>
</style>
