<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row>
      <i-col span="24">
        <FormDynamic ref="dynamic1" v-model="fromData" :data="dynamic1" :label-width="120">
        </FormDynamic>
      </i-col>
    </row>


    <PopupEdit ref="popupEdit"
               :width="1000"
               :dynamic="dynamic1"
               @on-success="editSuccess"
               :label-width="120">
    </PopupEdit>
    <PopupSelect ref="popSelect" :content="userPage"></PopupSelect>
  </div>
</template>

<script>
  import {FormDynamic, PopupEdit, PopupSelect} from 'components/';

  let self = null;

  const dynamic1 = [
    [
      {type: 'title', span: 24, text: 'title'}
    ],
    [
      {
        name: 'numberData',
        type: 'number',
        span: 8,
        label: 'number'
      },
      {
        name: 'textData',
        type: 'text',
        span: 8,
        label: 'text',
        value: 'DefaultValue',
        rules: {required: true, type: 'string'}
      }
    ], [
      {type: 'title', span: 24, text: 'date'}
    ], [
      {name: 'date1', type: 'date', span: 6, label: 'DateLabel'},
      {name: 'date2', type: 'datetime', span: 6, label: 'DateTimeLabel'},
      {name: 'date3', type: 'datetimerange', span: 6, label: 'DatetimerangeLabel'}
    ], [
      {type: 'title', span: 24, text: 'Title'}
    ], [
      {name: 'imgData', max: 10, type: 'imgUpload', span: 24, label: '设备图片'},
      {
        name: 'selectData',
        type: 'select',
        span: 8,
        value: 0,
        label: 'SelectLabel',
        data: [
          {label: '选项1', value: 0}, {label: '选项2', value: 1},
          {label: '选项3', value: 2}, {label: '选项4', value: 3},
        ],
        onChange: (val, from, data) => {
          alert('onChange');
        }
      },
      {
        name: 'radioData',
        type: 'radio',
        span: 8,
        value: 0,
        label: 'RadioLabel',
        data: [
          {label: '选项1', value: 0}, {label: '选项2', value: 1},
          {label: '选项3', value: 2}, {label: '选项4', value: 3},
        ],
        onChange: (val, from, data) => {
          alert('onChange');
        }
      },
      {
        name: 'checkboxData',
        type: 'checkbox',
        span: 8,
        label: 'CheckboxLabel',
        data: [
          {label: '选项1', value: 0}, {label: '选项2', value: 1},
          {label: '选项3', value: 2}, {label: '选项4', value: 3}
        ],
        enableCheckAll: true,
        checkAllLabel: '全选',
        checkAll: true,
        onChange: (val, from, data) => {
          alert('onChange');
        }
      },
      {
        name: 'deviceTypeId',
        type: 'treeSelect',
        span: 8,
        label: 'TreeSelectLabel',
        // 如果是CrudView 支持从左边树绑定数据，select组件同样支持
        dataFromTree: true,
        textField: 'name',
        valField: 'id',
        onChange: (val, from, data) => {
          alert('onChange');
        }
      },
      {
        name: 'popSelectId',
        span: 8,
        label: 'PopupSelectLabel',
        type: 'popText',
        textField: 'popSelectName',
        onClick (fromData) {
          self.$refs['popSelect'].open((selection) => {
            console.log(selection[0].id);
            self.$set(fromData, 'popSelectId', selection[0].id);
            self.$set(fromData, 'popSelectName', selection[0].username);
          })
        }
      }
    ], [
      {name: 'textarea', type: 'text', span: 24, label: 'TextareaLabel', textarea: {minRows: 3, maxRows: 8}}
    ], [
      {
        name: 'Button', type: 'buttons', span: 24,
        data: [
          {
            label: 'GetFormData',
            onClick () {
              self.$refs.dynamic1.submit((param) => {
                console.log(param);
                alert(JSON.stringify(param))
              }, (res) => {
                // 表单验证失败
              });
            }
          },
          {
            label: 'PopupWindow',
            onClick () {
              self.$refs.popupEdit.open({
                title: 'PopupEditWindow',
                postUrl: null
              }, self.fromData);
            }
          },
          {
            label: 'GotoEditPage',
            onClick () {
              self.editOptions.editSuccess = self.editSuccess;
              let action = {
                title: 'title',
                postUrl: ''
              }
              self.$router.push({
                path: self.$router.currentRoute.path + '/edit',
                query: {options: self.editOptions, action: action, data: self.fromData}
              })
            }
          }
        ]
      }
    ]
  ];

  /**
   * 弹出式表单参数
   */
  const editOptions = {
    width: 1200,
    labelWidth: 120,
    dynamic: dynamic1
  };

  export default {
    data () {
      return {
        editOptions,
        dynamic1,
        fromData: {}
      }
    },
    computed: {
      userPage () {
        return import('pages/sys/user');
      }
    },
    methods: {
      editSuccess (res) {
        console.log(res);
      }
    },
    mounted () {
      self = this;
    },
    components: {
      FormDynamic, PopupEdit, PopupSelect
    }
  }
</script>

<style scoped>

</style>
