<style>
  .upload-list {
    display: inline-block;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 50px;
    height: 50px;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
    width: 50px;
    height: 50px;
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload-list-img {

  }

  .upload-list-img .img {
    max-width: 200px;
    max-height: 200px;

  }
</style>
<template>
  <div>
    <div class="upload-list" v-for="(item,index) in uploadList">
      <Poptip placement="top-start" width="360" trigger="hover">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="upload-list-cover">
            <Poptip confirm title="您确认删除？" @on-ok="handleRemove(item)" placement="right-start" transfer>
              <Icon type="ios-trash-outline"></Icon>
            </Poptip>
            <Icon type="ios-eye-outline" @click.native="showPhotoViewer(item,index)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
        <div class="upload-list-img" slot="content">
          <img @click="showPhotoViewer(item,index)" :src="item.url">
        </div>
      </Poptip>
    </div>

    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      with-credentials
      type="drag"
      :headers="postHeaders"
      :action="uploadUrl"
      style="display: inline-block;width:48px;">
      <div style="width: 48px;height:48px;line-height: 58px;">
        <Icon type="camera" size="24"></Icon>
      </div>
    </Upload>
    <PhotoViewer :picIds="value" :curIndex="curIndex" v-model="photoViewerVisible"></PhotoViewer>
  </div>

</template>
<script>
  import {PhotoViewer} from 'components/';
  import utils from '@/utils/common';

  export default {
    props: {
      value: {},
      max: {
        default: 1
      },
      maxSize: {
        default: 2048
      }
    },
    data () {
      return {
        defaultList: [],
        imgName: '',
        uploadUrl: HOST + '/sys/attach/uploadImg',
        visible: false,
        uploadList: [],
        imagesValue: [],
        photoViewerImg: null,
        photoViewerVisible: false,
        curIndex: 0,
        postHeaders: {}
      };
    },
    methods: {
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      showPhotoViewer (item, index) {
        this.curIndex = index;
        this.photoViewerImg = item;
        this.photoViewerVisible = true;
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
        this.imagesValue.splice(this.imagesValue.indexOf(file.url), 1);
        this.$emit('input', this.imagesValue.toString());
      },
      handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        this.imagesValue.push(res.data.path);
        file.url = this.imagesValue;
        file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        this.$emit('input', this.imagesValue.toString());
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      },
      handleBeforeUpload () {
        this.postHeaders.Authorization = OperatorUtils.getToken();
        const check = this.uploadList.length < this.max;
        if (!check) {
          this.$Message.warning('最多只能上传 ' + this.max + ' 张图片。');
        }
        return check;
      }
    },
    watch: {
      value (newVal, oldVal) {
        if (newVal != null) {
          this.imagesValue = [];
          this.uploadList = [];
          let arr = newVal.toString().split(','); //字符分割
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].length > 0) {
              this.imagesValue.push(arr[i]);
              let file = {status: 'finished', id: i, name: i, url: arr[i]};
              this.uploadList.push(file);
            }
          }
        } else {
          this.imagesValue = [];
          this.uploadList = [];
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    components: {PhotoViewer}
  };
</script>

