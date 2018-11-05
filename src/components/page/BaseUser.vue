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
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="编号"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="username" label="用户名"  align="center">
				</el-table-column>
				<el-table-column prop="phoneNum" label="手机号"  align="center">
				</el-table-column>
				<el-table-column prop="email" label="邮箱地址"  sortable align="center">
				</el-table-column>
				<el-table-column prop="type" label="身份"  align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态"  align="center">
				</el-table-column>
				<el-table-column prop="memberExt.createTime" label="注册时间"   align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="500px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleDetails(scope.row.id,scope.$index, scope.row)">查看详细</el-button>
						<el-button type="primary" icon="el-icon-tickets" @click="handleProjects(scope.row.id,scope.$index, scope.row)">项目经验</el-button>
						<el-button type="primary" icon="el-icon-tickets" @click="handleModify(scope.row.id,scope.$index, scope.row)">修改状态</el-button>
						<el-button type="danger" icon="el-icon-tickets" @click="handleEdit(scope.row.id,scope.$index, scope.row)">删除</el-button>
						<el-button type="success" icon="el-icon-delete" @click="handleFlag(scope.row.id,scope.$index, scope.row)">设置标签</el-button>
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
				<el-form-item label="用户名">
					<div class="form-label">{{form.username}}</div>
				</el-form-item> 
				<el-form-item label="手机号">
					<div class="form-label">{{form.phoneNum}}</div>
				</el-form-item> 
				<el-form-item label="邮箱">
					<div class="form-label">{{form.email}}</div>
				</el-form-item> 
				<el-form-item label="真实姓氏">
					<div class="form-label">{{form.realName}}</div>
				</el-form-item> 
				<el-form-item label="出生年月">
					<div class="form-label">{{form.birthday}}</div>
				</el-form-item> 
				<el-form-item label="性别">
					<div class="form-label">{{form.sex}}</div>
				</el-form-item> 
				<el-form-item label="毕业院校">
					<div class="form-label">{{form.graduate}}</div>
				</el-form-item>
				<el-form-item label="从业年限">
					<div class="form-label">{{form.workTime}}</div>
				</el-form-item>
				<el-form-item label="擅长领域">
					<div class="form-label">{{form.personnelTypes}}</div>
				</el-form-item>
				<el-form-item label="身份">
					<div class="form-label">{{form.type}}</div>
				</el-form-item>
				<el-form-item label="标签">
					<div class="form-label">{{form.flags}}</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="editVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 查看项目弹出框 -->
		<el-dialog title="项目经验" :visible.sync="projectVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" :disabled="true">
				<el-collapse v-model="activeName">
				  <el-collapse-item title="项目名称基于O2O模式的系统" name="1">
				    <div>项目类型：</div>
				    <div>业主描述：</div>
				  </el-collapse-item>
				  <el-collapse-item title="反馈 Feedback" name="2">
				    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
				    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
				  </el-collapse-item>
				  <el-collapse-item title="效率 Efficiency" name="3">
				    <div>简化流程：设计简洁直观的操作流程；</div>
				    <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
				    <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
				  </el-collapse-item>
				  <el-collapse-item title="可控 Controllability" name="4">
				    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
				    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
				  </el-collapse-item>
				</el-collapse>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="projectVisible = false">取 消</el-button>
				<el-button type="primary" @click="projectVisible = false">确 定</el-button>
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
					<!-- <el-option v-for="(item,index) in classifyList"
					:key="index"
					:label="item.name"
					:value="item.name">
					</el-option> -->
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
				this.url = this.apiUrl+'/client/api/member/findPage';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					this.tableData = res.data.content;
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
			// 编辑信息
			handleDetails(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				this.form = {};
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					console.log(res);
					if(res.status==200){
						this.$nextTick(function(){
							this.form = {
								username:res.data.username,
								phoneNum:res.data.memberExt.phoneNum,
								email:res.data.email,
								realName:res.data.memberExt.realName,
								birthday:res.data.memberExt.birthday,
								sex:res.data.memberExt.sex?"男":"女",
								workTime:res.data.memberExt.workTime,
								graduate:res.data.memberExt.graduateInstitutions,
								personnelTypes:res.data.memberExt.personnelTypes,
								type:res.data.type,
								flags:res.data.memberExt.flags
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
	.form-label{
		font-size: 14px;
		font-weight: 500;
		color:black;
	}


</style>
