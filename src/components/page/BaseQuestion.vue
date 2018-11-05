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
				<el-select v-model="select_cate" placeholder="问题分类" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="高层住宅" value="3"></el-option>
					<el-option key="2" label="低层住宅" value="2"></el-option>
					<el-option key="3" label="多层住宅" value="1"></el-option>
					<el-option key="4" label="全部" value=""></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" @input="select_word_change"></el-input>
				<!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<!-- <el-button type="primary" class="handle-del mr10" @click="showAllDatas" style="margin-left: 0px;">显示全部</el-button> -->
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="addAction" style="margin-left: 0px;">发布问题</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="title" label="问题标题"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="personnelType" label="问题分类"  align="center">
				</el-table-column>
				<el-table-column prop="projectName" label="所属项目"  sortable align="center">
				</el-table-column>
				<el-table-column prop="joinNum" label="参与人数"  align="center">
				</el-table-column>
				<el-table-column prop="reward" label="赏金金额"  align="center">
				</el-table-column>
				<el-table-column prop="titleHide" label="是否组内公开" :formatter="judge"  align="center">
				</el-table-column>
				<el-table-column prop="finishDate" label="截止时间"   align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态"   align="center">
				</el-table-column>
				<el-table-column prop="publishDate" label="发布时间"   align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="400px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleModify(scope.row.id,scope.$index, scope.row)">修改状态</el-button>
						<el-button type="success" icon="el-icon-tickets" @click="handleEdit(scope.row.id,scope.$index, scope.row)">修改</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id,scope.$index, scope.row)">删除</el-button>
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
		<el-dialog title="用户详情" :visible.sync="editVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				<el-form-item label="用户名" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="手机号" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="邮箱" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="真实姓氏" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="出生年月" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="性别" prop="product_name">
					<el-label v-model="form.product_name"></el-label>
				</el-form-item> 
				<el-form-item label="从业年限" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
				<el-form-item label="擅长领域" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
				<el-form-item label="身份" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
				<el-form-item label="标签" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="editVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
	
		<!-- 新增弹出框 -->
		<el-dialog title="发布问题" :visible.sync="addVisible" width="620px">
			<el-form ref="formAdd" :model="formAdd" :rules="rules" label-width="100px">
				<el-form-item label="问题标题" prop="product_name">
					<el-input v-model="formAdd.product_name" placeholder="不超过10个字符"></el-input>
				</el-form-item>
				<el-form-item label="项目名称" prop="point_needed">
					<el-input v-model="formAdd.point_needed"></el-input>
				</el-form-item>
				<el-form-item label="问题赏金" prop="point_needed">
					<el-input v-model="formAdd.point_needed"></el-input>
				</el-form-item>
				<el-form-item label="商品详情" prop="description">
					<quill-editor ref="myTextEditor" v-model="formAdd.description" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="起止日期" prop="timePickerValue">
					<el-date-picker v-model="formAdd.timePickerValue" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="附件" prop="link">
					<el-input v-model="formAdd.link"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd('formAdd')">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改状态弹出框 -->
		<el-dialog title="修改状态" :visible.sync="modifyVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				<el-form-item label="编号" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
				<el-form-item label="用户名" prop="product_category_name">
					<el-label v-model="form.product_category_name"></el-label>
				</el-form-item>
				<el-form-item label="修改状态" prop="product_category_name">
					<el-select v-model="form.product_category_name" placeholder="请选择">
					<el-option v-for="(item,index) in classifyList"
					:key="index"
					:label="item.name"
					:value="item.name">
					</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modifyVisible = false">取 消</el-button>
				<el-button type="primary" @click="modifyVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 设置标签弹出框 -->
		<el-dialog title="设置标签" :visible.sync="flagVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="flagVisible = false">取 消</el-button>
				<el-button type="primary" @click="flagVisible = false">确 定</el-button>
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
	import "quill/dist/quill.core.css";
	import "quill/dist/quill.snow.css";
	import "quill/dist/quill.bubble.css";
	import { quillEditor } from "vue-quill-editor";
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
				addVisible:false,
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
				formAdd:{},
				idx: -1,
				loading:true,
				totalNum:0,
				pageSize:10,
				currentId:0,
				deleteIdArr:[],
				      // 表单填写规则
				rules: {
					product_name: [
					{ required: true, trigger: "blur", message: "商品名称不能为空" },
					{ min: 1, max: 20, message: "长度在 1 到 20 个文字", trigger: "blur" }
					],
					point_needed: [
					{ required: true, message: "兑换积分不能为空", trigger: "change" }
					],
					description: [
					{ required: true, message: "商品详情不能为空", trigger: "change" }
					],
					product_category_name: [
					{ required: true, message: "类别不能为空", trigger: "change" }
					],
					link: [
					{ required: false, message: "使用链接不能为空", trigger: "change" }
					],
					ticket_code: [
					{ required: false, message: "商品券码不能为空", trigger: "change" }
					],
					timePickerValue: [
					{ required: true, message: "日期不能为空", trigger: "change" }
					],
					product_img: [
					{ required: false, message: "请上传商品图片", trigger: "change" }
					]
				},
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
				this.url = this.apiUrl+'';
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
				this.url = this.apiUrl+'/client/api/question/findPage';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					this.tableData = res.data.content;
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
			judge(data){
				return data.titleHide ? '是' : '否'
			},
			// 编辑信息
			handleDetails(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
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
						})
							this.editVisible = true;
						
					}
				})
			},
			// 查看项目经验
			handleProjects(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
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
						})
							this.projectVisible = true;
					}
				})
			},
			// 查看项目经验
			handleModify(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
							this.modifyVisible = true;
						
					}
				})
			},
			// 查看项目经验
			handleFlag(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
							this.flagVisible = true;
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
