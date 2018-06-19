<style scoped>
  .api-ul {
    height: calc(100vh - 120px);
    margin: 0px 5px 0px 20px;
    padding-right: 20px;
    overflow: auto;
    border-left: #F5F7F9 2px solid;
  }

  .api-li {
    cursor: pointer;
    padding: 2px 0px;
    border-bottom: #F5F7F9 1px solid;
  }

  .api-li:hover {
    border-left: 2px #333 solid;
    font-size: 14px;
  }

  .param-table td {
    height: 30px;
    padding: 0px 5px;
    text-align: center;
  }

  .param-table tr th {
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
  }

  .param-table {
    border: 1px #f8f8f9 solid;
    margin-bottom: 2px;
  }

</style>
<style>
  .param-table .ivu-table-wrapper {
    border: none;
  }
</style>

<template>
  <div class="main-view main-view-full">
    <Row :gutter="10">
      <i-col span="14" style="padding: 10px">
        <Row :gutter="10">
          <i-col span="24">
            <Input v-model="url">

            <Select slot="prepend" v-model="methods" style="width: 100px">
              <Option v-for="item in methodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Input>
          </i-col>
        </Row>
        <Row :gutter="10" style="padding-top: 10px">
          <i-col span="20" style="max-height: 300px;overflow: auto;">
            <Row>
              <table v-show="paramDynamic && paramDynamic.length>0" class="param-table" style="width: 100%" 　>
                <tr>
                  <th style="width: 120px" class="ivu-table-column-center">参数名</th>
                  <th class="ivu-table-column-center">值</th>
                  <th style="width: 60px" class="ivu-table-column-center">　</th>
                </tr>
                <template v-for="(item, index) in paramDynamic" v-if="item.status">
                  <tr>
                    <td><Input type="text" size="small" v-model="item.name" placeholder="参数名"></Input></td>
                    <td><Input type="text" size="small" v-model="item.value" placeholder="值"></Input></td>
                    <td>
                      <Button type="ghost" size="small" @click="handleRemove(index)">删除</Button>
                      </Input></td>
                  </tr>
                </template>
              </table>
            </Row>
            <Row>
              <Button type="dashed" long @click="handleAdd" icon="plus-round">添加参数</Button>
            </Row>
          </i-col>
          <i-col span="4">
            <Button type="ghost" long icon="ios-search" @click="request">发 送</Button>
          </i-col>
        </Row>
        <Row :gutter="10" style="padding-top: 20px">
          <i-col span="24">
            <Input readonly v-model="result" type="textarea" :rows="20"></Input>
          </i-col>
        </Row>
      </i-col>
      <i-col span="10">
        <ul class="api-ul">
          <div style="margin: 10px;">
            <h1>API接口列表</h1>
            <Input size="small" style="width:100%;" icon="ios-search" v-model="searchText"/>
            <template v-for="api in apiList" :kye="api.url">
              <li class="api-li" v-if="filterSearch(api.url)" @click="onClick(api)">
                {{api.url}}
              </li>
            </template>
          </div>
        </ul>
      </i-col>
    </Row>
  </div>

</template>

<script>
  export default {
    props: [],
    data () {
      return {
        methods: '',
        url: '',
        result: '',
        apiList: [],
        searchText: '',
        index: -1,
        paramDynamic: [],
        methodsList: [
          {label: 'POST', value: 'POST'},
          {label: 'GET', value: 'GET'}
        ],
        urlList: []
      };
    },
    created () {
    },
    mounted () {
      this.$http.apiGet('/restful/list', {}).then((res) => {
        this.apiList = res;
        // console.log(this.apiList);
      });
    },
    methods: {
      handleAdd () {
        this.index++;
        this.paramDynamic.push({
          value: '',
          status: 1,
          name: '',
          index: this.index
        });
      },
      handleRemove (index) {
        this.paramDynamic[index].status = 0;
      },
      onClick (api) {
        this.url = api.url.replace('/api/', '/');
      },
      filterSearch (value) {
        if (this.searchText.length === 0 || value.indexOf(this.searchText) >= 0) {
          return true;
        }
        return false;
      },
      request () {
        let param = {};
        for (let i = 0; i < this.paramDynamic.length; i++) {
          let item = this.paramDynamic[i];
          if (item != null && item.status === 1) {
            param[item.name] = item.value;
          }
        }
        switch (this.methods) {
          case 'POST':
            this.$http.apiPost(this.url, param).then((res) => {
              this.result = JSON.stringify(res);
            });
            break;
          case 'GET':
            this.$http.apiGet(this.url, param).then((res) => {
              this.result = JSON.stringify(res);
            });
            break;
          default:
            this.$Message.warning('请选择请求方式！');
            break;
        }
      }
    },
    components: {}
  };
</script>
