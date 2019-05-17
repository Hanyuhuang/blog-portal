<template>
  <div>
    <div style="width: 70%;text-align: center;float: left">
      <Carousel  autoplay style="width:625px;text-align: center" >
        <CarouselItem>
          <img src="../assets/img1.jpg" height="80%" width="75%">
        </CarouselItem>
        <CarouselItem>
          <img src="../assets/img2.png" height="80%" width="75%">
        </CarouselItem>
      </Carousel>
      <div style="margin-top: 30px;text-align: left">
        <Card  style="margin-top: 10px">
          <Button type="text"
                  to="article/detail"
                  style="font-size: larger;color: #4a4a4a;font-weight: bold;letter-spacing:5px">
            深入理解JVM
          </Button>
          <span style="margin-left: 20px;font-size: larger">2019-5-1 11:11:11</span>
          <br/>
          <div style="float: none">
            <div style="float: left;width: 80%;">
              每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
              JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
              而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
              尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
            </div>
            <div style="float: left;width: 20%;text-align: center">
              <img src="../assets/describe.jpg" width="100px" height="100px">
            </div>
          </div>
          <div>
            <Icon type="md-person" />废物也要听歌&nbsp;&nbsp;&nbsp;
            <Icon type="md-thumbs-up" />996 &nbsp;&nbsp;&nbsp;
            <Icon type="md-thumbs-down" />25&nbsp;&nbsp;&nbsp;
            <Icon type="md-heart" />520&nbsp;&nbsp;&nbsp;
            <Icon type="md-chatboxes"/>999&nbsp;&nbsp;&nbsp;
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
          <a href="#">SpringCloud搭建微服务</a><br/>
          <a href="#">SpringBoot入门</a><br/>
          <a href="#">RabbitMQ简介</a><br/>
          <a href="#">Redis设计与实现</a><br/>
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
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>
