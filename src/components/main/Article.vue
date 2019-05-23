<template>
  <div>
    <Card  style="margin-top: 10px">
      <Button type="text"
              to="article/detail"
              style="font-size: larger;color: #4a4a4a;font-weight: bold;letter-spacing:5px">
        深入理解JVM
      </Button>
      <span style="margin-left: 20px;font-size: larger">2019-5-1 11:11:11</span>
      <br/>
      <div>
        <div style="float: left;width: 80%;letter-spacing:2px;">
          每个使用Java的开发者都知道Java字节码是在JRE中运行(JRE: Java 运行时环境)。
          JVM则是JRE中的核心组成部分，承担分析和执行Java字节码的工作，
          而Java程序员通常并不需要深入了解JVM运行情况就可以开发出大型应用和类库。
          尽管如此，如果你对JVM有足够了解，就会对Java有更好的掌握，并且能解决一些看起来简单但又尚未解决的问题。
        </div>
        <div style="float: right;width: 20%;text-align: center">
          <img src="../../assets/describe.jpg" width="100px" height="100px">
        </div>
      </div>
      <div>
        <p>
          <Icon type="md-person" />废物也要听歌&nbsp;&nbsp;&nbsp;
          <Icon type="md-thumbs-up" />996 &nbsp;&nbsp;&nbsp;
          <Icon type="md-thumbs-down" />25&nbsp;&nbsp;&nbsp;
          <Icon type="md-heart" />520&nbsp;&nbsp;&nbsp;
          <Icon type="md-chatboxes"/>999&nbsp;&nbsp;&nbsp;
        </p>
      </div>
    </Card>
    <div style="text-align: center;margin-top: 30px">
      <Page :total="50" :page-size="7" show-elevator />
    </div>
  </div>
</template>

<script>
    export default {
        name: "Article"
    }
</script>

<style scoped>

</style>
