<template>
   <div>
     <Card>
       <h1 style="margin-left: 80px">深入理解JVM</h1>
       <div style="float: left;margin-left: 20px">
         <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
       </div>
       <div style="float: left;margin-left: 20px;width: 70%">
         <p>作者：废物不配听歌</p>
         <p>发表时间：2019-5-1 11:11:11</p>
         <br/>
       </div>
       <div style="float: left;margin-left: 20px">
         <Tag ><span style="font-size: 15px">JAVA</span></Tag>
         <Tag ><span style="font-size: 15px">JVM</span></Tag>
       </div>
       <Divider/>
       <div>
         每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
         JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
         而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
         每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
         JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
         而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
         JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
         而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
         JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
         而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
         尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
         <br/>
       </div>
       <div style="float: right;margin-top: 10px">
         <Icon type="md-thumbs-up" />996 &nbsp;&nbsp;&nbsp;
         <Icon type="md-thumbs-down" />25&nbsp;&nbsp;&nbsp;
         <Icon type="md-heart" />520&nbsp;&nbsp;&nbsp;
         <Icon type="md-chatboxes"/>999&nbsp;&nbsp;&nbsp;
       </div>
       <br/>
     </Card>
     <Card style="margin-top: 20px">
       <h2>50条评论</h2>
       <Divider/>
       <div v-for="i in 5">
         <!--头像-->
         <div style="float: left;margin-left: 20px">
           <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
         </div>
         <!--评论内容-->
         <div style="width:80%;float: left;margin-left: 20px">
           <p style="color: red">
             废物不配听歌&nbsp;
             <Tag color="error" >N</Tag>
           </p>
           <p>6666666666666666666666</p>
           <p style="color: #889097">发表时间：2019-5-1 11:11:11</p>
           <!--评论回复-->
           <div style="background-color: #dfe7ee">
             <div style="margin-left: 20px">
               <p style="color: green;margin-top: 10px">
                 废物不配听歌&nbsp;
                 <Tag color="primary" >N</Tag>
               </p>
               <p >99999999999</p>
               <p style="color: #889097">2019-5-1 11:11:11</p>
               <Input placeholder="输入你的内容"style="margin-top: 5px;width: 720px" ></Input><br/>
               <Button size="large" style="margin-left: 650px;margin-top: 8px">回复</Button>
               <br/><br/>
             </div>
           </div>
         </div>
         <!--其他-->
         <div style="float: left">
           <span style="color: #889097;margin-left: 10px;font-size: 35px">{{i}}#</span>
         </div>

         <Divider/>
       </div>
     </Card>
     <Card style="margin-top: 20px"></Card>
   </div>
</template>

<script>
    export default {
        name: "ArticleDetail"
    }
</script>

<style scoped>

</style>
