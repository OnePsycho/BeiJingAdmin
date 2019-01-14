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
				<el-select v-model="select_status" placeholder="用户状态" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="正常" value="normal"></el-option>
					<el-option key="2" label="审核中" value="checkPending"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
				</el-select>
				<!-- <el-input v-model="select_username" placeholder="用户名" class="handle-input mr10" @input="select_word_change"></el-input> -->
				<el-input v-model="select_phone" type="number" placeholder="手机号" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-input v-model="select_email" placeholder="邮箱" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
				<!-- <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button> -->

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
				<el-table-column prop="id" label="编号"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="phoneNum" label="手机号"  align="center" width="120">
				</el-table-column>
				<el-table-column prop="email" label="邮箱地址"  align="center" width="200">
				</el-table-column>
				<el-table-column prop="status" label="状态"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="createTime" label="注册时间"   align="center">
				</el-table-column>
				<el-table-column prop="loginTime" label="最近登录"  align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="500px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleDetails(scope.row.id,scope.$index, scope.row)">查看详细</el-button>
						<el-button type="primary" icon="el-icon-document" @click="handleProjects(scope.row.id,scope.$index, scope.row)">项目经验</el-button>
						<el-button type="warning" icon="el-icon-edit-outline" @click="handleModify(scope.row.id,scope.$index, scope.row)">修改状态</el-button>
						<!-- <el-button type="danger" icon="el-icon-tickets" @click="handleDelete(scope.row.id,scope.$index, scope.row)">删除</el-button> -->
						<el-button type="success" icon="el-icon-edit" @click="handleFlag(scope.row.id,scope.$index, scope.row)">设置标签</el-button>
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
				<!-- <el-form-item label="用户名">
					<div class="form-label">{{form.username}}</div>
				</el-form-item>  -->
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
			<el-form ref="form" :model="projectInfos" label-width="100px">
				<el-collapse v-model="activeName" v-if="projectInfos.length > 0">
				  <el-collapse-item :title="item.name" v-for="item in projectInfos" v-bind:key="item.id" class="projectTitle">
				    <div>项目类型：{{item.platformType.name}}</div>
				    <div>业主名称：{{item.ownerName}}</div>
				    <div>业主级别：{{item.ownerLevel}}</div>
				    <div>资产规模：{{item.assetScale}}</div>
				    <div>业主成功案例：{{item.ownerCases}}</div>
				    <div>项目落成时间：{{item.finishDate}}</div>
				    <div>项目所在地：{{item.city}}</div>
				    <div>项目规模：{{item.scale}}</div>
				    <div>项目角色：{{item.role}}</div>
				    <div>参与时间：{{item.startDate}} 至 {{item.endDate}}</div>
				  </el-collapse-item>
				 
				</el-collapse>
				<p v-else>暂无项目经验</p>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="projectVisible = false">取 消</el-button>
				<el-button type="primary" @click="projectVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 修改状态弹出框 -->
		<el-dialog title="修改状态" :visible.sync="modifyVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="编号" prop="id">
					<div class="form-label">{{form.id}}</div>
				</el-form-item>
				<!-- <el-form-item label="用户名" prop="product_category_name">
					<div class="form-label">{{form.username}}</div>
				</el-form-item> -->
				<el-form-item label="修改状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择">
					<el-option key="1" label="审核中" value="checkPending"></el-option>
					<el-option key="2" label="正常" value="normal"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
					<el-option key="3" label="禁用" value="disabled"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modifyVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStatusChange">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 设置标签弹出框 -->
		<el-dialog title="设置标签" :visible.sync="flagVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px" @submit.native.prevent>
				<p class="tag-title">已有标签</p>
				<el-tag
					v-for="tag in currentTags"
					:key="tag.index"
					v-model="currentTags"
					:disable-transitions="false"
					closable
					@close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input
				class="input-new-tag"
				v-if="inputVisible"
				v-model="inputValue"
				ref="saveTagInput"
				size="small"
				@keyup.enter.native="$event.target.blur"
				@blur="handleInputConfirm"
				>
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
				<p class="tag-title">可选标签</p>
				<el-tag
					v-for="tag in tags"
					:key="tag.index"
					v-model="tags"
					size="medium"
					@click.native="tagClick(tag)"
					type="info">
					{{tag}}
				</el-tag>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="flagVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveFlagChange">确 定</el-button>
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
				cur_page: 0,
				filter_page:0,
				apiUrl:domain.apiUrl,
				multipleSelection: [],
				select_type: '',
				select_status:'',
				select_username: '',
				select_phone: '',
				select_email: '',
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
				projectInfos:{},
				tags: [],
				currentTags: [],
				inputVisible: false,
				inputValue: '',
				newTags:[],
				userStatus:{
				'checkPending': '审核中',
				'normal': '正常',
				'refused': '未通过',
				'disabled':'禁用'
				},
				userTypes:{
				'designingInstitute': '研究院',
				'firstParty': '甲方',
				'freeDesigner': '自由设计师'
				}
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
			if (to.path == "/user") {
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
				this.filter_page = 0;
			},
			selectChange(val){
				this.cur_page = 0;
				this.filter_page = 0;
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
			// 获取用户信息
			getData() {
				this.select_type="";
				this.select_status="";
				this.select_username="";
				this.select_phone="";
				this.select_email="";
				this.url = this.apiUrl+'/client/api/member/findPage?type=freeDesigner';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					
					this.tableData = res.data.content;
					for (var key in this.userStatus) {
						for (var i = 0; i < res.data.content.length; i++) {
								if (key == res.data.content[i].status) {
									res.data.content[i].status = this.userStatus[key];
								}
							}
						}
					for (var key in this.userTypes) {
						for (var i = 0; i < res.data.content.length; i++) {
								if (key == res.data.content[i].type) {
									res.data.content[i].type = this.userTypes[key];
								}
							}
						}
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
							let personnelTypes = [];
							for(let i=0;i<res.data.memberExt.personnelTypes.length;i++){
								personnelTypes.push(res.data.memberExt.personnelTypes[i].name);
							}
							this.form = {
								username:res.data.memberExt.u_name,
								phoneNum:res.data.memberExt.u_phoneNum,
								email:res.data.memberExt.u_email,
								realName:res.data.memberExt.realName,
								birthday:res.data.memberExt.birthday,
								sex:res.data.memberExt.sex?"男":"女",
								workTime:res.data.memberExt.workTime,
								graduate:res.data.memberExt.graduateInstitutions,
								personnelTypes:personnelTypes.join(','),
								type:res.data.type,
								flags:res.data.memberExt.flags
							}
							for (var key in this.userTypes) {
								if (key == this.form.type) {
									this.form.type = this.userTypes[key];
							}
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
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
						console.log(res.data);
						this.$nextTick(function(){
							this.projectInfos = res.data.projectInfos;
						})
							


							this.projectVisible = true;
					}
				})
			},
			// 修改状态
			handleModify(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
						this.$nextTick(function(){
							this.form = {
								type:res.data.type,
								status:res.data.status,
								id:res.data.id
							}
						})
							this.modifyVisible = true;
						
					}
				})
			},
			// 修改标签
			handleFlag(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				this.tags = [];
				// 获取用户信息详情
				this.$axios.get(this.apiUrl+'/client/api/member/findById?id='+id).then((res) => {
					if(res.status==200){
						this.flagVisible = true;
						if(res.data.memberExt.flags){
							this.currentTags = res.data.memberExt.flags.split(',');
						}else{
							this.currentTags = [];
						}
					}
				})
				// 获取所有标签
				this.$axios.get(this.apiUrl+'/client/api/flag/findAll').then((res) => {
					if(res.status==200){
						for(var i=0;i<res.data.length;i++){
							this.tags.push(res.data[i].name);
						}
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
						this.deleteIdArr.push(this.multipleSelection[i].id);
					}
					this.$axios({
					method:"post",
					url:this.apiUrl+'/client/api/member/deleteByIds',
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
					url:this.apiUrl+'/client/api/member/deleteByIds',
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
				this.addVisible = true;
			},
			// 切换每页显示数量
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			// 筛选数据
			filterDate() {
				this.$axios
				.get(
					this.apiUrl +
					"/client/api/member/findPage?type=freeDesigner&size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
					"&memberName="+
					this.select_username+
					"&phoneNum="+
					this.select_phone+
					"&email="+
					this.select_email+
					"&status="+
					this.select_status
				)
				.then(res => {
					console.log(res);
				for (var key in this.userStatus) {
					for (var i = 0; i < res.data.content.length; i++) {
							if (key == res.data.content[i].status) {
								res.data.content[i].status = this.userStatus[key];
							}
						}
					}
				for (var key in this.userTypes) {
					for (var i = 0; i < res.data.content.length; i++) {
							if (key == res.data.content[i].type) {
								res.data.content[i].type = this.userTypes[key];
							}
						}
					}
					this.tableData = res.data.content;
					this.totalNum = res.data.totalElements;
				});
			
			},
			// 删除标签
			handleClose(tag){
				console.log(tag,this.currentTags);
				this.currentTags.splice(this.currentTags.indexOf(tag),1);
				if(this.newTags.indexOf(tag)!=-1){
					this.newTags.splice(this.newTags.indexOf(tag),1);
				}
			},
			// 自定义标签
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				console.log(this.currentTags);
				if (inputValue) {
					if(this.currentTags.indexOf(inputValue)==-1){
						this.currentTags.push(inputValue);
						if(this.newTags.indexOf(inputValue)== -1 && this.tags.indexOf(inputValue) == -1){
							console.log(this.tags);
							this.newTags.push(inputValue);
						}}else{
						this.$message("该标签已存在");
					}
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			// 保存新增的标签
			saveFlagChange(){
				this.flagVisible = false;
				let newFlags = [];
				let that = this;
				for (let index = 0; index < that.newTags.length; index++) {
					newFlags.push({'name':that.newTags[index]});
				}
				this.$axios.post(this.apiUrl+'/client/api/flag/adds',newFlags).then((res) => {
					console.log(res);
				})
				this.$axios({
					method:"post",
					url:this.apiUrl+'/client/api/memberExt/update',
					data:{
						flags:this.currentTags,
						memberId:this.currentId,
						_method:'PUT'
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
				}).then((res) => {
					if(res.status == 200){
						this.$message.success("设置成功!");
					}
				})
			},
			tagClick(tag){
				let cTags = this.currentTags;
				let aTags = this.tags;
				console.log(tag);
				if(cTags.indexOf(tag)==-1){
					cTags.push(tag);
					// aTags.splice(aTags.indexOf(tag),1);
				}else{
					this.$message("已有此标签！");
				}
			},
			//保存修改状态
			saveStatusChange(){
				this.modifyVisible = false;
				console.log(this.form.status);
				let f = new FormData();
				f.append('id',this.currentId);
				f.append('status',this.form.status);
				f.append('_method','PUT');
				this.$axios.post(this.apiUrl+'/client/api/member/update',f).then((res) => {
					if(res.status == 200){
						this.$message.success("修改成功!");
						this.getData();
					}
				})
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 150px;
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
	.form-label{
		font-size: 14px;
		font-weight: 500;
		color:black;
	}
	.tag-title{
		margin-bottom: 10px;
		margin-top: 20px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
