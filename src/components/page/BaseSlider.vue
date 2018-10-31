<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-picture-outline"></i>  轮播管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">

				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"  @input="select_word_change"></el-input>
				<!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
				<el-button type="primary" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">重置</el-button>
				<el-button type="success" class="handle-del mr10" @click="addAction">新增</el-button>
				<!-- <el-button type="primary" class="handle-del mr10" @click="showAllDatas" style="margin-left: 0px;">显示全部</el-button> -->
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border v-loading="loading" class="table" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>

				<el-table-column prop="product_name" label="商品名称" width="280">
				</el-table-column>
				<el-table-column prop="picture" label="轮播图片" width="120" align="center">
					<template slot-scope="scope">
						<el-popover placement="right" title="" trigger="hover">
							<img :src="apiUrl+scope.row.picture" width="400" height="200" class="head_pic" />
							<img slot="reference" :src="apiUrl+scope.row.picture" :alt="apiUrl+scope.row.picture" style="height: 50px;width: 100px;cursor: pointer;">
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间"  align="center" sortable >
				</el-table-column>
				
				<el-table-column label="操作"  align="center" width="280px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.slider_id,scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.slider_id,scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange" 
					layout="total, sizes, prev, pager, next, jumper" :total="totalNum" align="center" :page-sizes="[5, 10, 15, 20]">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="580px">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="选择商品" prop="product_id">
					<el-select v-model="form.product_id" placeholder="请选择商品类别">
					<el-option v-for="(item,index) in goodsList"
					:key="index"
					:label="item.product_name"
					:value="item.product_id">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="轮播配图" prop="picture">
				<el-upload action="" list-type="picture-card" :auto-upload="true" name="file" :http-request="uploadImg"
				:on-preview="handlePictureCardPreview" v-model="form.picture" :on-remove="handleRemove" :limit="product_img_limit" :on-exceed="limitTip" 
				:file-list="imgListNoHeader" :before-remove="beforeRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<P class="text">请保证图片格式正确，建议分辨率为700*370</P>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
			</span>
		</el-dialog>
		
		
		<!-- 新增弹出框 -->
		<el-dialog title="新增" :visible.sync="addVisible" width="580px">
			<el-form ref="formAdd" :model="formAdd" :rules="rules" label-width="100px">
				<el-form-item label="选择商品" prop="product_id">
				<el-select v-model="formAdd.product_id" placeholder="请选择商品类别">
				<el-option v-for="(item,index) in goodsList"
				:key="index"
				:label="item.product_name"
				:value="item.product_id">
				</el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="轮播配图" prop="picture">
				<el-upload action="" list-type="picture-card" :auto-upload="true" name="file" :http-request="uploadImg"
				:on-preview="handlePictureCardPreview" v-model="formAdd.picture" :on-remove="handleRemove" :limit="product_img_limit" :on-exceed="limitTip" 
				:file-list="imgListNoHeader">
					<i class="el-icon-plus"></i>
				</el-upload>
				<P class="text">请保证图片格式正确，建议分辨率为700*370</P>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd('formAdd')">确 定</el-button>
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
	import qs from 'qs';
	export default {
		name: 'basetable',
		data() {
			return {
				url: '',
				tableData: [],
				apiUrl:domain.apiUrl,
				cur_page: 1,
				filter_page:1,
				multipleSelection: [],
				select_word: '',
				del_list: [],
				is_search: false,
				editVisible: false,
				addVisible: false,
				delVisible: false,
				dialogImageUrl: '',
				dialogVisible: false,
				content: '',
				timePickerValue: '',
				form: {}, 
				formAdd: {},
				idx: -1,
				loading:true,
				// 表单填写规则
				rules: {
					product_id: [
						{ required: true,  trigger: 'change', message: '请选择商品' },
					]
				},
				currentId:0,
				totalNum:0,
				pageSize:10,
				product_img_limit:1,
				deleteIdArr:[],
				imgListNoHeader:[],
				imgUploadUrl:'',
				goodsList:[]
			}
		},
		created() {
			this.getData();
		},
		watch:{   //监听路由变化
			$route(to){   
				if(to.path == "/slider"){
					this.getData();//当前页面展示即刷新数据
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
			getData() {
				this.select_word = "";
				this.url = this.apiUrl+'/g01jfsc_zk65m/slider/getSliderList?index='+this.cur_page+'&page_size='+this.pageSize;
				this.$axios.get(this.url).then((res) => {
					this.tableData = res.data.data.list;
					this.loading = false;
					this.totalNum = res.data.data.totalElements;
				})
				
				// 获取所有商品
				this.$axios.get(this.apiUrl+'/g01jfsc_zk65m/product/getProductList?index=1').then((res) => {
					this.goodsList = res.data.data.list;
				})
			},
			// 编辑信息
			handleEdit(id,index, row) {
				this.imgListNoHeader = [];
				this.idx = index;
				this.currentId = id;
				const item = this.tableData[index];
				this.imgListNoHeader.push({'url':this.apiUrl+item.picture});
				this.imgUploadUrl = item.picture;
				// 把item值传给form
				this.form = {
					product_id: item.product_id,
					url:item.picture
				}
				this.editVisible = true;
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
						str += this.multipleSelection[i].product_name + ' ';
						this.deleteIdArr.push(this.multipleSelection[i].slider_id);
					}
					this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/slider/deleteSlider',
						{slider_id: this.deleteIdArr,
							paramsSerializer:slider_id => {
								return qs.stringify(slider_id, { indices: false })}
					}).then((res) => {
								if(res.data.code==200){
									this.getData();
									this.$message.success('删除成功!');
									this.multipleSelection = [];
									this.deleteIdArr = [];
								}
							})
				}
				
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 保存编辑
			saveEdit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.imgListNoHeader.length==0){
							this.$message("图片不能为空!");
						}else{
						this.$axios.put(this.apiUrl+'/g01jfsc_zk65m/slider/updateSlider', {
							slider_id:this.currentId,
							product_id:this.form.product_id,
							picture:this.imgUploadUrl
						}).then((res) => {
							if(res.data.code==200){
								this.getData();
								this.editVisible = false;
								this.$message.success(`修改第 ${this.idx+1} 行成功`);
							}
						})
							}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 保存新增
			saveAdd(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.imgListNoHeader.length==0){
							this.$message("图片不能为空!");
						}else{
						this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/slider/addSlider', {
							product_id: this.formAdd.product_id,
							picture:this.imgUploadUrl
						}).then((res) => {
							if(res.data.code==200){
								this.getData();
								this.addVisible = false;
								this.$message.success(`添加成功`);
								this.formAdd = {};
							}
						})
						}
          } else {
            console.log('error submit!!');
            return false;
          }
        });
			},
			// 确定删除
			deleteRow() {
				this.deleteIdArr.push(this.currentId);
				this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/slider/deleteSlider',
				{slider_id: this.deleteIdArr,
				paramsSerializer:slider_id => {
					return qs.stringify(slider_id, { indices: false })}
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
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			  },
			// 新增
			addAction(){
				this.imgListNoHeader = [];
				this.form = {};
				this.formAdd = {};
				this.addVisible = true;
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getData();
			},
			limitTip(){
				this.$message("图片数量已达最大限制！");
			},
			// 移除文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
				if(fileList.length == 0){this.$message("图片不能为空！")}
			},
			beforeRemove(file, fileList){
				for (var i = 0; i < fileList.length; i++){
					if (fileList[i] === file){ //表示数组里面有这个元素
							console.log(i);
							this.imgListNoHeader.splice(i,1);
					}
			}},
			// 上传商品图片
			uploadImg(res){
				this.imgListNoHeader = [];
				var formData = new FormData();
				formData.append("file",res.file);
				this.$axios.post(this.apiUrl+'/g01jfsc_zk65m/upload/imgUpload',formData)
				.then((res) => {
					if(res.data.code==200){
						this.$message.success("上传成功");
						this.imgListNoHeader.push({'url':this.apiUrl+res.data.data.url});
						this.imgUploadUrl = res.data.data.url;
						console.log(this.imgListNoHeader);
					}else{
						this.$message.warn('上传失败！请重试');
					}
				})
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.filterDate();
			},
			filterDate() {
			this.$axios
			.get(
				this.apiUrl +
				"/g01jfsc_zk65m/slider/getSliderList?page_size=" +
				this.pageSize +
				"&index=" +
				this.filter_page+
				"&keyword="+
				this.select_word
			)
			.then(res => {
				console.log(res);
				this.tableData = res.data.data.list;
				this.totalNum = res.data.data.totalElements;
				this.pageSize = res.data.data.pageSize;
				 if(res.data.data.list.length==0){
					this.filter_page = 1;
					this.filterDate();
				}
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

</style>
