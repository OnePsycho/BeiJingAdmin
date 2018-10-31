<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_cate" placeholder="用户身份" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="甲方" value="3"></el-option>
					<el-option key="2" label="设计院" value="2"></el-option>
					<el-option key="3" label="自由设计师" value="1"></el-option>
					<el-option key="4" label="全部" value=""></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" @input="select_word_change"></el-input>
				<!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<!-- <el-button type="primary" class="handle-del mr10" @click="showAllDatas" style="margin-left: 0px;">显示全部</el-button> -->
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="exchange_order_id" label="编号"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="order_code" label="用户名"  align="center">
				</el-table-column>
				<el-table-column prop="product_name" label="手机号"  align="center">
				</el-table-column>
				<el-table-column prop="end_time" label="邮箱地址"  sortable align="center">
				</el-table-column>
				<el-table-column prop="ticket_code" label="身份"  align="center">
				</el-table-column>
				<el-table-column prop="member_nickname" label="状态"  align="center">
				</el-table-column>
				<el-table-column prop="phone" label="注册时间"   align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="220px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleEdit(scope.row.exchange_order_id,scope.$index, scope.row)">详细</el-button>
						<el-button type="primary" icon="el-icon-tickets" @click="handleEdit(scope.row.exchange_order_id,scope.$index, scope.row)">修改状态</el-button>
						<el-button type="primary" icon="el-icon-tickets" @click="handleEdit(scope.row.exchange_order_id,scope.$index, scope.row)">删除</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.exchange_order_id,scope.$index, scope.row)">设置标签</el-button>
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

		<!-- 查看详情弹出框 -->
		<el-dialog title="详情(不可编辑)" :visible.sync="editVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				<el-form-item label="真实姓名" prop="product_name">
					<el-input v-model="form.product_name" placeholder="不超过10个字符"></el-input>
				</el-form-item> 

				<el-form-item label="出生年月" prop="product_category_name">
					<el-input v-model="form.product_category_name" placeholder="不超过10个字符"></el-input>
				</el-form-item>
				<el-form-item label="毕业院校" prop="link">
					<el-input v-model="form.link"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="editVisible = false">确 定</el-button>
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
		name: 'basetable',
		data() {
			return {
				url: '',
				tableData: [],
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
				addVisible: false,
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
			if (to.path == "/exchange") {
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
				if(this.select_word!=""||this.select_cate!=""){
					this.filter_page = val;
				}
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
			selectChangeByPage(val){
				this.url = this.apiUrl+'/g01jfsc_zk65m/exchange_order/getExchangeOrderList?index='+this.select_page+'&page_size='+this.pageSize+'&status='+val;
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					this.tableData = res.data.data.list;
					this.totalNum = res.data.data.totalElements;
				})
			},
			// 获取商品信息
			getData() {
				this.select_cate="";
				this.select_word="";
				this.url = this.apiUrl+'/g01jfsc_zk65m/exchange_order/getExchangeOrderList?index='+this.cur_page+'&page_size='+this.pageSize;
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					this.tableData = res.data.data.list;
					this.loading = false;
					this.totalNum = res.data.data.totalElements;
				})
			},
			// 编辑信息
			handleEdit(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/g01jfsc_zk65m/exchange_order/getExchangeOrderInfo?exchange_order_id='+id).then((res) => {
					if(res.data.code==200){
						let imgList = JSON.parse(res.data.data.product_info.product_img);
						let imgListShop = JSON.parse(res.data.data.product_info.picture);
						for(var i=0;i<imgList.length;i++){
							imgList[i].url = this.apiUrl+imgList[i].url
						}
						for(var i=0;i<imgListShop.length;i++){
							imgListShop[i].url = this.apiUrl+imgListShop[i].url
						}
						this.timePickerValue.push(res.data.data.start_time);
						this.timePickerValue.push(res.data.data.end_time);
						this.$nextTick(function(){
							this.form = {
								img_list: imgList,
								img_list_shop:imgListShop,
								product_name: res.data.data.product_info.product_name,
								point_needed: res.data.data.product_info.point_needed,
								timePickerValue:[res.data.data.product_info.start_time,res.data.data.product_info.end_time],
								start_time: res.data.data.product_info.start_time,
								end_time: res.data.data.product_info.end_time,
								description: res.data.data.product_info.description,
								declaration: res.data.data.product_info.declaration,
								product_category_name: res.data.data.product_info.product_category_name,
								link:res.data.data.product_info.link,
								order_code:res.data.data.order_code,
								create_time:res.data.data.create_time
							}
							this.editVisible = true;
						})
					}
				})
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
						this.deleteIdArr.push(this.multipleSelection[i].exchange_order_id);
					}
					this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/exchange_order/deleteExchangeOrder',
						{exchange_order_id: this.deleteIdArr,
							paramsSerializer:exchange_order_id => {
								return qs.stringify(exchange_order_id, { indices: false })}
					}).then((res) => { 
								if(res.data.code==200){
									this.getData();
									console.log(this.tableData);
									this.$message.success('删除成功!');
									this.multipleSelection = [];
									this.deleteIdArr = [];
								}
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
				this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/exchange_order/deleteExchangeOrder',
				{exchange_order_id: this.deleteIdArr,
				paramsSerializer:exchange_order_id => {
					return qs.stringify(exchange_order_id, { indices: false })}
				}).then((res) => {
							if(res.data.code==200){
								this.getData();
								this.tableData.splice(this.idx, 1);
								this.$message.success('删除成功');
								this.delVisible = false;
								this.deleteIdArr = [];
							}
						})
			},
			// 移除文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			  },
			// 新增
			addAction(){
				this.addVisible = true;
			},
			// 切换页码
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			filterDate() {
				this.$axios
				.get(
					this.apiUrl +
					"/g01jfsc_zk65m/exchange_order/getExchangeOrderList?page_size=" +
					this.pageSize +
					"&index=" +
					this.filter_page+
					"&keyword="+
					this.select_word+
					"&status="+
					this.select_cate
				)
				.then(res => {
					console.log(res);
					this.tableData = res.data.data.list;
					this.totalNum = res.data.data.totalElements;
					this.pageSize = res.data.data.pageSize;
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
