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
				multiple
				:file-list="imgList"
				:before-upload="beforeAvatarUpload"
				:http-request="uploadAvatar"
				:on-remove="handleRemove">
				<i class="el-icon-plus"></i>
				</el-upload>

			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange"  :current-page="cur_page"
					layout="total, sizes, prev, pager, next, jumper" :total="totalNum" align="center" :page-sizes="[100]">
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
				apiImgUrl:domain.apiImgUrl,
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
				pageSize:100,
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
			if (to.path == "/avatar") {
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
				const isPNG = file.type === 'image/png';
				const isBMP = file.type === 'image/bmp';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG && !isPNG && !isBMP) {
				this.$message.error('头像图片只支持jpg,png,bmp格式哦!');
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
				this.imgList = [];
				this.url = this.apiUrl+'/client/api/nicknameAndHeadImg/findPage?nickName=false';
				this.$axios.get(this.url).then((res) => {
					console.log(res);
					let imgRes= res.data.content;
					for (let index = 0; index < imgRes.length; index++) {
						this.imgList.push({url:this.apiImgUrl+imgRes[index].headImg,id:imgRes[index].id})
					}
					this.loading = false;
					this.totalNum = res.data.totalElements;
				})
			},
			// 移除文件
			handleRemove(file, fileList) {
				this.imgList = fileList;
				console.log(file, fileList);
				this.$axios({
					method:"post",
					url:this.apiUrl+'/client/api/nicknameAndHeadImg/deleteById',
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
						this.$message.success('删除成功');
				})
			},
			handlePictureCardPreview(file) {
				console.log(file);
			},
			// 切换页码
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			uploadAvatar(res){
				var formData = new FormData();
				formData.append("file", res.file);
				this.$axios.post(this.apiUrl + "/client/api/file/upload", formData).then(res => {
					if(res.status==200){
						console.log(res);
						this.$axios.post(this.apiUrl + "/client/api/nicknameAndHeadImg/add?headImg="+res.data.data).then(response => {
							if(response.status == 200){
								this.$message.success("上传成功");
							}
						})
					}
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
	.el-upload-list__item-preview,.el-icon-zoom-in{
		display: none;
	}
</style>
