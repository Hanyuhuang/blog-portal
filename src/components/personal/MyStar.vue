<template>
  <div>
    <Row>
      <Col span="8">
        <Button size="large" @click="removeSome">取消点赞</Button>
      </Col>
    </Row>
    <br>
    <Table border ref="selection" :loading="loading" :columns="cols" :data="articleList" @on-selection-change="selected">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" @click="getArticleDetail(row)">查看</Button>
        <Button type="error" size="small" @click="remove(row)">取消</Button>
      </template>
    </Table>
    <br>
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
        name: "MyStar",
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
          cols:[
            {
              type: 'selection',
              align: 'center',
              width:50
            },
            {
              title:'#',
              align: 'center',
              width:50,
              render: (h,params)=>{
                return h('div', params.row.article.id)
              }
            },
            {
              title:'标题',
              tooltip:true,
              align: 'center',
              render: (h,params)=>{
                return h('div', params.row.article.title)
              }
            },
            {
              title:'作者',
              tooltip:true,
              align: 'center',
              render: (h,params)=>{
                return h('div', params.row.user.name)
              }
            },
            {

              title:'内容',
              tooltip:true,
              align: 'center',
              render: (h,params)=>{
                function toText(HTML) {
                  const value = HTML
                  return value.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
                }
                return h('div', toText(params.row.article.content))
              }
            },
            {
              title:'发表时间',
              tooltip:true,
              width:100,
              render: (h,params)=>{
                return h('div',
                  formatDate(new Date(params.row.article.createTime),'yyyy-MM-dd hh:mm')
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
          this.$axios.get(this.$ARTICLE_URL+"/star/list",{
            params:{
              pageCur:this.pageCur,
              pageSize:this.pageSize,
            }
          }).then((resp)=>{
            this.total = resp.data.total
            this.articleList = resp.data.items
          }).catch(()=>{
            this.$Message.info("你的登录已过期，请重新登录！")
            sessionStorage.removeItem("user")
            this.$router.push(this.$route.fullPath)
          })
          this.loading = false;
        },
        // 查看文章详情
        getArticleDetail(row){
          this.$router.push({
            path:'/article/detail',
            query:{
              id:row.id
            }
          })
        },
        // 删除记录
        remove(row) {
          this.$Modal.confirm({
            title:'是否删除?',
            onOk:()=>{
              this.$axios.delete(this.$ARTICLE_URL+"/star/"+row.article.id).then(()=>{
                this.getArticleList();
                this.$Message.success("删除成功!");
              }).catch(()=>{
                this.$Message.error("删除失败!");
              })
            }
          })
        },
        // 多选框选中事件
        selected(row){
          this.selectedList = row;
        },
        // 批量删除
        removeSome(){
          // 判断是否选中
          if (this.selectedList.length>0){
            // 确认框
            this.$Modal.confirm({
              title:'是否删除?',
              onOk:()=>{
                const ids = [];
                this.selectedList.some((item)=>{
                  ids.push(item.article.id)
                })
                // 发起删除请求
                this.$axios.delete(this.$ARTICLE_URL+"/star",{
                  params:{
                    ids:ids
                  },
                  paramsSerializer: params => {
                    return this.$qs.stringify(params, { indices: false })
                  }
                  // 请求成功
                }).then((resp)=>{
                  this.getArticleList()
                  this.$Message.success("共删除"+resp.data+"条记录！")
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
          this.pageCur = page;
          this.getArticleList();
        },
      },
      mounted() {
        this.getArticleList();
      },
    }
</script>

<style scoped>
</style>
