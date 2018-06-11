<style scoped>
  .curday-title {
    font-size: 28px;
    background-color: rgba(3, 3, 3, 0.08);
    width: 300px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50px;
    margin-bottom: 20px;
  }

  .backlog-info {
    height: calc(100vh - 114px);
    margin: 0px 5px 0px 20px;
    padding: 20px;
    overflow: auto;
    border-left: #F5F7F9 2px solid;
  }

  .curday-backlog-item {
    cursor: pointer;
  }

  .backlog-info .content {
    padding-top: 2px;
    height: 80px;
  }

  .backlog-info li:hover {

  }

  .time .title {
    font-weight: 800;
    font-size: 14px;
    padding-top: 5px;
  }

  .curbacklog li {
    font-size: 14px;
    line-height: 24px;
    list-style-type: none;
  }

</style>

<style>
  .backlog .comp-full-calendar {
    margin: 0;
  }

  .backlog .time .ivu-tag {
    line-height: 18px;
    height: 18px;
  }

  .full-calendar-body div {
    box-sizing: content-box !important;
  }
</style>

<template>
  <div class="main-view main-view-full backlog">
    <Row>
      <i-col span="16">
        <FullCalendar
          @dayClick="dayClick"
          @eventClick="eventClick"
          :events="backlogList"
          lang="zh"/>
      </i-col>
      <i-col span="8">
        <div class="backlog-info">
          <div v-if="mode===1">
            <div v-if="curDay" class="curday-backlog">
              <div class="curday-title">
                <Icon type="calendar"></Icon>
                {{curDay.format('yyyy年MM月dd日')}}
              </div>
              <Timeline v-if="curDayBackLog" pending>
                <TimelineItem v-for="item in curDayBackLog" class="curday-backlog-item"
                              :key="'curDayBackLog_'+curDayBackLog.id"
                              @click.native="curDayBackLogClick(item)">
                  <div class="time">
                    <span class="title">{{getBackLogTime(item.startTime)}}</span>
                    {{item.title}}
                    <Tag slot="dot" :color="item.priority==1?'red':''">
                      {{item.priority == 0 ? '一般' : item.priority == 1 ? '重要' : ''}}
                    </Tag>
                  </div>
                  <div class="content">
                    <span style="float: right">
                      <Tag :color="item.status==1?'blue':'green'" @click.native="finishClick(item)">
                            {{item.status == 0 ? '未完成' : item.status == 1 ? '已完成' : ''}}
                      </Tag>
                  </span>
                    <div>{{item.content}}</div>
                  </div>
                </TimelineItem>
                <TimelineItem>
                  <Button type="dashed" size="small" @click="addClick" icon="plus-round">待办事项</Button>
                </TimelineItem>
              </Timeline>

            </div>
          </div>
          <div v-else="mode===2">
            <ul v-if="curBackLog" class="curbacklog">
              <li><h1>{{curBackLog.name}}</h1></li>
              <li><br></li>
              <li><span><strong>时间：</strong>{{curBackLog.startTime}}</span></li>
              <li><strong>状态：</strong>
                <Tag
                  @click.native="finishClick(curBackLog)"
                  :color="curBackLog.status==1?'blue':'green'">
                  {{curBackLog.status == 0 ? '未完成' : curBackLog.status == 1 ? '已完成' : ''}}
                </Tag>
              </li>

              <li><strong>详细内容：</strong><br><span>{{curBackLog.content}}</span></li>
              <div style="position: absolute;bottom: 20px">
                <Button @click="finishClick(curBackLog)" icon="flag" type="ghost">
                  标记{{curBackLog.status == 1 ? '未完成' : curBackLog.status == 0 ? '已完成' : ''}}
                </Button>
                <Button @click="editClick" icon="edit" type="ghost">编 辑</Button>
              </div>
            </ul>


          </div>

        </div>

      </i-col>
    </Row>
    <PopupEdit ref="popupEdit"
               :width="editOptions.width"
               :dynamic="editOptions.dynamic"
               @on-success="editSuccess"
               :label-width="100">
    </PopupEdit>
  </div>
</template>

