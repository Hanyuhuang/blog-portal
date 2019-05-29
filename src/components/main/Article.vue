<template>
  <div>
    <div v-for="item in articleList" style="margin-top: 30px;text-align: left">
      <Card  style="margin-top: 10px">
        <Button type="text"
                @click="getArticleDetail(item.article.id)"
                style="font-size: larger;color: #4a4a4a;font-weight: bold;letter-spacing:5px">
          {{item.article.title}}
        </Button>
        <span style="margin-left: 20px;font-size: larger">{{dateFormat(item.article.createTime)}}</span>
        <br/>
        <div style="float: none">
          <div style="float: left;width: 80%;">
            <span style="margin-left: 20px;width: 80%">{{toText(item.article.content)}}</span>
          </div>
          <div style="float: left;width: 20%;text-align: center">
            <img :src="item.article.image" width="100px" height="100px">
          </div>
        </div>
        <div>
          <Icon type="md-person" style="margin-left: 20px"/>&nbsp;{{item.user.name}}&nbsp;&nbsp;&nbsp;
          <Icon type="md-eye" style="margin-left: 60px" />&nbsp; {{item.views}}&nbsp;&nbsp;&nbsp;
          <Icon type="md-thumbs-up" />&nbsp;{{item.stars}} &nbsp;&nbsp;&nbsp;
          <Icon type="md-heart" />&nbsp;{{item.follows}}&nbsp;&nbsp;&nbsp;
          <Icon type="md-chatboxes"/>&nbsp;{{item.comments}}
        </div>
      </Card>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <Page :total="total" :current="pageCur" :page-size="pageSize" show-elevator @on-change="changePage"/>
    </div>
  </div>
</template>

<script>
    import {formatDate} from "@/common";

    export default {
        name: "Article",
        data(){
          return{
              total:0,
              pageCur:1,
              pageSize:10,
              articleList: [
              {
                article:{id:'',title:'',image:'',content:'',createTime:''},
                user:{name:''},
                comments:0,
                views:0,
                stars:0,
                follows:0
              }
            ],
          }
        },
        methods:{
          // 查询最新文章列表
          getArticleList(){
            this.$axios.get(this.$BASE_URL+"/article/list",{
              params:{
                pageCur:this.pageCur,
                pageSize:this.pageSize,
              }
            }).then((resp)=>{
              this.total = resp.data.total
              this.articleList = resp.data.items
            })
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
            return  formatDate(new Date(date),'yyyy-MM-dd hh:mm')
          },
        },
        mounted() {
          this.getArticleList()
        }
    }
</script>

<style scoped>

</style>
