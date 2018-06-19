<style scoped>
  .sys-index {
    padding: 10px;
    width: 100%;
  }

  .backlog li {
    height: 70px;
    cursor: pointer;
    padding: 5px;
    border-bottom: #F5F7F9 1px solid;
    cursor: pointer;
    list-style-type: none;
  }

  .backlog li:last-child {
    border-bottom: none;
  }

  .backlog li:hover {
    background-color: #ebf7ff
  }

  .empty {
    font-size: 16px;
    text-align: center;
    color: #80848f;
    height: 100%;
    width: 100%;
    padding-top: 120px;
  }

  .backlog-parent {
    height: 565px
  }

  .backlog-content {
    color: #657180;
    font-size: 13px
  }
</style>
<style>
  .not-padding .ivu-card-body {
    padding: 0px;
  }

</style>

<template>
  <div class="sys-index">
    <Row>
      <i-col span="24">
        <IndexCharts></IndexCharts>
      </i-col>
    </Row>

    <Row style="padding-top: 20px" :gutter="20">
      <i-col span="6" class="not-padding backlog">
        <Card :bordered="false">
          <h3 slot="title">待办事项</h3>
          <router-link slot="extra" to="/work/backlog">
            更多
            <Icon type="ios-arrow-right"></Icon>
          </router-link>
          <div class="backlog-parent">
            <ul v-if="backlogList">
              <li v-for="item in backlogList" class="curday-backlog-li" @click="backlogItemClick(item)">
                <Tag :color="item.priority==1?'red':'default'">
                  {{item.priority == 0 ? '一般' : item.priority == 1 ? '重要' : ''}}
                </Tag>
                <span style="font-weight: 800;font-size: 14px;padding-top: 5px">
                     {{item.name}}
                  </span>
                <span style="float: right">
                  {{DateUtils.getSimpleDate2(item.startTime)}}
                      <Tag :color="item.status==1?'blue':'green'">{{item.status == 0 ? '未完成' : item.status == 1 ? '已完成' : ''}}</Tag>
                  </span>
                <div class='backlog-content' v-html="item.content"></div>
              </li>
            </ul>
            <div v-if="backlogList.length==0" class="empty">
              <Icon type='information-circled'></Icon>
              暂无待办事项
            </div>
          </div>

          <!--<Button type="dashed" long @click="handleAdd" icon="plus-round">添加待办事项</Button>-->
        </Card>
      </i-col>
      <i-col :span="18">
        <Card :bordered="false" style="padding: 10px">
          <row>
            <i-col :span="6">
              <NumberCircle :endVal="15652" leftText="本周访问量" rightText="人"></NumberCircle>
            </i-col>
            <i-col :span="6">
              <NumberCircle :endVal="15652" leftText="本周访问量" rightText="人"></NumberCircle>
            </i-col>
            <i-col :span="6">
              <NumberCircle :endVal="15652" leftText="本周访问量" rightText="人"></NumberCircle>
            </i-col>
            <i-col :span="6">
              <NumberCircle :endVal="15652" leftText="本周访问量" rightText="人"></NumberCircle>
            </i-col>
          </row>

          <row>
            <div style="height: 427px"></div>
          </row>
        </Card>

      </i-col>


    </Row>

  </div>
</template>
<script>
  import DateUtils from 'utils/DateUtils';
  import {NumberUd, NumberCircle} from 'components/';
  import IndexCharts from './IndexCharts';

  export default {
    data () {
      return {
        imgUrl: HOST + '/sys/attach/getImg?id=',
        DateUtils
      };
    },
    computed: {
      warningList () {
        return this.$store.state.warning;
      },
      backlogList () {
        return this.$store.state.backlog;
      }
    },
    methods: {
      backlogItemClick (item) {
        this.$router.push({
          path: '/work/backlog',
          name: '待办事项',
          params: {
            backLog: item
          }
        });
      }
    },
    mounted () {

    },
    components: {NumberUd, IndexCharts, NumberCircle}
  };
</script>
