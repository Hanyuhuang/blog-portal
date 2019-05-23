<template>
  <div>
    <div style="width: 70%;text-align: center;float: left">
      <Carousel  autoplay style="width:625px;text-align: center" >
        <CarouselItem>
          <img src="../../assets/img1.jpg" height="80%" width="75%">
        </CarouselItem>
        <CarouselItem>
          <img src="../../assets/img2.png" height="80%" width="75%">
        </CarouselItem>
      </Carousel>
      <div v-for="item in recentArticles" style="margin-top: 30px;text-align: left">
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
      <br/>
      <Button type="default" size="large" shape="circle" long >查看更多</Button>
    </div>
    <div style="width:25%;text-align: center;float: right">
      <Card>
        <Alert style="font-size: larger"><Icon :size="25" type="logo-octocat" />&nbsp;博客会员</Alert>
        <Alert type="success" style="font-size: larger"><Icon :size="25" type="ios-outlet" />&nbsp;发表博客</Alert>
        <Alert type="warning" style="font-size: larger"><Icon :size="25" type="ios-outlet-outline" />&nbsp;加入我们</Alert>
        <Alert type="error" style="font-size: larger"><Icon :size="25" type="md-outlet" />&nbsp;博客版权</Alert>
      </Card>
      <Card style="margin-top: 30px">
        <p slot="title">
          热门文章推荐
        </p>
        <div style="text-align: left">
          <a v-for="article in hotArticles" href="#">{{article.title}}</a><br/>
        </div>
      </Card>
      <Card style="margin-top: 30px">
        <p slot="title">
          友情链接
        </p>
        <div style="text-align: left">
          <a href="#">xxxxxxxxxxxxx</a><br/>
          <a href="#">xxxxxxxxxxxxx</a><br/>
          <a href="#">xxxxxxxxxxxxx</a><br/>
          <a href="#">xxxxxxxxxxxxx</a><br/>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
    import {formatDate} from "@/common";

    export default {
        name: "Home",
        data(){
          return{
            recentArticles: [
              {
                article:{id:'',title:'',image:'',content:'',createTime:''},
                user:{name:''},
                comments:0,
                views:0,
                stars:0,
                follows:0
              }
              ],
            hotArticles:[]
          }
        },
        methods:{
          // 查询最新文章列表
           getArticleList(){
              this.$axios.get(this.$ARTICLE_URL+"/article/recent").then((resp)=>{
                  this.recentArticles = resp.data.items
              })
             this.$axios.get(this.$ARTICLE_URL+"/article/hot").then((resp)=>{
                this.hotArticles = resp.data.items
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
          // 显示HTML代码的文本内容
           toText(HTML) {
              const value = HTML
              return value.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
            },
          // 时间处理
          dateFormat(date){
            return  formatDate(new Date(date),'yyyy-MM-dd hh:mm')
          }
        },
        mounted() {
           this.getArticleList()
        }
    }
</script>

<style scoped>

</style>
