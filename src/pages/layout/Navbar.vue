<style scoped>
  .layout-header {
    height: 48px;
    background: #fff;
    box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
  }

  .user-panel {
    margin-left: 10px;
    padding: 0px 10px;
  }

  .layout-header-right {
    float: right;
    display: block;
    padding-right: 36px;
    color: #5c6b77;
    padding-top: 1px;
    line-height: 45px;
  }

  .list-panel:hover {
    box-sizing: border-box;
    border-bottom: 2px solid #5c6b77;
  }

  .msg-list {
    padding: 0 10px;
  }

  .tabs {
    width: 340px;
  }

  .msg-tabpane {
    min-height: 260px;
  }

  .msg-tabpane .list {
    min-height: 260px;
  }

  .msg-tabpane ul {
    padding-bottom: 35px;
  }

  .msg-tabpane .more {
    position: absolute;
    bottom: 0px;
    height: 36px;
    width: 100%
  }

  .msg-tabpane ul li {
    height: 70px;
    padding: 5px;
    border-bottom: 1px solid #e9eaec;
    cursor: pointer;
    list-style-type: none;
  }

  .msg-tabpane ul li:hover {
    background-color: #ebf7ff
  }

  .msg-tabpane .empty {
    font-size: 14px;
    text-align: center;
    color: #80848f;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 40%;
  }

  .user-name {
    font-size: 14px;
    padding-left: 3px;
  }

  .backlog-content{
    color: #657180;font-size: 13px
  }

</style>
<style>
  .msg-list .ivu-poptip-body {
    padding: 0px;
  }

  .msg-list .ivu-tabs-nav-scroll {
    padding: 10px 50px 0px 50px;
  }

  .msg-list .ivu-tabs-bar {
    margin-bottom: 0px;
  }
</style>
<template>

  <div class="layout-header">

    <div style="padding: 6px 15px;float: left;cursor: pointer;" @click="toggleClick">
      <Icon type="navicon" size="34"></Icon>
    </div>
    <div class="layout-header-right">


      <Poptip class="msg-list list-panel" placement="bottom-end" trigger="hover" @on-popper-show="tabPopperShow">
        <Badge :dot="isNewMsg">
          <Icon type="ios-bell" size="24"></Icon>
        </Badge>
        <div class="api" slot="content">
          <Tabs class="tabs" v-model="tabIndex">
            <TabPane class="msg-tabpane" :label="label1" name="name1">
              <div class="list">
                <ul v-if="warningList.length>0">
                  <li>

                  </li>
                </ul>
                <div class="empty" v-else>
                  <Icon type='information-circled'></Icon>
                  暂无报警
                </div>
              </div>

              <router-link to="/warning/warning" class="more">
                <Button type="text" long size="large">查看更多</Button>
              </router-link>

            </TabPane>

            <TabPane class="msg-tabpane" :label="label2" name="name2">
              <div class="list">
                <ul v-if="backlogList.length>0">
                  <li v-for="item in backlogList" @click="gotoBacklog(item)">
                  <span style="line-height: 24px;font-weight: 800">
                    {{item.name}}
                  </span>
                    <span style="float: right">
                    {{DateUtils.getSimpleDate2(item.startTime)}}
                      <Tag :color="item.priority==1?'red':'default'">
                      {{item.priority == 0 ? '一般' : item.priority == 1 ? '重要' : ''}}
                      </Tag>
                  </span>
                    <div class="backlog-content" v-html="item.content">
                    </div>
                  </li>
                </ul>
                <div class="empty" v-else>
                  <Icon type='information-circled'></Icon>
                  暂无待办事项
                </div>
              </div>
              <router-link to="/work/backlog" class="more">
                <Button type="text" long size="large">查看更多</Button>
              </router-link>
            </TabPane>
            <TabPane class="msg-tabpane" :label="label3" name="name3">
              <ul>

              </ul>
              <!--<router-link>-->
              <!--<Button type="text" long size="large">查看更多</Button>-->
              <!--</router-link>-->
            </TabPane>
          </Tabs>
        </div>
      </Poptip>


      <Dropdown class="user-panel list-panel">


        <Avatar icon="person" size="small" style="background-color: #5c6b77"/>
        <span class="user-name">{{userData.userName}}</span>


        <DropdownMenu slot="list">
          <DropdownItem name="1" @click.native="passwd">修改密码</DropdownItem>
          <DropdownItem name="2" @click.native="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!--弹出式编辑框-->
      <PopupEdit ref="tablePopupEdit"
                 :width="tableRefOptions.width"
                 :dynamic="tableRefOptions.dynamic"
                 :label-width="tableRefOptions.labelWidth">
      </PopupEdit>
    </div>
  </div>
</template>

<script>
  import DateUtils from 'utils/DateUtils';
  import config from '@/config';
  import Emitter from '@/utils/mixins/emitter';
  import {PopupEdit} from 'components/';

  /**
   * 弹出式表单参数
   */
  const tableRefOptions = {
    width: 420,
    labelWidth: 80,
    dynamic: [
      [
        {name: 'userName', hidden: true},
        {name: 'pwd', type: 'text', span: 24, label: '旧密码', rules: {required: true}},
        {name: 'newpwd', type: 'text', span: 24, label: '新密码', rules: {required: true, group: 'pwd'}},
        {name: 'newpwd2', type: 'text', span: 24, label: '再次输入新密码', rules: {required: true, group: 'pwd'}}
      ]
    ]
  };
  export default {
    name: 'navbar',
    mixins: [Emitter],
    props: ['toggleClick'],
    data () {
      return {
        label1: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: this.$store.state.warning.length > 0
              }
            }, [h('span', '报 警')])
          ]);
        },
        label2: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: this.$store.state.backlog.length > 0
              }
            }, [h('span', '待 办')])
          ]);
        },
        label3: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: false
              }
            }, [h('span', '消 息')])
          ]);
        },
        userData: OperatorUtils.getUserData(),
        tableRefOptions,
        tabIndex: 0,
        DateUtils
      };
    },
    computed: {
      warningList () {
        return this.$store.state.warning;
      },
      backlogList () {
        if (this.$store.state.backlog != null) {
          return this.$store.state.backlog.slice(0, 4);
        }
        return this.$store.state.backlog;
      },
      isNewMsg () {
        if (this.$store.state.backlog.length > 0 || this.$store.state.warning.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    created () {

    },
    methods: {
      gotoBacklog (item) {
        this.$router.push({
          path: '/work/backlog',
          name: '待办事项',
          params: {
            backLog: item
          }
        });
      },
      gotoWarning (warning) {

      },
      tabPopperShow () {
        if (this.$store.state.warning.length > 0) {
          this.tabIndex = 'name1';
        } else if (this.$store.state.backlog.length > 0) {
          this.tabIndex = 'name2';
        }
      },
      passwd () {
        this.$refs.tablePopupEdit.dynamic[0][0].value = this.userData.userName;
        this.$refs.tablePopupEdit.open({
          title: '修改密码',
          postUrl: '/sys/user/respwd'
        });
      },
      logout () {
        this.$http.apiPost(config.api.userLogout, null).then((res) => {
          this.loading = false;
          if (!res.success) {
            this.$http.handleError(res);
            this.changeCaptcha();
          } else {
            OperatorUtils.clear();
            this.$router.push({path: '/login'});
          }
        });
      }
    },
    components: {
      tableRefOptions,
      PopupEdit
    }
  };
</script>


