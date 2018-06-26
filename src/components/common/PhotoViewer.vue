<style scoped>
  .photo-viewer {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: #333;
    z-index: 1101;
    left: 0;
    top: 0;
  }

  .size {
    position: absolute;
    width: 80px;
    font-size: 14px;
    line-height: 35px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 20px;
    color: white;
    visibility: hidden;
    opacity: 0;
    user-select: none;
  }

  .photo-viewer-close {
    position: fixed;
    right: 0px;
    top: 0px;
    text-align: center;
    padding-top: 5px;
    font-size: 28px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 0px 0px 0px 30px;
    width: 45px;
    height: 45px;
    cursor: pointer;
  }

  .photo-viewer-close:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .photo-viewer-img {
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh
  }

  .photo-viewer-img img {
    transform: translate3d(0px, 0px, 0px) scale(1);
    position: absolute;
    cursor: -webkit-grab;
    user-select: none;
  }

  .show-size {
    opacity: 1;
    visibility: visible;
  }

  .chevron {
    position: absolute;
    top: 50%;
    font-size: 36px;
    margin: 20px;
    cursor: pointer;
  }

</style>


<template>
  <Row class="photo-viewer" v-if="opened" v-show="mVisible">
    <i-col span="24">
      <div class="photo-viewer-img vertical-center-modal">
        <img v-if="nowImg" ref="showImg" @mousedown="startMove" @touchstart="startMove" @load="onImgload "
             :src="nowImg.url"/>
        <span class="size" :class="{'show-size': showSize}">{{(this.size * 100).toFixed(0) + '%'}}</span>
      </div>
      <Icon class="chevron" @click.native="leftClick" v-show="imgs && index-1>=0" type="chevron-left"
            style="left: 0;"></Icon>
      <Icon class="chevron" @click.native="rightClick" v-show="imgs && index+1<imgs.length" type="chevron-right"
            style="right: 0;"></Icon>
    </i-col>
    <div class="photo-viewer-close" @click="close">
      <Icon type="close-round"></Icon>
    </div>
  </Row>
</template>

<script>
  export default {
    props: {
      value: {
        default: false
      },
      moveEnable: {
        default: false
      },
      picIds: {},
      imgList: {},
      curIndex: {
        default: 0
      }
    },
    data () {
      return {
        opacity: 0,
        left: 0,
        top: 0,
        x: 0,
        y: 0,
        size: 1,
        showSize: false,
        imgs: [],
        index: 0,
        nowImg: null,
        mVisible: false,
        opened: false,
        reallyWidth: 0,
        reallyHeight: 0
      };
    },
    methods: {
      onImgload () {
        this.resize();
      },
      rightClick () {
        this.nowImg = this.imgs[++this.index];
        this.resize();
      },
      leftClick () {
        this.nowImg = this.imgs[--this.index];
        this.resize();
      },
      close () {
        this.mVisible = false;
        this.index = 0;
        this.$emit('input', this.mVisible);
      },
      // 图片拖动
      startMove (event) {
        if (!this.moveEnable) {
          return;
        }
        window.addEventListener('mousemove', this.move);
        window.addEventListener('touchmove', this.move);
        window.addEventListener('mouseup', this.leave);
        window.addEventListener('touchend', this.leave);
        var old = window.getComputedStyle(this.$refs['showImg']);
        var x = old.left.replace('px', '');
        var y = old.top.replace('px', '');
        this.x = event.clientX ? event.clientX : event.touches[0].clientX;
        this.x += ~(x);
        this.y = event.clientY ? event.clientY : event.touches[0].clientY;
        this.y += ~(y);
      },
      // 移动函数
      move (event) {
        event.preventDefault();
        var nowX = event.clientX ? event.clientX : event.touches[0].clientX;
        var nowY = event.clientY ? event.clientY : event.touches[0].clientY;
        this.$refs['showImg'].style.left = ~~(nowX) - ~~(this.x) + 'px';
        this.$refs['showImg'].style.top = nowY - this.y + 'px';
      },
      leave () {
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('touchmove', this.move);
        window.removeEventListener('mouseup', this.leave);
        window.removeEventListener('touchend', this.leave);
      },
      resize () {
        this.left = 0;
        this.top = 0;
        this.x = 0;
        this.y = 0;
        this.size = 1;
        this.$nextTick(() => {
          this.$refs['showImg'].style.left = 'auto';
          this.$refs['showImg'].style.top = 'auto';
          this.$refs['showImg'].style.height = 'auto';
          this.$refs['showImg'].style.width = 'auto';
          this.reallyHeight = window.getComputedStyle(this.$refs['showImg']).height.replace('px', '');
          this.reallyWidth = window.getComputedStyle(this.$refs['showImg']).width.replace('px', '');
          this.$refs['showImg'].style.width = this.reallyWidth * this.size + 'px';
          this.$refs['showImg'].style.height = this.reallyHeight * this.size + 'px';
        });
      },
      changeSize (event) {
        this.showSize = true;
        var change = event.deltaY;
        if (change < 0) {
          if (this.size > 0.9 && this.size < 1) {
            var num = 1 - this.size;
            this.size = 1;
          } else {
            this.size += 0.06;
          }
        } else {
          if (this.size > 0.12) {
            this.size -= 0.06;
          }
        }
        this.$nextTick(() => {
          this.$refs['showImg'].style.width = this.reallyWidth * this.size + 'px';
          this.$refs['showImg'].style.height = this.reallyHeight * this.size + 'px';
        });
        event.preventDefault();
      }
    },
    created () {
    },
    mounted () {
    },
    watch: {
      value (newVal, oldVal) {
        this.mVisible = newVal;
        if (newVal) {
          if (!this.opened) {
            this.opened = true;
          }
          this.nowImg = this.imgs[this.index];
          window.addEventListener('mousewheel', this.changeSize);
        } else {
          window.removeEventListener('mousewheel', this.changeSize);
        }
      },
      picIds (newVal, oldVal) {
        this.nowImg = null;
        let imgs = [];
        if (newVal != null && newVal.length > 0) {
          let arr = newVal.toString().split(','); //字符分割
          for (let i = 0; i < arr.length; i++) {
            let url = arr[i];
            imgs.push({url: url});
          }
        }
        this.imgs = imgs;
        this.nowImg = this.imgs[this.index];
      },
      imgList (newVal, oldVal) {
        if (Object.prototype.toString.call(newVal) === '[object Array]') {
          this.imgs = newVal;
          this.nowImg = this.imgs;
        } else {
          this.imgs = [];
          this.imgs.push(newVal);
        }
        this.nowImg = this.imgs[this.index];
      },
      showSize () {
        if (this.showSize) {
          clearInterval(this.setSize);
          this.setSize = setTimeout(() => {
            this.showSize = false;
          }, 1500);
        }
      },
      curIndex (newVal, oldVal) {
        this.nowImg = null;
        this.index = newVal;
        this.nowImg = this.imgs[this.index];
      }
    },
    components: {}
  };
</script>
