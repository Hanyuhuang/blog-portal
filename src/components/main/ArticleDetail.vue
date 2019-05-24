<template>
   <div >
     <Card>
       <div style="float: left;margin-left: 30px">
         <img :src="articleDetail.user.image" style="border-radius:50%;height: 60px;width: 60px">
       </div>
       <div style="float: left">
         <h1 style="margin-left: 20px">{{articleDetail.article.title}}</h1>
         <div style="float: left;margin-left: 20px;">
           <p style="margin-top: 10px">
             <span style="margin-left: 1px">作者：{{articleDetail.user.name}}</span>
             <span style="margin-left: 50px">发表时间：{{dateFormat(articleDetail.article.createTime)}}</span>
           </p>
         </div>
       </div>
       <div style="float: left;margin-left: 120px">
         <Tag v-for="tag in articleDetail.tags" v-bind:key="tag" ><span style="font-size: 15px">{{tag}}</span></Tag>
       </div>
       <Divider></Divider>
       <!--文章内容-->
       <div v-html="articleDetail.article.content" style="width: 70px;margin-left: 100px">
         <div v-if="isShowReplyBox[0]">11111111111111111111111111111</div>
         <br/>
       </div>
       <!--点赞收藏评论数-->
       <div style="float: right;margin-top: 10px">
         <Icon type="md-eye"/> {{articleDetail.views}}&nbsp;&nbsp;&nbsp;&nbsp;
         <Icon type="md-thumbs-up" @click="star"style="cursor:pointer"/>{{articleDetail.stars}} &nbsp;&nbsp;&nbsp;&nbsp;
         <Icon type="md-heart" style="cursor:pointer"/>{{articleDetail.follows}}&nbsp;&nbsp;&nbsp;&nbsp;
         <Icon type="md-chatboxes" style="cursor:pointer"/>{{articleDetail.comments}}&nbsp;&nbsp;&nbsp;&nbsp;
       </div>
       <br/>
     </Card>
     <!--评论区-->
     <Card style="margin-top: 20px">
       <h2 style="margin-left: 20px">{{articleDetail.comments}}条评论</h2>
       <Divider/>
       <div v-for="(item,i) in articleDetail.commentList" :key="item.id">
         <!--头像-->
         <div style="float: left;margin-left: 20px">
           <Avatar size="large" :src="item.user.image" />
         </div>
         <!--评论内容-->
         <div style="width:80%;float: left;margin-left: 20px">
           <p style="color: red" >
             {{item.user.name}}
             <Tag color="error" >N</Tag>
           </p>
           <!--评论内容-->
           <p v-html="item.comment.content"></p>
           <!--评论时间-->
           <p style="color: #889097">
             <span>发表时间：{{dateFormat(item.comment.createTime)}}</span>
             <a @click="showReplyBox(i)" style="float: right;margin-right: 50px">回复</a>
           </p>
           <!--评论回复-->
           <div v-for="replyVo in item.replyList" style="background-color: #dfe7ee">
             <div style="margin-left: 20px">
               <p style="color: green;margin-top: 10px">
                 {{replyVo.user.name}}&nbsp;
                 <Tag color="primary" >N</Tag>
               </p>
               <p >{{replyVo.reply.content}}</p>
               <p style="color: #889097">发表时间：{{dateFormat(replyVo.reply.createTime)}}</p>
               <br/>
             </div>
           </div>
           <!--回复框-->
           <div v-if="isShowReplyBox[i]">
             <Input :disabled="userId==null"
                    :placeholder="userId==null?'登录后回复':'输入你的回复内容'"
                    style="margin-top: 5px;"
                    v-model="reply.content"></Input><br/>
             <Button style="float: right;margin-top: 8px" @click="addReply(item.comment.id)">回复</Button><br/><br/>
           </div>
         </div>
         <!--其他-->
         <div style="float: left">
           <span style="color: #889097;margin-left: 10px;font-size: 35px">{{i+1}}#</span>
         </div>
         <Divider/>
       </div>
     </Card>
     <!--添加评论-->
     <Card :dis-hover="true" style="margin-top: 20px">
       <h1 style="margin-left: 20px">添加评论</h1><br/>
       <mavon-editor :editable="userId!=null"
                     :model="content"
                     :placeholder="userId==null?'登录后发表评论':'说点什么吧~'"
                     @change="getCode">
       </mavon-editor>
       <Button type="success"
               @click="addComment"
               style="float: right;margin-top: 15px">
         评论
       </Button>
       <br/><br/>
     </Card>
   </div>
</template>

<script>
    import {formatDate} from "@/common";

    export default {
        name: "ArticleDetail",
        data(){
          return {
            articleDetail:{
              article:{id:'',title:'',tag:'',content:'',createTime:''},
              user:{},
              tags:[],
              commentList:[],
              views:0,
              follows:0,
              stars:0,
              comments:0,
            },
            comment:{},
            reply:{},
            userId:'',
            content:'',
            isShowReplyBox:[],
          }
        },
        methods:{
            // 查询文章详情
            getArticleDetail(id){
               if(id==null || id=='') return;
               this.$axios.get(this.$ARTICLE_URL+"/article/detail/"+id).then((resp)=>{
                 this.articleDetail = resp.data;
                 this.articleDetail.tags = resp.data.article.tag.split(",")
               }).catch(()=>{
                 this.$Message.error("发生了未知的异常")
               })
            },
            // 获取富文本的HTML代码
            getCode(status,value){
               this.comment.content = value
            },
            // 时间处理
            dateFormat(date){
              return formatDate(new Date(date),'yyyy-MM-dd hh:mm')
            },
            // 添加评论
            addComment(){
               this.comment.articleId = this.articleDetail.article.id
               this.comment.userId = this.userId
               this.$axios.post(this.$ARTICLE_URL+"/comment",this.comment).then(()=>{
                  this.$Message.success("评论成功")
                  this.content = ''
                  this.getArticleDetail(this.$route.query.id)
               }).catch(()=>{
                  this.$Message.error("评论失败")
               })
            },
            // 显示回复框
            showReplyBox(i){
              this.isShowReplyBox[i] = !this.isShowReplyBox[i]
              this.$forceUpdate()
            },
            // 回复评论
            addReply(commentId){
               this.reply.articleId = this.articleDetail.article.id
               this.reply.commentId = commentId
               console.log(this.reply)
               this.$axios.post(this.$ARTICLE_URL+"/reply",this.reply).then(()=>{
                  this.$Message.success("回复成功")
                  this.reply = {}
                  this.getArticleDetail(this.$route.query.id)
               }).catch(()=>{
                  this.$Message.error("回复失败")
               })
            },
            star(){
               window.alert("👍")
            }
        },
        mounted() {
            this.userId = sessionStorage.getItem("user")
            this.getArticleDetail(this.$route.query.id)
        }
    }
</script>

<style scoped>

</style>
