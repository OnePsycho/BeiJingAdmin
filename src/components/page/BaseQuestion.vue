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
					<!-- <el-cascader
					:options="options"
					@active-item-change="handleItemChange"
					:props="props"
					v-model="select_type"
					@change="handelTypeSelect"
					></el-cascader> -->
				<el-select v-model="select_status" placeholder="问题状态" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="审核中" value="checkPending"></el-option>
					<el-option key="2" label="正常" value="normal"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
					<el-option key="4" label="答题结束" value="complete"></el-option>
					<el-option key="5" label="同意发放" value="agree"></el-option>
					<el-option key="6" label="拒绝发放" value="absurd"></el-option>
					<el-option key="7" label="已发放" value="finish"></el-option>
				</el-select>
				<el-input v-model="select_title" placeholder="问题标题" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-input v-model="select_project_name" placeholder="项目名称" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="addAction" style="margin-left: 0px;">发布问题</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="title" label="问题标题"  align="center">
				</el-table-column>
				<el-table-column prop="platformType.name" label="问题分类"  align="center">
				</el-table-column>
				<el-table-column prop="projectName" label="所属项目"  sortable align="center">
				</el-table-column>
				<el-table-column prop="joinNum" label="参与人数"  align="center" width="80">
				</el-table-column>
				<el-table-column prop="reward" label="赏金金额"  align="center" width="120">
				</el-table-column>
				<el-table-column prop="finishDate" label="截止时间"   align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态"   align="center" width="100">
				</el-table-column>
				<el-table-column prop="publishDate" label="发布时间"   align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="300px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleModify(scope.row.id,scope.$index, scope.row)" :disabled="scope.row.status != '审核中'">修改状态</el-button>
						<el-button type="success" icon="el-icon-tickets" @click="handleEdit(scope.row.id,scope.$index, scope.row)" :disabled="scope.row.status != '审核中'">修改</el-button>
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

	
		<!-- 新增弹出框 -->
		<el-dialog title="发布问题" :visible.sync="addVisible" width="620px">
			<el-form ref="formAdd" :model="formAdd" :rules="rules" label-width="100px">
				<el-form-item label="问题标题" prop="title">
					<el-input v-model="formAdd.title"></el-input>
				</el-form-item>
				<el-form-item label="项目名称" prop="project_name">
					<el-input v-model="formAdd.project_name"></el-input>
				</el-form-item>
				<el-form-item label="问题赏金" prop="reward">
					<el-input v-model="formAdd.reward"></el-input>
				</el-form-item>
				<el-form-item label="参与人数" prop="joinNum">
					<el-input v-model="formAdd.joinNum"></el-input>
				</el-form-item>
				<el-form-item label="问题分类" prop="platformId" width="600px">
					<el-cascader
					ref="cascaderAdd"
					:options="options"
					:props="props"
					v-model="formAdd.platformId"
					:change-on-select="true"
					@change="handleItemChange"
					></el-cascader>
				</el-form-item>
				<el-form-item label="问题描述" prop="description">
					<quill-editor ref="myTextEditor" v-model="formAdd.description" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="起止日期" prop="timePickerValue">
					<el-date-picker v-model="formAdd.timePickerValue" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="问题公告" prop="notice">
					<el-input v-model="formAdd.notice"></el-input>
				</el-form-item>
				<!-- <el-form-item label="问题状态" prop="status">
					<el-select v-model="formAdd.status" placeholder="请选择">
					<el-option key="1" label="审核中" value="checkPending"></el-option>
					<el-option key="2" label="正常" value="normal"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="上传附件" prop="link">
					<el-upload
						class="upload-demo"
						action=""
						:http-request="uploadFiles"
						:on-preview="handlePreview"
						:on-remove="handleRemove"
						:before-remove="beforeRemove"
						multiple
						:limit="3"
						:on-exceed="handleExceed"
						:file-list="extraFileList">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="resetForm('formAdd')">重 置</el-button>
				<el-button type="primary" @click="saveAdd('formAdd')">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改弹出框 -->
		<el-dialog title="编辑问题" :visible.sync="editVisible" width="620px">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="问题标题" prop="title">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="项目名称" prop="project_name">
					<el-input v-model="form.project_name"></el-input>
				</el-form-item>
				<el-form-item label="问题赏金" prop="reward">
					<el-input v-model="form.reward"></el-input>
				</el-form-item>
				<el-form-item label="参与人数" prop="joinNum">
					<el-input v-model="form.joinNum"></el-input>
				</el-form-item>
				<el-form-item label="问题分类" prop="platformId" width="600px">
					<el-cascader
					:options="options"
					:props="props"
					:change-on-select="true"
					v-model="form.platformTypeIds"
					@change="handleItemChange"
					></el-cascader>
				</el-form-item>
				<el-form-item label="问题描述" prop="description">
					<quill-editor ref="myTextEditor" v-model="form.description" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="起止日期" prop="timePickerValue">
					<el-date-picker v-model="form.timePickerValue" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="问题公告" prop="notice">
					<el-input v-model="form.notice"></el-input>
				</el-form-item>
				<!-- <el-form-item label="问题状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择">
					<el-option key="1" label="审核中" value="checkPending"></el-option>
					<el-option key="2" label="正常" value="normal"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="上传附件">
					<el-upload
						class="upload-demo"
						action=""
						:http-request="uploadFiles"
						:on-preview="handlePreview"
						:on-remove="handleRemove"
						:before-remove="beforeRemove"
						multiple
						:limit="3"
						:on-exceed="handleExceed"
						:file-list="showFileList">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改状态弹出框 -->
		<el-dialog title="修改状态" :visible.sync="modifyVisible" width="620px">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="修改状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择">
					<el-option key="1" label="审核中" value="checkPending"></el-option>
					<el-option key="2" label="正常" value="normal"></el-option>
					<el-option key="3" label="未通过" value="refused"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modifyVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStatusChange">确 定</el-button>
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
				select_type:'',
				select_title:'',
				select_status:'',
				select_project_name:'',
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
				rules: {
					title: [
					{ required: true, trigger: "blur", message: "标题不能为空" },
					{ min: 1, max: 50, message: "长度在 1 到 50 个文字", trigger: "blur" }
					],
					project_name:[{ required: true, trigger: "blur", message: "项目名称不能为空"}],
					reward:[{ required: true, trigger: "blur", message: "赏金不能为空"}],
					joinNum:[{ required: true, trigger: "blur", message: "参与人数不能为空"}],
					notice:[{ required: true, trigger: "blur", message: "公告内容不能为空"}],
					platformId:[{ required: true, trigger: "blur", message: "请选择问题分类"}],
					description:[{ required: true, trigger: "blur", message: "商品描述不能为空"}],
					timePickerValue: [{ required: true, message: "日期不能为空", trigger: "change" }],
					status: [{ required: true, message: "状态不能为空", trigger: "change" }],
				},
				questionStatus:{
				'checkPending': '审核中',
				'normal': '正常',
				'refused': '未通过',
				'complete': '答题结束',
				'agree':'同意发放',
				'absurd':'拒绝发放',
				'finish':'已发放'
				},
				options: [{
					id:99,
					name: '方案',
					platformTypes: []
					}, {
					id:100,
					name: '施工图',
					platformTypes: []
					}],
				props: {
					label: 'name',
					value: 'id',
					children: 'platformTypes'
				},
				extraFileList:[],
				attachmentsIds:[],
				attachments:[],
				showFileList:[]
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
			if (to.path == "/question") {
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
				this.select_type="";
				this.select_status="";
				this.select_title="";
				this.select_project_name="";
				this.url = this.apiUrl+'/client/api/question/findPage?size='+this.pageSize+'&page='+this.filter_page+"&sort=id,desc";
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					for (var key in this.questionStatus) {
						for (var i = 0; i < res.data.content.length; i++) {
								if (key == res.data.content[i].status) {
									res.data.content[i].status = this.questionStatus[key];
								}
							}
						}
					this.tableData = res.data.content;
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
			judge(data){
				return data.titleHide ? '是' : '否'
			},
			// 过滤
			filterType(arr, name){
				if (arr.length == 0) return;
				for (let index = 0; index < arr.length; index++) {
					const element = arr[index];
					if (element[name].length == 0) {
						delete element[name];
					} else {
						this.filterType(element[name], name);
					}
				}
			},

			// 编辑信息
			handleEdit(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				this.showFileList = [];
				this.attachments = [];
				this.$axios.get(this.apiUrl+'/client/api/platformType/findPage?type=scheme').then((res) => {
					if(res.status == 200){
						this.filterType(res.data.content,'platformTypes');
						this.options[0].platformTypes = res.data.content;
					}
				})		
				this.$axios.get(this.apiUrl+'/client/api/platformType/findPage?type=workingDrawing').then((res) => {
						if(res.status == 200){
							this.filterType(res.data.content,'platformTypes');
							this.options[1].platformTypes = res.data.content;
							console.log(res.data.content);
						}
				})
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/question/findById?id='+id).then((res) => {
					console.log(res);
					if(res.status==200){
						this.$nextTick(function(){
							this.form = {
								title: res.data.title,
								project_name:res.data.projectName,
								timePickerValue:[res.data.publishDate,res.data.finishDate],
								description: res.data.content,
								reward:res.data.reward,
								joinNum:res.data.joinMaxNum,
								platformId:res.data.platformType.id,
								platformTypeIds:res.data.platformTypeIds,
								status:res.data.status,
								notice:res.data.notice
							}
							this.showFileList = res.data.attachments;
							for (let index = 0; index < res.data.attachments.length; index++) {
								this.attachmentsIds.push(res.data.attachments[index].id);
							}
							if(res.data.platformType.type=="workingDrawing"){
								this.form.platformTypeIds.unshift(100)
							}else{
								this.form.platformTypeIds.unshift(99)
							}
							console.log(this.options);
							console.log(this.form.platformTypeIds);
						})
							this.editVisible = true;
					}
				})
			},

			// 修改状态
			handleModify(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.timePickerValue = [];
				// 点击获取商品详情
				this.$axios.get(this.apiUrl+'/client/api/question/findById?id='+id).then((res) => {
					if(res.status==200){
							this.modifyVisible = true;
							this.form = {
								username:res.data.username,
								type:res.data.type,
								status:res.data.status,
								id:res.data.id
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
					for (let i = 0; i < length; i++) {
						this.deleteIdArr.push(this.multipleSelection[i].id);
					}
					this.$axios({
					method:"post",
					url:this.apiUrl+'/client/api/question/deleteByIds',
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
					url:this.apiUrl+'/client/api/question/deleteByIds',
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
			// 新增
			addAction(){
				this.addVisible = true;
				this.formAdd = {};
				this.formAdd.platformId = "";
				this.extraFileList = [];
			},
			handleItemChange(val) {
				if (val.indexOf(99) > -1 && !this.options[0].platformTypes.length) {
					this.$axios.get(this.apiUrl+'/client/api/platformType/findPage?type=scheme').then((res) => {
						if(res.status == 200){
							this.filterType(res.data.content,'platformTypes');
							this.options[0].platformTypes = res.data.content;

						}
					})
				} else if (val.indexOf(100) > -1 && !this.options[1].platformTypes.length) {
					this.$axios.get(this.apiUrl+'/client/api/platformType/findPage?type=workingDrawing').then((res) => {
						if(res.status == 200){
							this.filterType(res.data.content,'platformTypes');
							this.options[1].platformTypes = res.data.content;
						}
					})
				}
				this.formAdd.platformId = val[val.length-1];
				this.form.platformId = val[val.length-1];
				console.log(this.formAdd.platformId);
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
					"/client/api/question/findPage?size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
					"&title="+
					this.select_title+
					"&projectName="+
					this.select_project_name+
					"&type="+
					this.select_type+
					"&status="+
					this.select_status+
					"&sort=id,desc"
				)
				.then(res => {
					console.log(res);
					for (var key in this.questionStatus) {
						for (var i = 0; i < res.data.content.length; i++) {
								if (key == res.data.content[i].status) {
									res.data.content[i].status = this.questionStatus[key];
								}
							}
						}
					this.tableData = res.data.content;
					this.totalNum = res.data.totalElements;
				});
			
			},
			//保存修改状态
			saveStatusChange(){
				this.modifyVisible = false;
				console.log(this.form.status);
				let f = new FormData();
				f.append('id',this.currentId);
				f.append('status',this.form.status);
				f.append('_method','PUT');
				this.$axios.post(this.apiUrl+'/client/api/question/adminDealQuestion',f).then((res) => {
					if(res.status == 200){
						this.$message.success("修改成功!");
						this.getData();
					}
				})
			},
			handleRemove(file, fileList) {
				console.log(file);
				this.extraFileList = fileList;
				//如果是已有文件 则移除 保留其余ID
				if(this.showFileList.indexOf(file)!=-1 && file.id){
					this.$axios({
						method:"post",
						url:this.apiUrl+'/client/api/attachment/deleteById',
						data:{
							id:file.id,
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
						console.log(res);
							this.$message.success('删除成功');
					})
					this.attachmentsIds.splice(this.attachmentsIds.indexOf(file.id),1)
				}
				//新增文件移除
				if(this.attachments.indexOf(file)!=-1){
					this.attachments.splice(this.attachments.indexOf(file),1)
				}
				this.showFileList.splice(this.showFileList.indexOf(file),1)
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			//重置表单
			resetForm(formName){
				this.$refs[formName].resetFields();
			},
			// 保存新增
			saveAdd(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
				if (this.extraFileList.length<1) {
					this.$message("请上传附件！");
				} else {
					var formData = new FormData();
					formData.append("title", this.formAdd.title);
					formData.append("publishDate", this.formAdd.timePickerValue[0]);
					formData.append("finishDate", this.formAdd.timePickerValue[1]);
					formData.append("platformId", this.formAdd.platformId);
					formData.append("content", this.formAdd.description);
					formData.append("projectName", this.formAdd.project_name);
					formData.append("reward", this.formAdd.reward);
					formData.append("joinMaxNum", this.formAdd.joinNum);
					formData.append("status", this.formAdd.status);
					formData.append("notice", this.formAdd.notice);
					for (let index = 0; index < this.extraFileList.length; index++) {
						formData.append("attachments", this.extraFileList[index]);
					}
					this.$axios
					.post(this.apiUrl + "/client/api/question/add",formData)
					.then(res => {
						console.log(res);
						if (res.status == 200) {
						this.getData();
						this.addVisible = false;
						this.$message.success(`添加成功`);
						this.formAdd = {};
						this.$refs["formAdd"].resetFields();
						} else {
						this.$message.warning(`添加失败`);
						}
					});
				}
				} else {
				this.$message.error("添加失败！");
				return false;
				}
			});
			},
			// 保存编辑
			saveEdit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
				if (this.showFileList.length < 1) {
					this.$message("请上传附件！");
					console.log(this.showFileList);
				} else {
					var formData = new FormData();
					formData.append("title", this.form.title);
					formData.append("publishDate", this.form.timePickerValue[0]);
					formData.append("finishDate", this.form.timePickerValue[1]);
					formData.append("platformId", this.form.platformId);
					formData.append("content", this.form.description);
					formData.append("projectName", this.form.project_name);
					formData.append("reward", this.form.reward);
					formData.append("joinMaxNum", this.form.joinNum);
					formData.append("status", this.form.status);
					formData.append("notice", this.form.notice);
					formData.append("_method", 'PUT');
					formData.append("id", this.currentId);
					for (let index = 0; index < this.attachmentsIds.length; index++) {
						formData.append("attachmentIds", this.attachmentsIds[index]);
					}
					for (let index = 0; index < this.attachments.length; index++) {
						formData.append("attachments", this.attachments[index]);
					}
					this.$axios
					.post(this.apiUrl + "/client/api/question/adminUpdate",formData)
					.then(res => {
						console.log(res);
						if (res.status == 200) {
						this.getData();
						this.editVisible = false;
						this.$message.success(`修改成功`);
						this.form = {};
						this.$refs["form"].resetFields();
						} else {
						this.$message.warning(`修改失败`);
						}
					});
				}
				} else {
				console.log("保存失败!!");
				return false;
				}
			});
			},
	
			//文件上传
			uploadFiles(fileRes){
				this.extraFileList.push(fileRes.file);//新增文件
				this.attachments.push(fileRes.file);//已有文件
				this.showFileList.push(fileRes.file);//已有文件
			}
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
	.handle-box .el-cascader--small{
		width: 200px;
	}
	.handle-box .handle-input[data-v-227f5664]{
		width: 200px;
	}

</style>
