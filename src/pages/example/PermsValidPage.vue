<style scoped>

</style>

<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row>
      <PermsValid perms-name='user:create'>

        <Button shape='circle' type='ghost' @click=''> user:create添加权限</Button>
      </PermsValid>

      <PermsValid perms-name='user:update'>

        <Button shape='circle' type='ghost' @click=''>user:update更新权限</Button>
      </PermsValid>

      <PermsValid perms-name='user:delete'>

        <Button shape='circle' type='ghost' @click=''>user:delete删除权限</Button>
      </PermsValid>

      <PermsValid perms-name='user:list'>
        user:list 查询权限
      </PermsValid>
    </row>
    <row>
      <br>
      <h3>当前权限列表：</h3>{{PermsList}}
    </row>
    <row>
      <h3>当前角色：</h3>{{roleName}}
    </row>

    <row style="padding-top: 100px">
      <Alert show-icon>
        超级管理员账号 admin 密码123456
        <br>游客账号 guest 密码123456
        <br>您可以切换账号试试！
      </Alert>
    </row>
  </div>

</template>
<script>
  import {PermsValid} from 'components/';

  export default {
    data() {
      return {
        PermsList: OperatorUtils.getPermsData(),
        roleName: OperatorUtils.getUserData().roleName
      }
    },
    computed: {},
    methods: {},
    mounted() {
    },
    components: {PermsValid}
  }
</script>
