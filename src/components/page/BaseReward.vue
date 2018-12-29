<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  赏金管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_status" placeholder="状态" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="同意发放" value="agree"></el-option>
					<el-option key="2" label="拒绝发放" value="absurd"></el-option>
					<el-option key="3" label="已结束" value="finish"></el-option>
				</el-select>
				<el-input v-model="select_name" placeholder="项目名称" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="title" label="问题标题"  align="center">
				</el-table-column>
				<el-table-column prop="projectName" label="所属项目"  align="center">
				</el-table-column>
				<el-table-column prop="reward" label="赏金总金额"  align="center" width="100">
				</el-table-column>
				<el-table-column prop="finishDate" label="项目截止时间"  sortable align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态"  align="center" width="100">
				</el-table-column>
				<el-table-column prop="publishDate" label="项目发布时间" sortable  align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="400px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-tickets" @click="handleDetails(scope.row.id,scope.$index, scope.row)">查看赏金分布</el-button>
						<el-button type="primary" icon="el-icon-tickets" @click="handleFinish(scope.row.id,scope.$index, scope.row)" :disabled="scope.row.status != '同意发放'">发放赏金</el-button>
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

		<!-- 查看赏金分布弹出框 -->
		<el-dialog title="赏金分布" :visible.sync="editVisible" width="620px">
				<div class="reward-item" v-for="item in rewardData" v-bind:key="item.id">
					<span class="reward-item-user">{{item.member.tempName}} :</span><span class="reward-item-reward">{{item.reward}} RMB</span>
				</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="editVisible = false">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除请慎重！是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 确认发放赏金提示框 -->
		<el-dialog title="提示" :visible.sync="finishVisible" width="300px" center>
			<div class="del-dialog-cnt">是否确认发放赏金？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="finishVisible = false">取 消</el-button>
				<el-button type="primary" @click="finishQuestion">确 定</el-button>
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
				select_status: '',
				select_name: '',
				del_list: [],
				is_search: false,
				editVisible: false,
				finishVisible: false,
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
				rewardData:[],
				questionStatus:{
				'checkPending': '审核中',
				'normal': '正常',
				'refused': '未通过',
				'agree':'同意发放',
				'absurd':'拒绝发放',
				'finish':'已结束'
				},
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
			if (to.path == "/reward") {
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
				this.select_status="";
				this.select_name="";
				this.url = this.apiUrl+'/client/api/question/findPage?size='+this.pageSize+'&page='+this.filter_page+"&sort=id,desc&status=finish&status=agree&status=absurd";
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
				}).catch(function (error) {
					that.$message.error('网络错误，获取数据失败');
				});
			},
			// 编辑信息
			handleDetails(id,index, row) {
				this.rewardData = [];
				for(let i=0;i<row.memberJoinQuestions.length;i++){
					if(row.memberJoinQuestions[i].type == "participator"){
						this.rewardData.push(row.memberJoinQuestions[i])
					}
				}
				this.editVisible = true;
				this.idx = index;
				this.currentId = id;

			},
			// 结束问题 同意发放赏金
			handleFinish(id,index, row) {
				this.finishVisible = true;
				this.idx = index;
				this.currentId = id;

			},
			// 删除信息
			handleDelete(id,index, row) {
				this.idx = index;
				this.currentId = id;
				this.delVisible = true;
			},
			finishQuestion(){
				let that = this;
				let f = new FormData();
				f.append('id',this.currentId);
				f.append('status','finish');
				f.append('_method','PUT');
				this.$axios.post(this.apiUrl+'/client/api/question/finishQuestion',f).then((res) => {
					if(res){
						this.getData();
						this.finishVisible = false;
					}
				}).catch(function (error) {
					if(error.response.data.message == "member asset lt reward"){
						that.$message("甲方资产低于赏金！无法进行发放！");
						that.finishVisible = false;
					}
				});
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
				if(this.select_status==""&&this.select_name==""){
					this.getData();
					return;
				}
				let that = this;
				this.$axios
				.get(
					this.apiUrl +
					"/client/api/question/findPage?size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
					"&projectName="+
					this.select_name+
					"&status="+
					this.select_status+
					"&sort=id,desc"
				)
				.then(res => {
					console.log(res);
					var datas = [];
					for (var key in this.questionStatus) {
						for (var i = 0; i < res.data.content.length; i++) {
								if (key == res.data.content[i].status) {
									res.data.content[i].status = this.questionStatus[key];
								}
								if(res.data.content[i].status=="agree"||res.data.content[i].status=="absurd"||res.data.content[i].status=="finish"){
									datas.push(res.data.content[i])
								}
							}
						}
					this.tableData = datas;
					this.totalNum = res.data.totalElements;
				})
				.catch(function (error) {
					that.$message.error('网络错误，获取数据失败');
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
	.reward-item{
		margin:20px 0px;
		font-size: 16px;
	}
	.reward-item-user{
		font-weight: bold
	}
	.reward-item-reward{
		margin-left: 10px
	}

</style>
