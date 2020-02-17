<template>
  <div class="not-found" :style="`height:${$store.state.app.maxTableHeight - 134}px`">
    <div class="foundWrap">
        <svg-icon name="404-1" class="icon-404" size="360"></svg-icon>
        <p class="found_fontsize">系统正在建设中</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NotFound',
    data () {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .not-found {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .icon-404 {
       
      font-size: 500px;
      color: #fff;
    }

    section {
      margin-left: 50px;

      h1 {
        color: #434e59;
        font-size: 72px;
        font-family: 'Segoe UI';
        font-weight: 600;
        line-height: 72px;
      }

      p {
        color: #fff;
        font-size: 20px;
        line-height: 28px;
        margin: 40px 0 20px;
      }
    }
    .foundWrap{
      position: relative;
    }
    .found_fontsize{
      // position: relative;
      color: #333333;
      font-size: $fSizeDiatitle;
      // left: 0;
      // right: 0;
      // bottom: 40px;
      margin-top: 60px;
      text-align: center;
      padding-right: 32px;
    }
  }


</style>
