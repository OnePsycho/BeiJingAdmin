<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  分类管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="custom-tree-container">
			<div class="block">
				<p class="tree-title">人才分类<span class="addBtn" @click="addPerson">添加</span></p>
				<div class="personBox">
				<el-tabs v-model="activePerson" type="card" @tab-click="handleClick" style="margin-top:20px">
					<el-tab-pane label="方案" name="scheme"></el-tab-pane>
					<el-tab-pane label="施工图" name="workingDrawing"></el-tab-pane>
				</el-tabs>
				</div>
				<el-tree :data="data1" :props="personnelProps" show-checkbox node-key="id" :highlight-current="true"	:expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.name }}</span>
				<span style="margin-left:50px">
					<el-button type="text" size="mini" icon="el-icon-plus" @click="() => append(data)"></el-button>
					<el-button type="text"	size="mini"	icon="el-icon-minus" @click="() => remove(node, data)"></el-button>
					<el-button type="text" size="mini" icon="el-icon-edit-outline" @click="modifyPersonnelType(data)"></el-button>
				</span>
				</span>
				</el-tree>
			</div>
			<div class="block">
				<p class="tree-title">问题分类<span class="addBtn" @click="addPlatform">添加</span></p>
				<div class="personBox">
					<el-tabs v-model="activePlatform" type="card" @tab-click="handleClickPlatform" style="margin-top:20px">
					<el-tab-pane label="方案" name="scheme"></el-tab-pane>
					<el-tab-pane label="施工图" name="workingDrawing"></el-tab-pane>
				</el-tabs>
				</div>
				<el-tree :data="data3"	:props="platformProps"	show-checkbox	node-key="id"	:highlight-current="true"	:expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ data.name }}</span>
					<span style="margin-left:50px">
					<el-button	type="text"	size="mini"	icon="el-icon-plus"	@click="() => appendPlatform(data)"></el-button>
					<el-button	type="text"	size="mini"	icon="el-icon-minus"	@click="() => removePlatform(node, data)"></el-button>
					<el-button	type="text"	size="mini"	icon="el-icon-edit-outline"	@click="modifyPlatformType(data)"></el-button>
					</span>
				</span>
				</el-tree>
			</div>
			</div>
		</div>
		
		<!-- 添加分类弹出框 -->
		<el-dialog title="添加一级分类" :visible.sync="addVisible" width="620px">
			<el-form ref="formAdd" :model="formAdd" label-width="100px" :rules="rules">
				<el-form-item label="分类名称" prop="name" width="200px">
					<el-input v-model="formAdd.name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="formAdd.type">
					<el-option key="1" label="方案" value="scheme"></el-option>
					<el-option key="2" label="施工图" value="workingDrawing"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd('formAdd')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      data1: [],
      data3: [],
      activePerson: "scheme",
      activePlatform: "scheme",
      personnelProps: {
        label: "name",
        children: "personnelTypes"
      },
      platformProps: {
        label: "name",
        children: "platformTypes"
      },
      url: "",
      tableData: [],
      activeName: 1,
      apiUrl: domain.apiUrl,
      addVisible: false,
      modifyVisible: false,
      delVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      form: {},
      formAdd: {},
      idx: -1,
      loading: true,
      totalNum: 0,
      pageSize: 10,
      currentId: 0,
      deleteIdArr: [],
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }],
        type: [{ required: true, message: "类型不能为空", trigger: "change" }]
      },
      addType: ""
    };
  },
  created() {
    this.getData();
  },
  components: {
    // quillEditor
  },
  watch: {
    //监听路由变化
    $route(to) {
      if (to.path == "/classify") {
        this.getData(); //当前页面展示即刷新数据
      }
    }
  },
  computed: {
    // 筛选部分
    data() {
      return this.tableData;
    }
  },
  methods: {
    handleClick(tab, event) {
      this.data1 = [];
      this.url = this.apiUrl + "/client/api/personnelType/findPage";
      this.$axios.get(this.url).then(res => {
        console.log(res);
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].type == tab.name) {
            this.data1.push(res.data.content[i]);
          }
        }
      });
    },
    handleClickPlatform(tab, event) {
      this.data3 = [];
      this.url = this.apiUrl + "/client/api/platformType/findPage";
      this.$axios.get(this.url).then(res => {
        console.log(res);
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].type == tab.name) {
            this.data3.push(res.data.content[i]);
          }
        }
      });
    },
    //添加分类
    append(data) {
      console.log(data);
      let pId = data.id; //父级ID
      let pType = data.type; //父级类型
      this.$prompt("请输入分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.$axios
          .post(
            this.apiUrl +
              "/client/api/personnelType/add?name=" +
              value +
              "&pid=" +
              pId +
              "&type="+
              pType
          )
          .then(res => {
            const newChild = {
              id: res.data.id,
              name: res.data.name,
              type:res.data.type,
              personnelTypes: []
            };
            if (!data.personnelTypes) {
              this.$set(data, "personnelTypes", []);
            }
            data.personnelTypes.push(newChild);
            this.$message.success("添加成功!");
          });
      });
    },
    //移除分类
    remove(node, data) {
      console.log(node, data);
      const parent = node.parent;
      const children = parent.data.personnelTypes || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      let f = new FormData();
      f.append("id", data.id);
      f.append("_method", "delete");
      this.$axios
        .post(this.apiUrl + "/client/api/personnelType/deleteById", f)
        .then(res => {
          children.splice(index, 1);
          this.$message.success("删除成功！");
        });
    },
    //修改分类名称
    modifyPersonnelType(data) {
      console.log(data);
      this.$prompt("请输入修改后的分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let f = new FormData();
        f.append("id", data.id);
        f.append("_method", "PUT");
        f.append("name", value);
        this.$axios
          .post(this.apiUrl + "/client/api/personnelType/update", f)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("修改成功!");
              data.name = value;
            } else {
              this.$message.error("修改失败!");
            }
          });
      });
    },
    //添加问题分类
    appendPlatform(data) {
      console.log(data);
      let pId = data.id; //父级ID
      let pType = data.type; //父级类型
      this.$prompt("请输入分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.$axios
          .post(
            this.apiUrl +
              "/client/api/platformType/add?name=" +
              value +
              "&pid=" +
              pId +
              "&type="+
              pType
          )
          .then(res => {
            const newChild = {
              id: res.data.id,
              name: res.data.name,
              type:res.data.type,
              platformTypes: []
            };
            if (!data.platformTypes) {
              this.$set(data, "platformTypes", []);
            }
            data.platformTypes.push(newChild);
            this.$message.success("添加成功!");
            this.activePlatform = data.type;
          });
      });
    },
    //移除问题分类
    removePlatform(node, data) {
      console.log(node, data);
      const parent = node.parent;
      const children = parent.data.platformTypes || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      let f = new FormData();
      f.append("id", data.id);
      f.append("_method", "delete");
      this.$axios
        .post(this.apiUrl + "/client/api/platformType/deleteById", f)
        .then(res => {
          children.splice(index, 1);
          this.$message.success("删除成功！");
        });
    },
    //修改分类名称
    modifyPlatformType(data) {
      console.log(data);
      this.$prompt("请输入修改后的分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let f = new FormData();
        f.append("id", data.id);
        f.append("_method", "PUT");
        f.append("name", value);
        this.$axios
          .post(this.apiUrl + "/client/api/platformType/update", f)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("修改成功!");
              data.name = value;
            } else {
              this.$message.error("修改失败!");
            }
          });
      });
    },
    // 获取商品信息
    getData() {
      this.data1 = [];
      this.data3 = [];
      this.url = this.apiUrl + "/client/api/personnelType/findPage";
      this.$axios.get(this.url).then(res => {
        console.log(res);
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].type == "scheme") {
            this.data1.push(res.data.content[i]);
          }
        }
        this.tableData = res.data.content;
        this.loading = false;
      });

      this.$axios
        .get(this.apiUrl + "/client/api/platformType/findPage")
        .then(res => {
          console.log(res);
          for (var i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].type == "scheme") {
              this.data3.push(res.data.content[i]);
            }
          }
          this.loading = false;
        });
    },
    // 新增
    addPerson() {
      this.addVisible = true;
      this.addType = "person";
    },
    addPlatform() {
      this.addVisible = true;
      this.addType = "platform";
    },
    //保存新增
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let f = new FormData();
          let url = "";
          f.append("name", this.formAdd.name);
          f.append("type", this.formAdd.type);
          if (this.addType == "person") {
            url = "/client/api/personnelType/add";
          } else {
            url = "/client/api/platformType/add";
          }
          this.$axios.post(this.apiUrl + url, f).then(res => {
            if (res.status == 200) {
              this.$message.success("添加成功!");
              // this.getData();
              if(this.addType == "person"){
                   this.activePerson = this.formAdd.type;
                    this.handleClick({name:this.formAdd.type});
              }else{
                 this.activePlatform = this.formAdd.type;
                  this.handleClickPlatform({name:this.formAdd.type});
              }
              this.addVisible = false;
              this.formAdd = {};
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}
.el-upload {
  display: none !important;
}
.el-upload--picture-card {
  display: none !important;
}
.block {
  width: 48%;
  margin-left: 30px;
}

.custom-tree-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree {
  margin-top: 0px;
}
.tree-title {
  font-size: 15px;
  font-weight: bold;
  margin-left: 5px;
}
.addBtn {
  font-weight: 400;
  margin-left: 20px;
  cursor: pointer;
  font-size: 13px;
  color: #409eff;
}
</style>
