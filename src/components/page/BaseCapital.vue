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
						总金额：￥{{total}}
					</div>
				</el-card>
				<el-card class="box-card" style="background:#E6A23C">
					<div class="capital-item">
						赏金发放金额：￥{{bounty}}
					</div>
				</el-card>
				<el-card class="box-card" style="background:#F56C6C">
					<div class="capital-item">
						已提现金额：￥{{rawCash}}
					</div>
				</el-card>
				<el-card class="box-card" style="background:#909399">
					<div class="capital-item">
						剩余金额：￥{{balance}}
					</div>
				</el-card>
			</div>
			<div class="handle-box">
				<el-select v-model="select_status" placeholder="资金类别" class="handle-select mr10" @change="selectChange">
					<el-option key="1" label="赏金" value="bountyRecord"></el-option>
					<el-option key="2" label="充值" value="recharge"></el-option>
					<el-option key="3" label="提现" value="withdrawCash"></el-option>
				</el-select>
				<el-input v-model="select_phone" type="number" placeholder="手机号查询" class="handle-input mr10" @input="select_word_change"></el-input>
				<el-input v-model="select_email" placeholder="邮箱查询" class="handle-input mr10" @input="select_word_change"></el-input>
				 <el-date-picker
					v-model="value5"
					type="datetimerange"
					@input="select_word_change"
					:picker-options="pickerOptions2"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="right">
					</el-date-picker>
				<el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">显示全部</el-button>
			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe>
				<el-table-column prop="id" label="编号" align="center" width="100">
				</el-table-column>
				<el-table-column prop="account" label="账号" align="center">
				</el-table-column>
				<el-table-column prop="amount" label="金额" sortable align="center">
				</el-table-column>
				<el-table-column prop="type" label="分类" align="center">
				</el-table-column>
				<el-table-column prop="channel" label="来源" align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
				</el-table-column>
				<el-table-column prop="no" label="订单号" align="center" width="350">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center">
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange"  :current-page="cur_page"
					layout="total, sizes, prev, pager, next, jumper" :total="totalNum" align="center" :page-sizes="[5, 10, 15, 20]">
				</el-pagination>
			</div>
		</div>

	
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
				select_cate: '',
				select_phone: '',
				select_email: '',
				select_status:'',
				del_list: [],
				is_search: false,
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
			value5: ["",""],
			types:{
				'recharge': '充值',
				'bountyRecord': '赏金',
				'withdrawCash': '提现'
				},
			channels:{
				'alipay':"支付宝",
				'wxpay':"微信支付",
				'platform':"平台发放"
			},
			status:{
				'success':"交易成功",
				'complete':"交易失败",
				'create':"进行中"
			},
			total:0,
			rawCash:0,
			bounty:0,
			balance:0
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
				var that = this;
				this.select_status="";
				this.select_phone="";
				this.select_email="";
				this.value5 = ["",""];
				this.url = this.apiUrl+'/client/api/capitalDetail/findPage?size='+this.pageSize+'&page='+this.filter_page+'&sort=id,desc';
				this.$axios.get(this.url).then((res) => {
						for (var i = 0; i < res.data.content.length; i++) {
							
							res.data.content[i].account = res.data.content[i].member.phoneNum?res.data.content[i].member.phoneNum:res.data.content[i].member.email;
					
							for (var key in this.types) {
										if (key == res.data.content[i].type) {
											res.data.content[i].type = this.types[key];
									}
								}
							for (var key in this.channels) {
										if (key == res.data.content[i].channel) {
											res.data.content[i].channel = this.channels[key];
									}
								}
							for (var key in this.status) {
										if (key == res.data.content[i].status) {
											res.data.content[i].status = this.status[key];
										}
								}
						}


					this.tableData = res.data.content;
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
				this.$axios.get(this.apiUrl+'/client/api/capitalDetail/findCount').then((res) => {
					console.log(res);
					that.total = res.data.total;
					that.rawCash =  res.data.rawCash;
					that.bounty =  res.data.bounty;
					that.balance =  res.data.balance;
				})
			},
		
			// 切换页码
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			filterDate() {
				var timeRange = this.value5;
				console.log(timeRange);
				this.$axios.get(
					this.apiUrl +
					"/client/api/capitalDetail/findPage?size=" +
					this.pageSize +
					"&page=" +
					this.filter_page+
					"&phoneNum="+
					this.select_phone+
					"&email="+
					this.select_email+
					"&type="+
					this.select_status+
					"&startTime="+
					this.value5[0]+
					"&endTime="+
					this.value5[1]+
					'&sort=id,desc'
				)
				.then(res => {
				for (var i = 0; i < res.data.content.length; i++) {
							
							res.data.content[i].account = res.data.content[i].member.phoneNum?res.data.content[i].member.phoneNum:res.data.content[i].member.email;
					
							for (var key in this.types) {
										if (key == res.data.content[i].type) {
											res.data.content[i].type = this.types[key];
									}
								}
							for (var key in this.channels) {
										if (key == res.data.content[i].channel) {
											res.data.content[i].channel = this.channels[key];
									}
								}
							for (var key in this.status) {
										if (key == res.data.content[i].status) {
											res.data.content[i].status = this.status[key];
										}
								}
						}

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
