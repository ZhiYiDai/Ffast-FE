<style scoped>

</style>

<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row style="padding-top: 50px">
      small
      </br>
      <DataSelect size='small'
                  dataUrl="/sys/role/list"
                  :param='param1'
                  style='width:200px'
                  valField='id'
                  textField='name'
                  :disabled="false"
                  placeholder="角色列表"
                  @on-change="onSelectChange1"
                  clearable
                  v-model='val1'/>
    </row>

    <row style="padding-top: 50px">
      绑定数据源
      </br>
      <DataSelect
        dataUrl="/sys/role/list"
        :param='param2'
        style='width:200px'
        valField='id'
        textField='name'
        :disabled="false"
        placeholder="角色列表"
        @on-change="onSelectChange1"
        clearable
        v-model='val2'/>
    </row>
    <row style="padding-top: 50px">
      本地数据
      </br>
      <DataSelect
        :data="[
            {label: '选项1', value: 0}, {label: '选项2', value: 1},
            {label: '选项3', value: 2}, {label: '选项4', value: 3}
          ]"
        style='width:200px'
        :disabled="false"
        placeholder="本地数据"
        @on-change="onSelectChange1"
        clearable
        v-model='val2'/>
    </row>
    <row style="padding-top: 50px">
      字典数据
      </br>
      <DataSelect
        dict="job"
        style='width:200px'
        :disabled="false"
        placeholder="字典数据"
        @on-change="onSelectChange1"
        clearable
        v-model='val2'/>
    </row>
  </div>
</template>
<script>
  import {DataSelect} from 'components/';

  export default {
    data () {
      return {
        val1: null,
        param1: {},
        param2: {name: '超级'}
      };
    },
    computed: {},
    methods: {
      onSelectChange1 (value) {
        console.log(value);
        this.$Message.success(value.label);
      }
    },
    mounted () {

    },
    components: {DataSelect}
  };
</script>
