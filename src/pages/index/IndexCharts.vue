<style scoped>
  .count-tip {
    color: rgb(126, 144, 158);
    float: right
  }
</style>

<template>
  <Row :gutter='20'>
    <i-col span='6'>
      <Card :bordered='false' style='height: 155px'>
        <Tooltip class='count-tip' content='年度新注册量' placement='left'>
          <Icon type='information-circled'></Icon>
        </Tooltip>
        <div>
          <NumberUd color='#5c6b77' textAlign='left' :countSize='30' :endVal='countData.data1.count' title='年度新注册量'
                    rightText='人'></NumberUd>
        </div>
        <div id='chart1' style='height: 60px;width: 95%;'></div>
      </Card>
    </i-col>
    <i-col span='6'>
      <Card :bordered='false' style='height: 155px'>
        <Tooltip class='count-tip' content='本月每日新注册量统计' placement='left'>
          <Icon type='information-circled'></Icon>
        </Tooltip>
        <div>
          <NumberUd color='#5c6b77' textAlign='left' :countSize='30' :endVal='countData.data2.count' title='本月新注册量'
                    rightText='人'></NumberUd>
        </div>
        <div id='chart2' style='height: 60px;width: 95%;'></div>
      </Card>
    </i-col>
    <i-col span='6'>
      <Card :bordered='false' style='height: 155px'>
        <Tooltip class='count-tip' content='本周每日新注册量统计' placement='left'>
          <Icon type='information-circled'></Icon>
        </Tooltip>
        <div>
          <NumberUd style='display: inline-block' color='#5c6b77' textAlign='left' :countSize='30'
                    :endVal='countData.data3.count'
                    title='本周新注册量'
                    rightText='人'></NumberUd>
        </div>
        <div id='chart3' style='height: 60px;width: 95%;'></div>
      </Card>
    </i-col>
    <i-col span='6'>
      <Card :bordered='false' style='height: 155px'>
        <Tooltip class='count-tip' content='今日新注册量统计' placement='left'>
          <Icon type='information-circled'></Icon>
        </Tooltip>
        <div>
          <NumberUd style='display: inline-block' color='#5c6b77' textAlign='left' :countSize='30'
                    :endVal='countData.data4.count'
                    title='今日新注册量'
                    rightText='人'></NumberUd>
        </div>
        <div id='chart4' style='height: 60px;width: 95%;'></div>
      </Card>
    </i-col>

  </Row>
</template>

<script>

  const getCountOption = (data) => {
    let label = [];
    let val = [];
    let sum = 0;
    console.log(111111);
    console.log(data);
    for (let key in data.count) {
      label.push(key);
      val.push(data.count[key][0]);
      sum += parseFloat(data.count[key][0]);
    }
    let option = {
      sum: sum,
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        borderWidth: 1
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: label
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      color: ['#00CB00'],
      series: [
        {
          name: '注册量',
          type: 'line',
          smooth: true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: val
        }
      ]
    };
    return option;
  };

  import echarts from 'echarts';
  import {NumberUd} from 'components/';

  export default {
    props: {},
    data () {
      return {
        countData: {
          data1: {count: 0},
          data2: {count: 0},
          data3: {count: 0},
          data4: {count: 0}
        }
      };
    },
    created () {
    },
    mounted () {
      this.queryData();
    },
    methods: {
      queryData (data) {

        let countData1 = {
          count: {
            '2018年1月': [268568],
            '2018年2月': [580457],
            '2018年3月': [580457],
            '2018年4月': [900457],
            '2018年5月': [980457],
            '2018年6月': [780457],
            '2018年7月': [380457],
            '2018年8月': [280457],
            '2018年9月': [180457],
            '2018年10月': [480457],
            '2018年11月': [380457],
            '2018年12月': [280457]
          }
        };

        let countData2 = {
          count: {
            '6月1号': [8000],
            '6月2号': [6000],
            '6月3号': [4000],
            '6月4号': [6000],
            '6月5号': [4000],
            '6月6号': [3000],
            '6月7号': [5000],
            '6月8号': [5510],
            '6月9号': [6615]
          }
        };

        let countData3 = {
          count: {
            '6月4号': [450],
            '6月5号': [400],
            '6月6号': [300],
            '6月7号': [700],
            '6月8号': [600],
            '6月9号': [345]
          }
        };

        let countData4 = {
          count: {
            '1时': [1],
            '2时': [10],
            '3时': [10],
            '4时': [2],
            '5时': [5],
            '6时': [10],
            '7时': [60],
            '8时': [60],
            '9时': [70],
            '10时': [80],
            '11时': [100],
            '12时': [122]
          }
        };

        let chart1 = echarts.init(document.querySelector('#chart1'));
        let option1 = getCountOption(countData1);
        this.$set(this.countData.data1, 'count', option1.sum);
        chart1.setOption(option1);

        let chart2 = echarts.init(document.querySelector('#chart2'));
        let option2 = getCountOption(countData2);
        this.$set(this.countData.data2, 'count', option2.sum);
        chart2.setOption(option2);

        let chart3 = echarts.init(document.querySelector('#chart3'));
        let option3 = getCountOption(countData3);
        this.$set(this.countData.data3, 'count', option3.sum);
        chart3.setOption(option3);

        let chart4 = echarts.init(document.querySelector('#chart4'));
        let option4 = getCountOption(countData4);
        this.$set(this.countData.data4, 'count', option4.sum);
        chart4.setOption(option4);

      }
    },
    components: {NumberUd}
  };
</script>
