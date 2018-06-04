<style scoped>

  .circle-text {
    font-size: 13px;
    color: #f2f2f2;
    line-height: 20px;

  }

  .circle-count {
    text-align: center;
  }
</style>

<style>
  .ivu-chart-circle-inner {
    padding-top: 0px;
  }
</style>
<template>
  <div class="circle-count">
    <Circle :percent="percent" :stroke-width="4" :trail-width="2" :size="84" :stroke-color="strokeColor">
      <NumberTo :endVal="endVal" :countStyle="countStyle">
        <div v-if="rightText" slot="leftText" class="circle-text" style="padding-top: 12px">
          　
        </div>
        <div slot="rightText" class="circle-text">
          {{rightText}}
        </div>
      </NumberTo>
    </Circle>
    <div slot="leftText" class="circle-text">
      <div style="font-weight: 800">{{title}}</div>
    </div>
  </div>

</template>

<script>
  import NumberTo from './NumberTo';
  export default {
    props: {
      title: {},
      endVal: {
        default: 0
      },
      maxVal: {},
      strokeColor: null,
      unit: null,
      rightText: {},
      countSize: {
        default: 22
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
        percent: 0,
        unit2: [[5, '十万多'], [6, '百万多'], [7, '千万多']],
        countStyle: {
          fontSize: this.countSize + 'px',
          color: '#fff'
        }
      }
    },
    created () {

    },
    mounted () {
      console.log(this.maxVal);
      if (this.maxVal != null && this.maxVal > 0) {
        setTimeout(() => {
          this.percent = this.endVal / this.maxVal * 100;
          console.log(this.endVal / this.maxVal);
        }, 100);
      } else {
        setTimeout(() => {
          this.percent = 100;
        }, 100);
      }
    },
    methods: {},
    components: {NumberTo}
  }
</script>
