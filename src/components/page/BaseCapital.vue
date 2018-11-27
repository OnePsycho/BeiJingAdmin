<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  资金管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-card class="box-card" style="background:#67C23A">
					<div class="capital-item" >
						总金额：￥5000000
					</div>
				</el-card>
				<el-card class="box-card" style="background:#E6A23C">
					<div class="capital-item">
						待提现金额：￥60000
					</div>
				</el-card>
				<el-card class="box-card" style="background:#F56C6C">
					<div class="capital-item">
						已提现金额：￥352000
					</div>
				</el-card>
				<el-card class="box-card" style="background:#909399">
					<div class="capital-item">
						剩余金额：￥1236600
					</div>
				</el-card>
			</div>
			<div class="handle-box">
				<el-select v-model="select_status" placeholder="资金状态" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="充值" value="normal"></el-option>
					<el-option key="2" label="待提现" value="checkPending"></el-option>
					<el-option key="3" label="已提现" value="refused"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="用户名筛选" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-date-picker
					v-model="value5"
					type="datetimerange"
         			 @input="select_word_change"
					:picker-options="pickerOptions2"
					range-separator="至"
					value-format="yyyy-MM-dd HH:mm:ss"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="right">
				</el-date-picker>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="用户名" align="center">
				</el-table-column>
				<el-table-column prop="name" label="金额" align="center">
				</el-table-column>
				<el-table-column prop="name" label="分类" align="center">
				</el-table-column>
				<el-table-column prop="createTime" label="项目发布时间" align="center">
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
				select_status:'',
				del_list: [],
				is_search: false,
				delVisible: false,
				dialogImageUrl: '',
				dialogVisible: false,
				content: '',
				timePickerValue: [],
				form: {},
				idx: -1,
				loading:true,
				totalNum:0,
				pageSize:10,
				currentId:0,
				deleteIdArr:[],
				pickerOptions2: {
				shortcuts: [
				{
					text: "最近一周",
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
					picker.$emit("pick", [start, end]);
					}
				},
				{
					text: "最近一个月",
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
					picker.$emit("pick", [start, end]);
					}
				},
				{
					text: "最近三个月",
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
					picker.$emit("pick", [start, end]);
					}
				}
				]
			},
			value5: "",
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
			if (to.path == "/capital") {
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
			selectChange(val){
				this.cur_page = 1;
				this.select_page = 1;
				this.filter_page = 1;
				this.filterDate();
			},

			// 获取信息
			getData() {
				this.select_word="";
				this.url = this.apiUrl+'/client/api/flag/findPage?size='+this.pageSize+'&page='+this.filter_page+'&sort=id,desc';
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
				this.$prompt("请输入修改后的标签名称", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消"
				}).then(({ value }) => {
					let f = new FormData();
					f.append("id", id);
					f.append("_method", "PUT");
					f.append("name", value);
					this.$axios
					.post(this.apiUrl + "/client/api/flag/update", f)
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
					url:this.apiUrl+'/client/api/flag/deleteByIds',
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
					url:this.apiUrl+'/client/api/flag/deleteByIds',
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
				 this.$prompt("请输入标签名称", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消"
				}).then(({ value }) => {
					this.$axios
					.post(
						this.apiUrl +
						"/client/api/flag/add?name=" + value 
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
					"/client/api/flag/findPage?size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
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
		height: 60px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 200px;
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
	.handle-box .el-card{
		width: 20%;
		float: left;
		margin-right: 10px;
		color: white;
		height: 60px;
	}

</style>
