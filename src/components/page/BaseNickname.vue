<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  昵称管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="addAction" style="margin-left: 0px;">新增</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>
			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="昵称编号"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="nickname" label="昵称" align="center">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="200px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleModify(scope.row.id,scope.$index, scope.row)">修改</el-button>
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
		name: 'basetable',
		data() {
			return {
				url: '',
				tableData: [],
				activeName:1,
				cur_page: 1,
				select_page:1,
				filter_page:1,
				apiUrl:domain.apiUrl,
				multipleSelection: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				editVisible: false,
				projectVisible: false,
				flagVisible: false,
				modifyVisible: false,
				delVisible: false,
				dialogImageUrl: '',
				dialogVisible: false,
				content: '',
				timePickerValue: [],
				editorOption: {
					placeholder: '使用规则、使用流程...'
				},
				form: {},
				idx: -1,
				loading:true,
				totalNum:0,
				pageSize:10,
				currentId:0,
				deleteIdArr:[],
			}
		},
		created() {
			this.getData();
		},
		components:{
			// quillEditor
		},
		  watch: {
			//监听路由变化
			$route(to) {
			if (to.path == "/nickname") {
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
				this.filter_page = val;
				this.filterDate();
			},
			select_word_change(val){
				this.filter_page = 1;
			},

			// 获取信息
			getData() {
				this.select_word="";
				this.url = this.apiUrl+'/client/api/nicknameAndHeadImg/findPage?nickName=true&size='+this.pageSize+'&page='+this.filter_page+'&sort=id,desc';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					this.tableData = res.data.content;
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
		
			// 修改昵称
			handleModify(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.$prompt("请输入修改后昵称", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消"
				}).then(({ value }) => {
					let f = new FormData();
					f.append("id", id);
					f.append("_method", "PUT");
					f.append("nickname", value);
					this.$axios
					.post(this.apiUrl + "/client/api/nicknameAndHeadImg/update", f)
					.then(res => {
						if (res.status == 200) {
						this.getData();
						this.$message.success("修改成功!");
						} else {
						this.$message.error("修改失败!");
						}
					});
				});
			},

			// 删除信息
			handleDelete(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.delVisible = true;
			},
			// 批量删除
			delAll() {
				this.deleteIdArr =[];
				const length = this.multipleSelection.length;
				if(length==0){
					this.$message.error('请选择删除项！');
				}else{
					let str = '';
					this.del_list = this.del_list.concat(this.multipleSelection);
					for (let i = 0; i < length; i++) {
						str += this.multipleSelection[i].order_code + ' ';
						this.deleteIdArr.push(this.multipleSelection[i].id);
					}
					this.$axios({
					method:"post",
					url:this.apiUrl+'/client/api/nicknameAndHeadImg/deleteByIds',
					data:{
						ids:this.deleteIdArr,
						_method:'delete'
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
				}).then((res)=>{
						this.getData();
						this.tableData.splice(this.idx, 1);
						this.$message.success('删除成功');
						this.delVisible = false;
						this.deleteIdArr = [];
				})
					
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
					method:"post",
					url:this.apiUrl+'/client/api/nicknameAndHeadImg/deleteByIds',
					data:{
						ids:this.deleteIdArr,
						_method:'delete'
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
				}).then((res)=>{
						this.getData();
						this.tableData.splice(this.idx, 1);
						this.$message.success('删除成功');
						this.delVisible = false;
						this.deleteIdArr = [];
				})
			},
			// 移除文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			  },
			// 新增
			addAction(){
				 this.$prompt("请输入昵称", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消"
				}).then(({ value }) => {
					this.$axios
					.post(
						this.apiUrl +
						"/client/api/nicknameAndHeadImg/add?nickname=" + value 
					)
					.then(res => {
						if(res.status == 200){
							this.$message.success("添加成功!");
							this.getData();
						}else{
							this.$message.error("添加失败！");
						}
					});
				});
			},
			// 切换页码
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			filterDate() {
				this.$axios.get(
					this.apiUrl +
					"/client/api/nicknameAndHeadImg/findPage?size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
					"&nickName=true"+
					"&name="+
					this.select_word+
					'&sort=id,desc'
				)
				.then(res => {
					console.log(res);
					this.tableData = res.data.content;
					this.totalNum = res.data.totalElements;
				});
			
			},
		}
	}
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
		text-align: center
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}
	.el-upload{
		display: none !important;	
	}
	.el-upload--picture-card{
		display: none !important;
	}


</style>
