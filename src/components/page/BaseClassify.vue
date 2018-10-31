<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-menu"></i>  分类管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">

				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
				<!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
				<el-button type="primary" class="handle-del mr10" @click="filterAction">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">重置</el-button>
				<el-button type="success" class="handle-del mr10" @click="addVisible = true">新增</el-button>
				<!-- <el-button tprimaryimary" class="handle-del mr10" @click="showAllDatas" 筛选yle="margin-left: 0px;">显示全部</el-button> -->
				<!-- <el-button type="primary" class="handle-del mr10" @click="showAllDatas" style="margin-left: 0px;">显示全部</el-button> -->
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border v-loading="loading" class="table" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>

				<el-table-column prop="name" label="类别名称" width="280">
				</el-table-column>
				
				<el-table-column prop="create_time" label="创建时间"  align="center" sortable >
				</el-table-column>
				
				<el-table-column label="操作"  align="center" width="280px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.product_category_id,scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.product_category_id,scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange" 
					layout="total, sizes, prev, pager, next, jumper" :total="totalNum" align="center" :page-sizes="[20, 40]">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="580px">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="类别名称" prop="name">
					<el-input v-model="form.name" placeholder="请选择商品类别"></el-input>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
			</span>
		</el-dialog>
		
		
		<!-- 新增弹出框 -->
		<el-dialog title="新增" :visible.sync="addVisible" width="580px">
			<el-form ref="formAdd" :model="formAdd" :rules="rules" label-width="100px">
				<el-form-item label="类别名称" prop="name" >
					<el-input v-model="formAdd.name" placeholder="输入类别名称"></el-input>
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
import qs from "qs";
export default {
  name: "basetable",
  data() {
    return {
      url: "",
      tableData: [],
      apiUrl: domain.apiUrl,
      cur_page: 1,
      multipleSelection: [],
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      content: "",
      timePickerValue: "",
      form: {
        name: "",
        create_time: ""
      },
      formAdd: {
        name: "",
        create_time: ""
      },
      idx: -1,
      loading: true,
      // 表单填写规则
      rules: {
        name: [
          { required: true, trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      },
      currentId: 0,
      totalNum: 0,
      pageSize: 10,
      deleteIdArr: []
    };
  },
  created() {
    this.getData();
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
      this.getData();
    },
    filterAction(){
      console.log(this.select_word);
        this.url =
        this.apiUrl +
        "/g01jfsc_zk65m/product_category/getProductCategoryList?index=1" +
        "&page_size=" +
        this.pageSize+
         "&keyword="+
         this.select_word;
      this.$axios.get(this.url).then(res => {
        this.tableData = res.data.data.list;
        this.loading = false;
        this.totalNum = res.data.data.totalElements;
      });
    },
    getData() {
      this.select_word = "";
      this.url =
        this.apiUrl +
        "/g01jfsc_zk65m/product_category/getProductCategoryList?index=" +
        this.cur_page +
        "&page_size=" +
        this.pageSize;
      this.$axios.get(this.url).then(res => {
        this.tableData = res.data.data.list;
        this.loading = false;
        this.totalNum = res.data.data.totalElements;
      });
    },
    // 编辑信息
    handleEdit(id, index, row) {
      this.idx = index;
      this.currentId = id;
      const item = this.tableData[index];
      // 把item值传给form
      this.form = {
        name: item.name
      };
      this.editVisible = true;
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
          str += this.multipleSelection[i].name + " ";
          this.deleteIdArr.push(this.multipleSelection[i].product_category_id);
        }
        this.$axios
          .post(
            this.apiUrl +
              "/g01jfsc_zk65m/product_category/deleteProductCategory",
            {
              product_category_id: this.deleteIdArr,
              paramsSerializer: product_category_id => {
                return qs.stringify(product_category_id, { indices: false });
              }
            }
          )
          .then(res => {
            if (res.data.code == 200) {
              this.getData();
              this.$message.success("删除成功!");
              this.multipleSelection = [];
              this.deleteIdArr = [];
            }
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .put(
              this.apiUrl +
                "/g01jfsc_zk65m/product_category/updateProductCategory",
              {
                product_category_id: this.currentId,
                name: this.form.name
              }
            )
            .then(res => {
              if (res.data.code == 200) {
                this.getData();
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 保存新增
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              this.apiUrl +
                "/g01jfsc_zk65m/product_category/addProductCategory",
              {
                name: this.formAdd.name
              }
            )
            .then(res => {
              if (res.data.code == 200) {
                this.getData();
                this.addVisible = false;
                this.$message.success(`添加成功`);
                this.formAdd = {};
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 确定删除
    deleteRow() {
      this.deleteIdArr.push(this.currentId);
      this.$axios
        .post(
          this.apiUrl + "/g01jfsc_zk65m/product_category/deleteProductCategory",
          {
            product_category_id: this.deleteIdArr,
            paramsSerializer: product_category_id => {
              return qs.stringify(product_category_id, { indices: false });
            }
          }
        )
        .then(res => {
          if (res.data.code == 200) {
            this.getData();
            this.tableData.splice(this.idx, 1);
            this.$message.success("删除成功");
            this.delVisible = false;
            this.deleteIdArr = [];
          }
        });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 新增
    addAction() {
      this.addVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
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
</style>
