<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i>  头像管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" @input="select_word_change"></el-input> -->
				<!-- <el-button type="success" class="handle-del mr10" @click="filterDate">筛选</el-button> -->
			</div>
				<el-upload
				action=""
				list-type="picture-card"
				:auto-upload="true"
				:file-list="imgList"
				:on-preview="handlePictureCardPreview"
				:http-request="uploadAvatar"
				:on-remove="handleRemove">
				<i class="el-icon-plus"></i>
				</el-upload>

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
				cur_page: 1,
				filter_page:1,
				apiUrl:domain.apiUrl,
				select_word: '',
				del_list: [],
				flagVisible: false,
				modifyVisible: false,
				delVisible: false,
				dialogImageUrl: '',
				dialogVisible: false,
				content: '',
				form: {},
				loading:true,
				totalNum:0,
				pageSize:10,
				currentId:0,
				deleteIdArr:[],
				imageUrl: '',
				imgList:[]
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
			beforeAvatarUpload(file) {
				console.log(file);
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			// 分页导航

			handleCurrentChange(val) {
				this.cur_page = val;
     			this.select_page = val;
				if(this.select_word!=""||this.select_cate!=""){
					this.filter_page = val;
				}
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
				this.url = this.apiUrl+'/client/api/nicknameAndHeadImg/findPage?nickName=false';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					let imgRes= res.data.content;
					for (let index = 0; index < imgRes.length; index++) {
						this.imgList.push({url:imgRes[index]})
					}
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
		
			// 移除文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				console.log(file);
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
			},
			// 切换页码
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			uploadAvatar(res){
				console.log(res);
				var formData = new FormData();
				formData.append("file", res.file);
				this.$axios.post(this.apiUrl + "/client/api/file/upload", formData).then(res => {
					if(res.status==200){
						// this.imgList.push(res.data); 
					}
						this.$message.success("上传成功");
					}
					);
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

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
