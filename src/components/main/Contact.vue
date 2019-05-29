<template>

  <Card :dis-hover="true" style="text-align: center;height: 500px">
    <div style="margin-top: 200px">
      <Button shape="circle" to="https://github.com/Hanyuhuang/blog-portal" target="_blank">
        <Icon :size="30" type="logo-github" />
        项目前端地址
      </Button>
      <Button shape="circle" to="https://github.com/Hanyuhuang/blog" target="_blank">
        <Icon :size="30" type="logo-github" />
        项目后端地址
      </Button>
    </div>
  </Card>

</template>

<script>
    export default {
        name: "Contact"
    }
</script>

<style scoped>

</style>
