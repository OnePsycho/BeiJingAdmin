<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  管理员管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_status" placeholder="管理员状态" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="正常" value="true"></el-option>
					<el-option key="2" label="锁定" value="false"></el-option>
				</el-select>
				<el-input v-model="select_name" placeholder="姓名" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-input v-model="select_username" placeholder="登录名" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="addAction" style="margin-left: 0px;">新增</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="编号"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="name" label="姓名"  align="center">
				</el-table-column>
				<el-table-column prop="username" label="登录名"  align="center">
				</el-table-column>
				<el-table-column prop="nonLocked" label="状态"  align="center">
				</el-table-column>
				<el-table-column prop="modifyTime" label="注册时间"   align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="200px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleModify(scope.row.id,scope.$index, scope.row)">修改状态</el-button>
						<el-button type="danger" icon="el-icon-tickets" @click="handleDelete(scope.row.id,scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange"  :current-page="cur_page"
					layout="total, sizes, prev, pager, next, jumper" :total="totalNum" align="center" :page-sizes="[5, 10, 15, 20]">
				</el-pagination>
			</div>
		</div>
		
		<!-- 修改状态弹出框 -->
		<el-dialog title="修改状态" :visible.sync="modifyVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="管理员姓名" prop="name">
					<div class="form-label">{{form.name}}</div>
				</el-form-item>
				<el-form-item label="登录名" prop="username">
					<div class="form-label">{{form.username}}</div>
				</el-form-item>
				<el-form-item label="修改状态" prop="nonLocked">
					<el-select v-model="form.nonLocked" placeholder="请选择">
					<el-option key="1" label="正常" value="true"></el-option>
					<el-option key="2" label="锁定" value="false"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modifyVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStatusChange">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 新增管理员弹出框 -->
		<el-dialog title="新增管理员" :visible.sync="addVisible" width="620px">
			<el-form ref="formAdd" :model="formAdd" label-width="100px" :rules="rules">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="formAdd.name" placeholder="请输入管理员姓名"></el-input>
				</el-form-item>
				<el-form-item label="登录名" prop="username">
					<el-input v-model="formAdd.username" placeholder="请输入登录名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="formAdd.password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="nonLocked">
					<el-select v-model="formAdd.nonLocked">
					<el-option key="1" label="正常" value="true"></el-option>
					<el-option key="2" label="锁定" value="false"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd('formAdd')">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      url: "",
      tableData: [],
      activeName: 1,
      cur_page: 1,
      select_page: 1,
      filter_page: 1,
      apiUrl: domain.apiUrl,
      multipleSelection: [],
      select_status: "",
      select_username: "",
      select_name: "",
      del_list: [],
      is_search: false,
      addVisible: false,
      modifyVisible: false,
      delVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      content: "",
      timePickerValue: [],
      editorOption: {
        placeholder: "使用规则、使用流程..."
      },
      form: {},
      formAdd: {},
      idx: -1,
      loading: true,
      totalNum: 0,
      pageSize: 10,
      currentId: 0,
      deleteIdArr: [],
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "change" }],
        username: [
          { required: true, message: "登录名不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        nonLocked: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ]
      }
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
      if (to.path == "/admin") {
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
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.select_page = val;
      this.filter_page = val;
      this.filterDate();
    },
    select_word_change(val) {
      this.filter_page = 1;
    },
    selectChange(val) {
      this.cur_page = 1;
      this.select_page = 1;
      this.filter_page = 1;
      this.filterDate();
    },
    selectChangeByPage(val) {
      this.url = this.apiUrl + "";
      this.$axios.get(this.url).then(res => {
        console.log(res);
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.totalElements;
      });
    },
    // 获取商品信息
    getData() {
      this.select_status = "";
      this.select_username = "";
      this.select_name = "";
      this.url = this.apiUrl + "/admin/api/admin/findPage";
      this.$axios.get(this.url).then(res => {
        for (var i = 0; i < res.data.content.length; i++) {
          res.data.content[i].nonLocked = res.data.content[i].nonLocked
            ? "正常"
            : "锁定";
        }
        console.log(res);
        this.tableData = res.data.content;
        this.loading = false;
        this.totalNum = res.data.totalElements;
      });
    },

    // 修改管理员状态
    handleModify(id, index, row) {
      this.idx = index;
      this.currentId = id;
      this.timePickerValue = [];
      // 点击获取商品详情
      this.$axios
        .get(this.apiUrl + "/admin/api/admin/findById?id=" + id)
        .then(res => {
          if (res.status == 200) {
            this.$nextTick(function() {
              this.form = {
                username: res.data.username,
                name: res.data.name,
                nonLocked: res.data.nonLocked ? "正常" : "锁定"
              };
            });
            this.modifyVisible = true;
          }
        });
    },

    // 删除信息
    handleDelete(id, index, row) {
      this.idx = index;
      this.currentId = id;
      this.delVisible = true;
    },
    // 批量删除
    delAll() {
      this.deleteIdArr = [];
      const length = this.multipleSelection.length;
      if (length == 0) {
        this.$message.error("请选择删除项！");
      } else {
        let str = "";
        this.del_list = this.del_list.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].order_code + " ";
          this.deleteIdArr.push(this.multipleSelection[i].id);
        }
        this.$axios({
          method: "post",
          url: this.apiUrl + "/admin/api/admin/deleteByIds",
          data: {
            ids: this.deleteIdArr,
            _method: "delete"
          },
          transformRequest: [
            function(data) {
              let ret = "";
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            }
          ]
        }).then(res => {
          this.getData();
          this.tableData.splice(this.idx, 1);
          this.$message.success("删除成功");
          this.delVisible = false;
          this.deleteIdArr = [];
        });
      }
    },
    // 表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 确定删除
    deleteRow() {
      this.deleteIdArr.push(this.currentId);
      this.$axios({
        method: "post",
        url: this.apiUrl + "/admin/api/admin/deleteByIds",
        data: {
          ids: this.deleteIdArr,
          _method: "delete"
        },
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ]
      }).then(res => {
        this.getData();
        this.tableData.splice(this.idx, 1);
        this.$message.success("删除成功");
        this.delVisible = false;
        this.deleteIdArr = [];
      });
    },
    // 移除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 新增
    addAction() {
      this.addVisible = true;
    },
    // 切换页码
    handleSizeChange(val) {
      this.pageSize = val;
      this.filterDate();
    },
    //筛选数据
    filterDate() {
      this.$axios
        .get(
          this.apiUrl +
            "/admin/api/admin/findPage?size=" +
            this.pageSize +
            "&page=" +
            this.filter_page +
            "&name=" +
            this.select_name +
            "&username=" +
            this.select_username +
            "&nonLocked=" +
            this.select_status
        )
        .then(res => {
          console.log(res);
          for (var i = 0; i < res.data.content.length; i++) {
            res.data.content[i].nonLocked = res.data.content[i].nonLocked
              ? "正常"
              : "锁定";
          }
          this.tableData = res.data.content;
          this.totalNum = res.data.totalElements;
          this.pageSize = res.data.size;
        });
    },
    //保存修改状态
    saveStatusChange() {
      this.modifyVisible = false;
      let f = new FormData();
      f.append("id", this.currentId);
      f.append("nonLocked", this.form.nonLocked);
      f.append("_method", "PUT");
      this.$axios.post(this.apiUrl + "/admin/api/admin/update", f).then(res => {
        if (res.status == 200) {
          this.$message.success("修改成功!");
          this.getData();
        }
      });
    },
    //保存新增
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .get(this.apiUrl + "/admin/api/admin/exists?username=" + this.formAdd.username)
            .then(res => {
              if(!res.data){
				let f = new FormData();
				f.append("username", this.formAdd.username);
				f.append("name", this.formAdd.name);
				f.append("password", this.formAdd.password);
				f.append("nonLocked", this.formAdd.nonLocked);
				this.$axios
					.post(this.apiUrl + "/admin/api/admin/add", f)
					.then(res => {
					if (res.status == 200) {
						this.$message.success("添加成功!");
            this.getData();
            this.formAdd = {};
						this.addVisible = false;
					}
					});
			  }else{
				  this.$message.warning("该用户名已存在！请重试！");
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
</style>
