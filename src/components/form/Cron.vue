<style scoped>
  .bottom {
    width: 100%;
    text-align: right;
    margin-top: 5px;
    position: relative;
  }

  #changeContab {
    margin-bottom: 5px;
  }

  .tabBody {
    height: 410px;
    padding-bottom: 5px;
    margin: 10px;
  }

  .value {
    font-size: 18px;
    text-align: left;
    vertical-align: middle;
  }

  .cron-row {
    display: block;
  }



</style>
<style>
  #changeContab .cron-row .ivu-radio-group-item {
    display: inline-block !important;
    height: 40px !important;
    line-height: 40px !important;
  }

  #changeContab .ivu-radio-group {
    width: 100%;
  }

  #changeContab .ivu-tabs-bar {
    padding-left: 10px;
  }

  .auto-width {
    width: auto !important;
    min-width: 80px;
  }


</style>
<template>
  <div id="changeContab">
    <Tabs :animated="false">
      <TabPane name="second" :label="text.Seconds.name">
        <div class="tabBody">
          <RadioGroup vertical v-model="second.cronEvery">
            <Row>
              <Radio label="1">{{text.Seconds.every}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio label="2">{{text.Seconds.interval[0]}}</Radio>
              <input-number v-model="second.incrementIncrement" :min="1" :max="60"></input-number>
              {{text.Seconds.interval[1]||''}}
              <input-number v-model="second.incrementStart" :min="0" :max="59"></input-number>
              {{text.Seconds.interval[2]||''}}
            </Row>
            <Row class="cron-row">
              <Row class="cron-row">
                <Radio class="long" label="3">{{text.Seconds.specific}}</Radio>
              </Row>
              <Select multiple v-model="second.specificSpecific">
                <Option v-for="val in 60" :key="val" :value="val-1">{{val-1}}</Option>
              </Select>
            </Row>
            <Row class="cron-row">
              <Radio label="4">{{text.Seconds.cycle[0]}}</Radio>
              <input-number v-model="second.rangeStart" :min="1" :max="60"></input-number>
              {{text.Seconds.cycle[1]||''}}
              <input-number v-model="second.rangeEnd" :min="0" :max="59"></input-number>
              {{text.Seconds.cycle[2]||''}}
            </Row>
          </RadioGroup>
        </div>
      </TabPane>
      <TabPane name="minutes" :label="text.Minutes.name">
        <div class="tabBody">
          <RadioGroup vertical v-model="minute.cronEvery">
            <Row>
              <Radio label="1">{{text.Minutes.every}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio label="2">{{text.Minutes.interval[0]}}</Radio>
              <input-number v-model="minute.incrementIncrement" :min="1" :max="60"></input-number>
              {{text.Minutes.interval[1]}}
              <input-number v-model="minute.incrementStart" :min="0" :max="59"></input-number>
              {{text.Minutes.interval[2]||''}}
            </Row>
            <Row class="cron-row">
              <Radio class="long" label="3">{{text.Minutes.specific}}</Radio>
              <Select multiple v-model="minute.specificSpecific">
                <Option v-for="val in 60" :key="val" :value="val-1">{{val-1}}</Option>
              </Select>
            </Row>
            <Row class="cron-row">
              <Radio label="4">{{text.Minutes.cycle[0]}}</Radio>
              <input-number v-model="minute.rangeStart" :min="1" :max="60"></input-number>
              {{text.Minutes.cycle[1]}}
              <input-number v-model="minute.rangeEnd" :min="0" :max="59"></input-number>
              {{text.Minutes.cycle[2]}}
            </Row>
          </RadioGroup>
        </div>
      </TabPane>
      <TabPane name="hour" :label="text.Hours.name">

        <div class="tabBody">
          <RadioGroup vertical v-model="hour.cronEvery">
            <Row>
              <Radio label="1">{{text.Hours.every}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio label="2">{{text.Hours.interval[0]}}</Radio>
              <input-number v-model="hour.incrementIncrement" :min="0" :max="23"></input-number>
              {{text.Hours.interval[1]}}
              <input-number v-model="hour.incrementStart" :min="0" :max="23"></input-number>
              {{text.Hours.interval[2]}}
            </Row>
            <Row class="cron-row">
              <Radio class="long" label="3">{{text.Hours.specific}}</Radio>
              <Select multiple v-model="hour.specificSpecific">
                <Option v-for="val in 24" :key="val" :value="val-1">{{val-1}}</Option>
              </Select>
            </Row>
            <Row class="cron-row">
              <Radio label="4">{{text.Hours.cycle[0]}}</Radio>
              <input-number v-model="hour.rangeStart" :min="0" :max="23"></input-number>
              {{text.Hours.cycle[1]}}
              <input-number v-model="hour.rangeEnd" :min="0" :max="23"></input-number>
              {{text.Hours.cycle[2]}}
            </Row>
          </RadioGroup>
        </div>

      </TabPane>
      <TabPane name="day" :label="text.Day.name">
        <div class="tabBody">
          <RadioGroup vertical v-model="day.cronEvery">
            <Row>
              <Radio v-model="day.cronEvery" label="1">{{text.Day.every}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="2">{{text.Day.intervalWeek[0]}}</Radio>
              <input-number v-model="week.incrementIncrement" :min="1" :max="7"></input-number>
              {{text.Day.intervalWeek[1]}}
              <Select class="auto-width" v-model="week.incrementStart">
                <Option v-for="val in 7" :key="val" :label="text.Week[val-1]" :value="val"></Option>
              </Select>
              {{text.Day.intervalWeek[2]}}
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="3">{{text.Day.intervalDay[0]}}</Radio>
              <input-number v-model="day.incrementIncrement" :min="1" :max="31"></input-number>
              {{text.Day.intervalDay[1]}}
              <input-number v-model="day.incrementStart" :min="1" :max="31"></input-number>
              {{text.Day.intervalDay[2]}}
            </Row>
            <Row class="cron-row">
              <Radio class="long" v-model="day.cronEvery" label="4">{{text.Day.specificWeek}}</Radio>
              <Select class="auto-width" multiple v-model="week.specificSpecific">
                <Option v-for="val in 7"
                        :key="val"
                        :label="text.Week[val-1]"
                        :value="['SUN','MON','TUE','WED','THU','FRI','SAT'][val-1]"
                ></Option>
              </Select>
            </Row>
            <Row class="cron-row">
              <Radio class="long" v-model="day.cronEvery" label="5">{{text.Day.specificDay}}</Radio>
              <Select class="auto-width" multiple v-model="day.specificSpecific">
                <Option v-for="val in 31" :key="val" :value="val">{{val}}</Option>
              </Select>
            </Row>
            <Row>
              <Radio v-model="day.cronEvery" label="6">{{text.Day.lastDay}}</Radio>
            </Row>
            <Row>
              <Radio v-model="day.cronEvery" label="7">{{text.Day.lastWeekday}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="8">{{text.Day.lastWeek[0]}}</Radio>
              <Select placement="top" class="auto-width" v-model="day.cronLastSpecificDomDay">
                <Option v-for="val in 7" :key="val" :label="text.Week[val-1]" :value="val"></Option>
              </Select>
              {{text.Day.lastWeek[1]||''}}
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="9">
                {{text.Day.beforeEndMonth[0]}}
              </Radio>
              <input-number v-model="day.cronDaysBeforeEomMinus" :min="1" :max="31"></input-number>
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="10">{{text.Day.nearestWeekday[0]}}</Radio>
              <input-number v-model="day.cronDaysNearestWeekday" :min="1" :max="31"></input-number>
              {{text.Day.nearestWeekday[1]}}
            </Row>
            <Row class="cron-row">
              <Radio v-model="day.cronEvery" label="11">{{text.Day.someWeekday[0]}}
              </Radio>
              {{text.Day.someWeekday[1]}}
              <input-number v-model="week.cronNthDayNth" :min="1" :max="5"></input-number>
              <Select class="auto-width" v-model="week.cronNthDayDay">
                <Option v-for="val in 7" :key="val" :label="text.Week[val-1]" :value="val"></Option>
              </Select>


            </Row>
          </RadioGroup>
        </div>
      </TabPane>
      <TabPane name="month" :label="text.Month.name">
        <div class="tabBody">
          <RadioGroup vertical v-model="month.cronEvery">
            <Row>
              <Radio label="1">{{text.Month.every}}</Radio>
            </Row>

            <Row class="cron-row">
              <Radio label="2">{{text.Month.interval[0]}}</Radio>
              <input-number v-model="month.incrementIncrement" :min="0" :max="12"></input-number>
              {{text.Month.interval[1]}}
              <input-number v-model="month.incrementStart" :min="0" :max="12"></input-number>
            </Row>
            <Row class="cron-row">
              <Radio class="long" label="3">{{text.Month.specific}}</Radio>
              <Select multiple v-model="month.specificSpecific">
                <Option v-for="val in 12" :key="val" :label="val" :value="val"></Option>
              </Select>
            </Row>
            <Row class="cron-row">
              <Radio label="4">{{text.Month.cycle[0]}}</Radio>
              <input-number v-model="month.rangeStart" :min="1" :max="12"></input-number>
              {{text.Month.cycle[1]}}
              <input-number v-model="month.rangeEnd" :min="1" :max="12"></input-number>
            </Row>

          </RadioGroup>
        </div>
      </TabPane>
      <TabPane name="year" :label="text.Year.name">
        <div class="tabBody">
          <RadioGroup vertical v-model="year.cronEvery">
            <Row>
              <Radio label="1">{{text.Year.every}}</Radio>
            </Row>
            <Row class="cron-row">
              <Radio label="2">{{text.Year.interval[0]}}</Radio>
              <input-number v-model="year.incrementIncrement" :min="1" :max="99"></input-number>
              {{text.Year.interval[1]}}
              <input-number v-model="year.incrementStart" :min="2018" :max="2118"></input-number>
            </Row>
            <Row class="cron-row">
              <Radio class="long" label="3">{{text.Year.specific}}</Radio>
              <Select filterable multiple v-model="year.specificSpecific" class="auto-width" >
                <Option v-for="val in 100" :key="val" :label="2017+val" :value="2017+val"></Option>
              </Select>
            </Row>
            <Row class="cron-row">
            <Radio label="4">{{text.Year.cycle[0]}}
              <input-number v-model="year.rangeStart" :min="2018" :max="2118"></input-number>
              {{text.Year.cycle[1]}}
              <input-number v-model="year.rangeEnd" :min="2018" :max="2118"></input-number>
            </Radio>
            </Row>
          </RadioGroup>
        </div>
      </TabPane>
    </Tabs>
    <!--<div class="bottom">-->
    <!--<span class="value">{{this.cron}}</span>-->
    <!--<Button type="primary" @click="change">{{text.Save}}</Button>-->
    <!--<Button type="primary" @click="close">{{text.Close}}</Button>-->
    <!--</div>-->
  </div>
</template>
<script>
  import ICol from 'iview/src/components/grid/col';

  const text = {
    Seconds: {
      name: ' 秒 ',
      every: '每一秒钟',
      interval: ['每隔', '秒执行 从', '秒开始'],
      specific: '具体秒数(可多选)',
      cycle: ['周期从', '到', '秒']
    },
    Minutes: {
      name: ' 分 ',
      every: '每一分钟',
      interval: ['每隔', '分执行 从', '分开始'],
      specific: '具体分钟数(可多选)',
      cycle: ['周期从', '到', '分']
    },
    Hours: {
      name: ' 时 ',
      every: '每一小时',
      interval: ['每隔', '小时执行 从', '小时开始'],
      specific: '具体小时数(可多选)',
      cycle: ['周期从', '到', '小时']
    },
    Day: {
      name: ' 天 ',
      every: '每一天',
      intervalWeek: ['每隔', '周执行 从', '开始'],
      intervalDay: ['每隔', '天执行 从', '天开始'],
      specificWeek: '具体星期几(可多选)',
      specificDay: '具体天数(可多选)',
      lastDay: '在这个月的最后一天',
      lastWeekday: '在这个月的最后一个工作日',
      lastWeek: ['在这个月的最后一个'],
      beforeEndMonth: ['在本月底前', '天'],
      nearestWeekday: ['最近的工作日（周一至周五）至本月', '日'],
      someWeekday: ['在这个月的第', '个']
    },
    Week: ['天', '一', '二', '三', '四', '五', '六'].map(val => '星期' + val),
    Month: {
      name: ' 月 ',
      every: '每一月',
      interval: ['每隔', '月执行 从', '月开始'],
      specific: '具体月数(可多选)',
      cycle: ['从', '到', '月之间的每个月']
    },
    Year: {
      name: ' 年 ',
      every: '每一年',
      interval: ['每隔', '年执行 从', '年开始'],
      specific: '具体年份(可多选)',
      cycle: ['从', '到', '年之间的每一年']
    },
    Save: '保存',
    Close: '关闭'
  };

  const emptyFormat = (val) => {
    return val === null ? '' : val;
  };

  const defaultValue = {
    second: {
      cronEvery: '',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: []
    },
    minute: {
      cronEvery: '',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: []
    },
    hour: {
      cronEvery: '',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: []
    },
    day: {
      cronEvery: '',
      incrementStart: 1,
      incrementIncrement: 1,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: [],
      cronLastSpecificDomDay: 1,
      cronDaysBeforeEomMinus: null,
      cronDaysNearestWeekday: null
    },
    week: {
      cronEvery: '',
      incrementStart: 1,
      incrementIncrement: 1,
      specificSpecific: [],
      cronNthDayDay: 1,
      cronNthDayNth: 1
    },
    month: {
      cronEvery: '',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: []
    },
    year: {
      cronEvery: '',
      incrementStart: 2017,
      incrementIncrement: 1,
      rangeStart: null,
      rangeEnd: null,
      specificSpecific: []
    }
  };

  export default {

    props: ['data'],
    data () {
      return {
        second: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: []
        },
        minute: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: []
        },
        hour: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: []
        },
        day: {
          cronEvery: '',
          incrementStart: 1,
          incrementIncrement: 1,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: [],
          cronLastSpecificDomDay: 1,
          cronDaysBeforeEomMinus: null,
          cronDaysNearestWeekday: null
        },
        week: {
          cronEvery: '',
          incrementStart: 1,
          incrementIncrement: 1,
          specificSpecific: [],
          cronNthDayDay: 1,
          cronNthDayNth: 1
        },
        month: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: []
        },
        year: {
          cronEvery: '',
          incrementStart: 2017,
          incrementIncrement: 1,
          rangeStart: null,
          rangeEnd: null,
          specificSpecific: []
        },
        output: {
          second: '',
          minute: '',
          hour: '',
          day: '',
          month: '',
          Week: '',
          year: ''
        }
      };
    },
    watch: {
      data () {
        this.rest(this.$data);
      }
    },
    computed: {
      text () {
        return text;
      },
      secondsText () {
        let seconds = '';
        let cronEvery = this.second.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            seconds = '*';
            break;
          case '2':
            seconds = this.second.incrementStart + '/' + this.second.incrementIncrement;
            console.log(seconds);
            break;
          case '3':
            this.second.specificSpecific.map(val => {
              seconds += val + ',';
            });
            seconds = seconds.slice(0, -1);
            break;
          case '4':
            seconds = emptyFormat(this.second.rangeStart) + '-' + emptyFormat(this.second.rangeEnd);
            break;
        }
        return seconds;
      },
      minutesText () {
        let minutes = '';
        let cronEvery = this.minute.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            minutes = '*';
            break;
          case '2':
            minutes = this.minute.incrementStart + '/' + this.minute.incrementIncrement;
            break;
          case '3':
            this.minute.specificSpecific.map(val => {
              minutes += val + ',';
            });
            minutes = minutes.slice(0, -1);
            break;
          case '4':
            minutes = emptyFormat(this.minute.rangeStart) + '-' + emptyFormat(this.minute.rangeEnd);
            break;
        }
        return minutes;
      },
      hoursText () {
        let hours = '';
        let cronEvery = this.hour.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            hours = '*';
            break;
          case '2':
            hours = this.hour.incrementStart + '/' + this.hour.incrementIncrement;
            break;
          case '3':
            this.hour.specificSpecific.map(val => {
              hours += val + ',';
            });
            hours = hours.slice(0, -1);
            break;
          case '4':
            hours = emptyFormat(this.hour.rangeStart) + '-' + emptyFormat(this.hour.rangeEnd);
            break;
        }
        return hours;
      },
      daysText () {
        let days = '';
        let cronEvery = this.day.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            break;
          case '2':
          case '4':
          case '11':
            days = '?';
            break;
          case '3':
            days = this.day.incrementStart + '/' + this.day.incrementIncrement;
            break;
          case '5':
            this.day.specificSpecific.map(val => {
              days += val + ',';
            });
            days = days.slice(0, -1);
            break;
          case '6':
            days = 'L';
            break;
          case '7':
            days = 'LW';
            break;
          case '8':
            days = emptyFormat(this.day.cronLastSpecificDomDay) + 'L';
            break;
          case '9':
            days = 'L-' + emptyFormat(this.day.cronDaysBeforeEomMinus);
            break;
          case '10':
            days = emptyFormat(this.day.cronDaysNearestWeekday) + 'W';
            break;
        }
        return days;
      },
      weeksText () {
        let weeks = '';
        let cronEvery = this.day.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
          case '3':
          case '5':
            weeks = '?';
            break;
          case '2':
            weeks = this.week.incrementStart + '/' + this.week.incrementIncrement;
            break;
          case '4':
            this.week.specificSpecific.map(val => {
              weeks += val + ',';
            });
            weeks = weeks.slice(0, -1);
            break;
          case '6':
          case '7':
          case '8':
          case '9':
          case '10':
            weeks = '?';
            break;
          case '11':
            weeks = this.week.cronNthDayDay + '#' + this.week.cronNthDayNth;
            break;
        }
        return weeks;
      },
      monthsText () {
        let months = '';
        let cronEvery = this.month.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            months = '*';
            break;
          case '2':
            months = this.month.incrementStart + '/' + this.month.incrementIncrement;
            break;
          case '3':
            this.month.specificSpecific.map(val => {
              months += val + ',';
            });
            months = months.slice(0, -1);
            break;
          case '4':
            months = emptyFormat(this.month.rangeStart) + '-' + emptyFormat(this.month.rangeEnd);
            break;
        }
        return months;
      },
      yearsText () {
        let years = '';
        let cronEvery = this.year.cronEvery;
        switch (cronEvery.toString()) {
          case '1':
            years = '*';
            break;
          case '2':
            years = this.year.incrementStart + '/' + this.year.incrementIncrement;
            break;
          case '3':
            this.year.specificSpecific.map(val => {
              years += val + ',';
            });
            years = years.slice(0, -1);
            break;
          case '4':
            years = emptyFormat(this.year.rangeStart) + '-' + emptyFormat(this.year.rangeEnd);
            break;
        }
        return years;
      },
      cron () {
        return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'} ${this.yearsText || '*'}`;
      }
    },
    methods: {
      getValue () {
        return this.cron;
      },
      reset () {
        this.$nextTick(() => {
          let defaultVal = JSON.parse(JSON.stringify(defaultValue));
          this.day = defaultVal.day;
          this.second = defaultVal.second;
          this.hour = defaultVal.hour;
          this.minute = defaultVal.minute;
          this.year = defaultVal.year;
          this.week = defaultVal.week;
          this.month = defaultVal.month;
        });
      },
      change () {
        this.$emit('change', this.cron);
        this.$emit('input', this.cron);
        this.close();
      },
      close () {
        this.$emit('close');
      },
      rest (data) {
        for (let i in data) {
          if (data[i] instanceof Object) {
            this.rest(data[i]);
          } else {
            switch (typeof data[i]) {
              case 'object':
                data[i] = [];
                break;
              case 'string':
                data[i] = '';
                break;
            }
          }
        }
      }

    },
    mounted () {
    },
    watch: {}
  };
</script>
