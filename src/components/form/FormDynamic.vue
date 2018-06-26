<style scoped>
  .title {
    padding: 0px 5px 3px 10px;
    font-size: 14px;
    border-bottom: #e0e0e0 1px solid;
    width: 100%;
    margin-bottom: 15px;
  }
</style>

<style>
  .no-label .ivu-form-item-content {
    margin-left: 30px !important;
  }
</style>

<template>
  <i-form ref="fromData" :model="fromData" :label-width="this.labelWidth" :label-position="this.labelPosition">
    <Row v-for="(rowItem, rowIndex) in data" :key="'rowItem'+rowIndex">
      <i-col v-for="(item, index) in rowItem" :span="item.span" :key="'col'+index"
             :class="{'no-label': item.noLabel}" :style="colStyle">
        <template v-if="item.type==='title'">
          <div class="title">
            {{item.text}}
          </div>
        </template>
        <template v-else>
          <FormItem :key="'formItem'+index"
                    :label="placeholderLabel?'':item.label"
                    v-show="!item.hidden"
                    :rules="item.rules==null?null:item.rules"
                    :prop="item.name">

            <!--输入框-->
            <template v-if="item.type==='text'">
              <i-input
                :type="getInputType(item)"
                v-model="fromData[item.name]"
                :placeholder="getPlaceholder(item)"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :icon="item.icon"
                @on-click="(val) =>{ if( item.onClick!==null){item.onClick(fromData,mData)}}"
                :autosize="item.textarea">
              </i-input>
            </template>
            <!--数字输入框-->
            <template v-else-if="item.type==='number'">
              <input-number
                style="width:100%"
                v-model="fromData[item.name]"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :icon="item.icon"
                :placeholder="getPlaceholder(item)"
                :max="item.max"
                :min="item.min"
                :editable="item.editable"
                :step="item.step||1"
                :precision="item.precision||0"
                @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}"
                :autosize="item.textarea">
              </input-number>
            </template>
            <!--选择框-->
            <template v-else-if="item.type==='popText'">
              <i-input
                type="text"
                v-model="fromData[item.textField]"
                :placeholder="getPlaceholder(item)"
                :disabled="item.disabled"
                :readonly="item.readonly == undefined ? true : item.readonly"
                icon="ios-search"
                @on-click="(val) =>{ if( item.onClick!==null){item.onClick(fromData,mData)}}"
                :autosize="item.textarea">
              </i-input>
            </template>
            <!--选择框-->
            <template v-else-if="item.type==='select'">
              <DataSelect v-model="fromData[item.name]"
                          :data="item.data"
                          :dict="item.dict"
                          :param="item.param"
                          :disabled="item.disabled"
                          :dataUrl="item.dataUrl"
                          :valField="item.valField"
                          :textField="item.textField"
                          :placeholder="getPlaceholder(item)"
                          @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}"
                          :multiple="item.multiple">
              </DataSelect>
            </template>
            <!--时间选择器-->
            <template v-else-if="item.type==='time'">
              <TimePicker
                transfer
                type="time"
                :disabled="item.disabled"
                :placeholder="getPlaceholder(item)"
                v-model="fromData[item.name]">
              </TimePicker>
            </template>
            <!--日期选择器-->
            <template v-else-if="item.type==='year'">
              <DatePicker
                transfer
                style="width:100%"
                type="year"
                format="yyyy"
                :disabled="item.disabled"
                :placeholder="getPlaceholder(item)"
                v-model="fromData[item.name]">
              </DatePicker>
            </template>
            <!--日期选择器-->
            <template v-else-if="item.type==='date'">
              <DatePicker
                transfer
                style="width:100%"
                type="date"
                :disabled="item.disabled"
                :placeholder="getPlaceholder(item)"
                v-model="fromData[item.name]">
              </DatePicker>
            </template>
            <!--日期选择器 yyyy-MM-dd HH:mm:ss-->
            <template v-else-if="item.type==='datetime'">
              <DatePicker
                transfer
                style="width:100%"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="item.disabled"
                :placeholder="getPlaceholder(item)"
                v-model="fromData[item.name]">
              </DatePicker>
            </template>
            <!--日期选择器 yyyy-MM-dd HH:mm:ss-->
            <template v-else-if="item.type==='datetimerange'">
              <DatePicker
                transfer
                style="width:100%"
                type="datetimerange"
                :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :disabled="item.disabled"
                :placeholder="getPlaceholder(item)"
                v-model="fromData[item.name]">
              </DatePicker>
            </template>
            <!--多选框-->
            <template v-else-if="item.type==='checkbox'">
              <Checkbox v-if="item.enableCheckAll"
                        :value="mData[item.name].checkAll"
                        @click.prevent.native="handleCheckAll(item)">{{item.checkAllLabel}}
              </Checkbox>
              <CheckboxGroup v-model="fromData[item.name]" @on-change="checkGroupChange($event,item)">
                <Checkbox v-for="(option, optionIndex) in item.data "
                          :label="option.value"
                          transfer
                          :key="'checkbox'+index+'_'+optionIndex">
                  {{option.label}}
                </Checkbox>
              </CheckboxGroup>
            </template>
            <!--开关选项-->
            <template v-else-if="item.type==='switch'">
              <i-switch v-model="fromData[item.name]"
                        size="large"
                        :key="'switch'+index"
                        :disabled="item.disabled"
                        :trueValue="item.trueValue"
                        @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}"
                        :falseValue="item.falseValue">
                <span slot="open">{{item.openText}}</span>
                <span slot="close">{{item.closeText}}</span>
              </i-switch>
            </template>
            <!--单选框-->
            <template v-else-if="item.type==='radio'">
              <RadioGroup v-model="fromData[item.name]"
                          :type="item.button?'button':null"
                          @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}">
                <Radio v-for="(option, optionIndex) in item.data"
                       :key="'radio'+index+'_'+optionIndex"
                       :label="option.value==null?optionIndex:option.value">
                  {{option.label}}
                </Radio>
              </RadioGroup>
            </template>
            <!--选择树-->
            <template v-else-if="item.type==='treeSelect'">
              <TreeSelect v-model="fromData[item.name]"
                          :data="item.data"
                          :disabled="item.disabled"
                          :param="item.param"
                          :valField="item.valField"
                          :textField="item.textField"
                          :lastStep="item.lastStep"
                          :constructTree="item.constructTree"
                          :dataUrl="item.dataUrl"
                          @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,data,fromData,mData)}}">
              </TreeSelect>
            </template>
            <!--图片上传-->
            <template v-else-if="item.type==='imgUpload'">
              <ImgUpload v-model="fromData[item.name]"
                         :data="item.data"
                         :param="item.param"
                         :max="item.max"
                         :disabled="item.disabled"
                         :dataUrl="item.dataUrl">
              </ImgUpload>
            </template>

            <!--标签-->
            <template v-else-if="item.type==='label'">
              <span>{{item.data}}</span>
            </template>

            <!--按钮组-->
            <template v-else-if="item.type==='buttons'">
              <Button style="margin-left: 5px" v-for="(option, optionIndex) in item.data"
                      :key="'button'+index+'_'+optionIndex"
                      :type="option.btnType" :shape="option.shape"
                      :icon="option.icon"
                      :size="item.size"
                      @click="option.onClick(fromData)">{{option.label}}
              </Button>
            </template>

            <!--富文本-->
            <template v-else-if="item.type==='editor'">
              <FormEditor v-model="fromData[item.name]" :placeholder="getPlaceholder(item)"></FormEditor>
            </template>


            <template v-else>
              {{item.type}}未匹配到对应的组件
            </template>
          </FormItem>
        </template>
      </i-col>

      <slot v-if="rowIndex==data.length-1" name="append">

      </slot>

    </Row>

  </i-form>
