<style scoped>
</style>
<style>
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
  }

  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0 0;
  }

  .ql-editor {
    min-height: 300px;
    max-height: 520px;
  }
</style>

<template>
  <quillEditor ref='quillEditor' v-model='content' :options='editorOption'>
  </quillEditor>
</template>

<script>
  import {quillEditor, Quill} from 'vue-quill-editor';
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  Quill.register('modules/ImageExtend', ImageExtend);

  const editorOption = {
    placeholder: '请输入',
    modules: {
      ImageExtend: {
        loading: true,
        name: 'file',
        action: HOST + '/sys/attach/uploadImg',
        response: (res) => {
          if (res.success) {
            return res.data.path;
          }
        },
        headers: (h) => {
          h.setRequestHeader('Authorization', OperatorUtils.getToken());
        }
      },
      toolbar: {
        container: container,
        handlers: {
          'image': function () {
            QuillWatch.emit(this.quill.id);
          }
        }
      }
    }
  };

  export default {
    props: {
      value: {},
      placeholder: {
        default: '请输入',
        type: String
      },
      minHeight: {
        default: 200
      },
      placeholderLabel: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        editorOption,
        content: ''
      };
    },
    computed: {},
    created () {
      editorOption.placeholder = this.placeholder;
    },
    mounted () {
    },
    methods: {},
    watch: {
      value (newVal, oldVal) {
        this.content = newVal;
      },
      content (newVal, oldVal) {
        this.$emit('input', newVal);
      }
    },
    components: {quillEditor}
  };
</script>
