<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-tickets",
          index: "user",
          title: "设计师管理"
        },
         {
          icon: "el-icon-tickets",
          index: "firstparty",
          title: "甲方管理"
        },
        // {
        //   icon: "el-icon-tickets",
        //   index: "pm",
        //   title: "项目经理管理"
        // },
        {
          icon: "el-icon-tickets",
          index: "admin",
          title: "管理员管理"
        },
        {
          icon: "el-icon-tickets",
          index: "classify",
          title: "分类管理"
        },
        {
          icon: "el-icon-tickets",
          index: "question",
          title: "问题管理"
        },
        {
          icon: "el-icon-tickets",
          index: "reward",
          title: "赏金管理"
        },
        {
          icon: "el-icon-tickets",
          index: "1",
          title: "个性管理",
          subs:[
            {
                index: 'nickname',
                title: '昵称管理'
            },
            {
                index: 'avatar',
                title: '头像管理'
            },
          ]
        },
         {
          icon: "el-icon-tickets",
          index: "tag",
          title: "标签管理"
        },
         {
          icon: "el-icon-tickets",
          index: "capital",
          title: "资金管理"
        },
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  },
  mounted() {
    // 判断窗口宽度来折叠菜单栏
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        if (window.screenWidth < 1500) {
          this.collapse = true;
          bus.$emit("collapse", this.collapse);
        } else {
          this.collapse = false;
          bus.$emit("collapse", this.collapse);
        }
      })();
    };
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 90px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.el-menu-item,
.el-submenu__title {
  line-height: 55px;
  height: 55px;
}
.el-menu-item span,.el-submenu__title span {
  margin-left: 5px;
}
.is-active {
  background-color: #056ad2 !important;
  color: #ffffff !important;
}
.el-menu--inline .el-menu-item[data-v-085de0bb]{
  padding-left: 70px !important;
}
</style>