<script>
  /**
   * 弹出式表单参数
   */
  const editOptions = {
    width: 800,
    labelWidth: 100,
    dynamic: [
      [
        {name: 'id', hidden: true}
      ], [
        {
          name: 'priority',
          type: 'radio',
          span: 8,
          label: '优先级',
          value: 0,
          rules: {required: true, type: 'number'},
          data: [
            {label: '一般', value: 0},
            {label: '重要', value: 1}
          ]
        },
        {
          name: 'startTime',
          type: 'datetime',
          span: 8,
          label: '开始时间',
          rules: {required: true, type: 'date'}
        },
        {name: 'finishTime', type: 'datetime', span: 8, label: '截止时间'}
      ], [
        {name: 'name', type: 'text', span: 24, label: '名称', rules: {required: true}},

        {name: 'content', type: 'text', span: 24, label: '详细内容', textarea: {minRows: 5, maxRows: 8}}
//        {name: 'pictures', type: 'imgUpload', span: 24, label: '图片'}
      ]
    ]
  };
  import FullCalendar from 'vue-fullcalendar';
  import DateUtils from 'utils/DateUtils';
  import {PopupEdit, CrudView} from 'components/';
  import Emitter from '@/utils/mixins/emitter';

  export default {
    data () {
      return {
        editOptions,
        backlogList: [],
        curBackLog: null,
        curDay: null,
        mode: 0,
        curDayBackLog: []
      };
    },
    mixins: [Emitter],
    computed: {},
    methods: {
      editSuccess (res, data) {
        if (this.curBackLog != null) {
          this.curBackLog.name = data.name;
          this.curBackLog.startTime = data.startTime.format('yyyy-MM-dd hh:mm');
          this.curBackLog.finishTime = data.finishTime;
          this.curBackLog.content = data.content;
          this.curBackLog.priority = data.priority;
        }
        this.getData();
        this.dispatch('Home', 'on-query-backlog');
      },
      getBackLogTime (time) {
        if (time.length > 10 && time.indexOf('00:00:00') == -1) {
          return time.substring(11, 16);
        } else {
          return '全天';
        }
      },
      addClick () {
        let data = {
          startTime: this.curDay
        };
        this.$refs.popupEdit.open({title: '添加待办事项', postUrl: '/work/backlog/create'}, data);
      },
      editClick () {
        this.$refs.popupEdit.open({title: '编辑待办事项', postUrl: '/work/backlog/update'}, this.curBackLog);
      },
      finishClick (item) {
        let data = {
          id: item.id,
          status: item.status == 1 ? 0 : 1
        };
        this.$http.apiPost('/work/backlog/update', data).then((res) => {
          if (!res.success) {
            this.$http.handleError(res);
          } else {
            item.status = data.status;
            this.$Message.success('修改成功');
            this.dispatch('Home', 'on-query-backlog');
          }
        });
      },
      curDayBackLogClick (item) {
        this.curBackLog = item;
        this.mode = 2;
      },
      eventClick (e) {
        this.curBackLog = e;
        this.mode = 2;
      },
      initDayBackData (e) {
        if (this.curDay != null) {
          this.curDayBackLog = [];
          for (let i = 0; i < this.backlogList.length; i++) {
            if (this.backlogList[i].start.substring(0, 10) == this.curDay.format('yyyy-MM-dd')) {
              this.curDayBackLog.push(this.backlogList[i]);
            }
          }
        }
      },
      dayClick (e) {
        this.curDay = e;
        this.mode = 1;
        this.initDayBackData();
      },
      getData () {
        this.$http.apiPost('/work/backlog/list', {}).then((res) => {
          if (!res.success) {
            this.$http.handleError(res);
          } else {
            let data = res.data.rows;
            for (let i = 0; i < data.length; i++) {
              data[i].start = data[i].startTime;
              data[i].end = data[i].finishTime || data[i].startTime;
              data[i].title = data[i].name;
            }
            this.backlogList = data;
            this.initDayBackData();
          }
        });
      }
    },
    mounted () {
      this.getData();
    },
    activated () {
      let pBackLog = this.$route.params.backLog;
      if (pBackLog) {
        this.curBackLog = pBackLog;
        this.mode = 2;
      }
    },
    components: {CrudView, FullCalendar, DateUtils, PopupEdit}
  };

</script>
