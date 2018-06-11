<style scoped>
  .s {
    text-align: center;
  }
</style>

<template>
  <NumberTo :endVal="endVal" :mainStyle="mainStyle" :countStyle="countStyle">
    <template slot="leftText">
      <div :style="titleStyle">{{title}}</div>
    </template>
    <template slot="rightText">
      {{rightText}}
    </template>
  </NumberTo>
</template>

<script>
  import NumberTo from './NumberTo';

  export default {
    props: {
      title: {},
      titleStyle: {},
      endVal: {},
      rightText: {},
      countSize: {
        default: 16
      },
      size: {
        default: 15
      },
      textAlign: {
        default: 'center'
      },
      color: {
        default: '#d8d8d8'
      }
    },
    data () {
      return {
        mainStyle: {
          textAlign: this.textAlign,
          color: this.color,
          fontWeight: 500,
          fontSize: this.size + 'px'
        },
        countStyle: {fontSize: this.countSize + 'px'}
      };
    },
    created () {
    },
    mounted () {
    },
    methods: {},
    components: {NumberTo}
  };
</script>
