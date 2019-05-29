<template>
  <div>
    <Row>
      <Button size="large" @click="changeStatus(1)">标为已读</Button>
      <Button size="large" @click="changeStatus(0)">标为未读</Button>
      <Button type="success" size="large" @click="remove">批量删除</Button>
      <Select v-model="status" size="large" style="width:100px;margin-left: 30px"
              @on-change="getMyNotices">
        <Option :value="2">查看全部</Option>
        <Option :value="1">查看已读</Option>
        <Option :value="0">查看未读</Option>
      </Select>
    </Row>
    <br>
    <Table border ref="selection" :loading="loading" :columns="cols" :data="noticeList" @on-selection-change="selected">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(row)">删除</Button>
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
    export default {
        name: "MyNotice",
        data(){
          return{
            total:0,
            pageCur:1,
            pageSize:5,
            status:0,
            loading:false,
            noticeList:[],
            selectedList:[],
            cols:[
              {
                type: 'selection',
                align: 'center',
                width:50
              },
              {
                title:'消息',
                align: 'center',
                render: (h,params)=>{
                  var type = ''
                  if (params.row.type==1){
                    type = '赞'
                  } else if (params.row.type==2){
                    type = '收藏'
                  } else if (params.row.type==3){
                    type = '评论'
                  }
                  return h('div', {
                       domProps:{
                         innerHTML:"<span style='color: red'>"+params.row.senderName+"</span>"+"刚"+type+"了你的文章："+params.row.articleName
                         +"<a style='margin-left: 20px'>点击查看</a>"
                       },
                       on:{
                         click:()=>{
                            this.getArticleDetail(params.row)
                         }
                       }
                    }
                  )
                }
              },
              {
                title: '操作',
                slot: 'action',
                align: 'center',
                width:70
              }
            ]
          }
        },
        methods:{
            // 查询消息列表
           getMyNotices(){
              this.loading = true
              this.$axios.get(this.$BASE_URL+"/article/notice",{
                params:{
                  pageCur:this.pageCur,
                  pageSize:this.pageSize,
                  status:this.status,
                }
              }).then((resp)=>{
                this.noticeList = resp.data.items
                this.total = resp.data.total
              }).catch(()=>{
                this.$Message.info("你的登录已过期，请重新登录！")
                this.$router.push(this.$route.fullPath)
              })
             this.loading = false
           },
           // 修改消息状态
           changeStatus(status){
             // 判断是否选中
             if (this.selectedList.length<1){
               this.$Message.error("选中一行再进行操作")
               return;
             }
             const ids = [];
             this.selectedList.some((item)=>{
               ids.push(item.id)
             })
             this.$axios.put(this.$BASE_URL+"/article/notice",{
               ids:ids,
               status:status
             }).then((resp)=>{
               this.getMyNotices()
             }).catch(()=>{
             })
           },
            // 多选框选中事件
            selected(row){
              this.selectedList = row;
            },
            remove(row){
               const ids = [];
                //  是否是多选操作
               if (row.id!=null){
                  ids.push(row.id)
               } else {
                 // 判断是否选中
                 if (this.selectedList.length<1){
                   this.$Message.error("选中一行再进行操作")
                   return;
                 }
                 this.selectedList.some((item)=>{
                   ids.push(item.id)
                 })
               }
              this.$Modal.confirm({
                  title:'是否删除?',
                  onOk:()=>{
                      this.$axios.delete(this.$BASE_URL+"/article/notice",{
                          params:{ids:ids},
                          paramsSerializer: params => {
                            return this.$qs.stringify(params, { indices: false })
                          }
                    }).then((resp)=>{
                      this.getMyNotices()
                      this.$Message.success("共删除"+resp.data+"条记录！")
                    }).catch(()=>{
                      this.$Message.error("删除失败！")
                    })
                  }
              })
            },
            // 查看文章详情
            getArticleDetail(row){
              this.$router.push({
                path:'/article/detail',
                query:{
                  id:row.articleId
                }
              })
            },
            // 换页
            changePage(page){
              this.pageCur = page
              this.getMyNotices()
            },
        },
        mounted() {
          this.getMyNotices()
        }
    }
</script>

<style scoped>

</style>