</template>

<script>
  import {TreeSelect, DataSelect, ImgUpload, FormEditor} from 'components/';

  export default {
    props: {
      data: {},
      labelWidth: {
        default: 1
      },
      labelPosition: {
        default: 'right'
      },
      placeholderLabel: {
        default: false,
        type: Boolean
      },
      colHeight: {},
      paddingRight: {}
    },
    data () {
      return {
        keys: null,
        fromData: {},
        mData: {}
      };
    },
    computed: {
      colStyle () {
        return {
          height: this.colHeight + 'px',
          paddingRight: this.paddingRight + 'px'
        };
      }
    },
    created () {
      this.initForm(this.data);
      this.reset();
    },
    mounted () {
    },
    methods: {
      getInputType (item) {
        return item.textarea == null ? item.password === true ? 'password' : 'text' : 'textarea';
      },
      initForm (data) {
        for (let i in data) {
          for (let j in data[i]) {
            let obj = data[i][j];
            if (obj.rules != null) {
              if (obj.rules.message == null) {
                obj.rules.message = obj.label + '不能为空';
              }
              if (obj.rules.trigger == null) {
                obj.rules.trigger = 'blur';
              }
            }
            if (obj.name != null && obj.name.length > 0) {
              this.mData[obj.name] = obj;
            }
          }
        }
      },
      getPlaceholder (item) {
        if (this.placeholderLabel) {
          return item.label;
        }
        let result;
        if (item.placeholder == null) {
          switch (item.type) {
            case 'text':
              result = item.disabled || item.readonly ? '' : '请输入...';
              break;
            case 'popText':
              result = item.disabled || item.readonly ? '' : '请选择...';
              break;
            case 'time':
              result = item.disabled || item.readonly ? '' : '选择时间';
              break;
            case 'datetime': case 'date':
              result = item.disabled || item.readonly ? '' : '选择日期';
              break;
            case 'datetimerange':
              result = item.disabled || item.readonly ? '' : '选择时间段';
              break;
            case 'year':
              result = item.disabled || item.readonly ? '' : '选择年份';
              break;
            default:
              result = '';
              break;
          }
        } else {
          result = item.placeholder;
        }
        return result;
      },
      checkAll (data, name) {
        let checkArr = [];
        for (let i = 0; i < data.length; i++) {
          checkArr.push(data[i].value);
        }
        this.$set(this.fromData, name, checkArr);
        this.$set(this.mData[name], 'checkAll', true);
      },
      handleCheckAll (item) {
        let checkAll = this.mData[item.name].checkAll;
        if (checkAll) {
          this.$set(this.fromData, item.name, []);
          this.$set(this.mData[item.name], 'checkAll', false);
        } else {
          let data = this.mData[item.name].data;
          this.checkAll(data, item.name);
        }
        item.onChange(item, this.mData, this.fromData);
      },
      checkGroupChange (event, item) {
        let selected = event.length;
        let orign = this.mData[item.name].data.length;
        if (selected === orign) {
          this.$set(this.mData[item.name], 'checkAll', true);
        } else {
          this.$set(this.mData[item.name], 'checkAll', false);
        }
        if (item.onChange) {
          item.onChange(item, this.mData, this.fromData);
        }

      },
      /**
       * 重置
       */
      reset () {
        this.keys = [];
        // 设置初始默认值
        for (var name in this.mData) {
          if (this.mData[name].value != null) {
            let val = this.mData[name].value;
            this.$set(this.fromData, name, val);
          } else {
            if (this.mData[name].type === 'number') {
              this.$set(this.fromData, name, this.mData[name].min || 0);
            } else if (this.mData[name].type === 'checkbox' && this.mData[name].enableCheckAll === true) {
              this.checkAll(this.mData[name].data, name);
            } else if (this.mData[name].type === 'popText') {
              this.$set(this.fromData, this.mData[name].textField, null);
              this.keys.push(this.mData[name].textField);
              this.$set(this.fromData, name, null);
            } else {
              this.$set(this.fromData, name, null);
            }
          }
          this.keys.push(name);
        }
      },
      /**
       * 验证表单
       * @param success
       * @param error
       */
      submit (success, error) {
        this.$refs.fromData.validate((valid) => {
          let data = this.fromData;
          if (valid) {
            for (var name in this.mData) {
              let obj = this.mData[name];
              if (obj != null && data[name] != null) {
                if (data[name] instanceof Date) {
                  if (obj.type == 'date') {
                    let format = obj.format || 'yyyy-MM-dd';
                    data[name] = data[name].Format(format);
                  } else if (obj.type == 'datetime') {
                    let format = obj.format || 'yyyy-MM-dd hh:mm:ss';
                    data[name] = data[name].Format(format);
                  } else if (obj.type == 'year') {
                    let format = obj.format || 'yyyy';
                    data[name] = data[name].Format(format);
                  }
                }
                if (obj.type == 'datetimerange') {
                  if (data[name].length == 2 && data[name][0] instanceof Date && data[name][1] instanceof Date) {
                    let format = obj.format || 'yyyy-MM-dd hh:mm:ss';
                    let arr = [];
                    arr.push(data[name][0].Format(format));
                    arr.push(data[name][1].Format(format));
                    data[name] = arr;
                  }
                }
              }
              if (obj != null && data[name] != null && obj.type === 'checkbox' && obj.toJson) {
                // data[name] = JSON.stringify(data[name]);
              }
            }
            success(data);
          } else {
            this.$Message.error('请填写正确再提交!');
            if (error != null) {
              error(data);
            }
          }
        });
      },
      getData () {
        return this.fromData;
      },
      /**
       * 设置表单数据
       * @param fromData
       */
      setFormData (fromData) {
        this.reset();
        // 设置表单传进来的值
        for (let name in fromData) {
          let val = fromData[name];
          if (this.mData[name] != null) {
            if (this.mData[name].type == 'date') {
              val = new Date(val);
            } else if (this.mData[name].type == 'checkbox') {
              if (val.length != this.mData[name].data.length) {
                this.mData[name].checkAll = false;
              }
            } else if (this.mData[name].type == 'year') {
              let d = new Date();
              d.setFullYear(val);
              val = d;
            }
          }
          if (this.keys.contains(name)) {
            this.$set(this.fromData, name, val);
          }
        }
      }
    },
    watch: {
      data (newVal, oldVal) {
        this.initForm(newVal);
      }
    },
    components: {TreeSelect, DataSelect, ImgUpload, FormEditor}
  };
</script>
