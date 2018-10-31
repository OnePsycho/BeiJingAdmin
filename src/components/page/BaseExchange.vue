<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  兑换管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_cate" placeholder="商品类别" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="未使用" value="3"></el-option>
					<el-option key="2" label="已使用" value="2"></el-option>
					<el-option key="3" label="已过期" value="1"></el-option>
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
				<el-table-column prop="exchange_order_id" label="订单ID"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="order_code" label="订单编号"  align="center">
				</el-table-column>
				<el-table-column prop="product_name" label="商品名称"  align="center">
				</el-table-column>
				<el-table-column prop="end_time" label="结束时间"  sortable align="center">
				</el-table-column>
				<el-table-column prop="ticket_code" label="券码"  align="center">
				</el-table-column>
				<el-table-column prop="member_nickname" label="兑换人"  align="center">
				</el-table-column>
				<el-table-column prop="phone" label="联系电话"   align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" width="80px"   align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="下单时间" sortable align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="220px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleEdit(scope.row.exchange_order_id,scope.$index, scope.row)">详细</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.exchange_order_id,scope.$index, scope.row)">删除</el-button>
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

		<!-- 编辑弹出框 -->
		<el-dialog title="详情(不可编辑)" :visible.sync="editVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				<el-form-item label="商品图片" prop="product_img">
					<el-upload action="" list-type="picture-card" 
					:on-preview="handlePictureCardPreview" v-model="form.img_list"
					:file-list="form.img_list">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="商品名称" prop="product_name">
					<el-input v-model="form.product_name" placeholder="不超过10个字符"></el-input>
				</el-form-item> 
				<el-form-item label="兑换日期" prop="timePickerValue">
					<el-date-picker v-model="form.timePickerValue" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商品详情" prop="description">
					<quill-editor ref="myTextEditor" v-model="form.description" :options="editorOption" :disabled="true"></quill-editor>
				</el-form-item>
				<el-form-item label="重要声明">
					<quill-editor ref="myTextEditor2" v-model="form.declaration" :options="editorOption" :disabled="true"></quill-editor>
				</el-form-item>
				<el-form-item label="商品类别" prop="product_category_name">
					<el-input v-model="form.product_category_name" placeholder="不超过10个字符"></el-input>
				</el-form-item>
				<el-form-item label="使用链接" prop="link">
					<el-input v-model="form.link"></el-input>
				</el-form-item>
				<el-form-item label="支付积分" prop="link">
					<el-input v-model="form.point_needed"></el-input>
				</el-form-item>
				<el-form-item label="订单编号" prop="link">
					<el-input v-model="form.order_code"></el-input>
				</el-form-item>
				<el-form-item label="下单时间" prop="link">
					<el-input v-model="form.create_time"></el-input>
				</el-form-item>

				<el-form-item label="商家配图" prop="picture">
					<el-upload action="" list-type="picture-card" :auto-upload="true" 
					:on-preview="handlePictureCardPreview" v-model="form.img_list_shop"
					:file-list="form.img_list_shop" >
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
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
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	import { quillEditor } from 'vue-quill-editor';
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
			quillEditor
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
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
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
