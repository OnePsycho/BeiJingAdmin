<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-shop"></i> 商品管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_cate" placeholder="商品类别" class="handle-select mr10" @change="selectedChange">
					<el-option v-for="(item,index) in classifyList"
					:key="index"
					:label="item.name"
					:value="item.product_category_id">
					</el-option>
					<el-option label="全部" value=""></el-option>

				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" @input="select_word_change" class="handle-input mr10"></el-input>

				<el-date-picker
					v-model="value5"
					type="datetimerange"
          @input="select_word_change"
					:picker-options="pickerOptions2"
					range-separator="至"
					value-format="yyyy-MM-dd HH:mm:ss"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="right">
				</el-date-picker>
				
				<el-button type="primary" class="handle-del mr10" @click="filterDate">筛选</el-button>
				<el-button type="primary" class="handle-del mr10" @click="getData">重置</el-button>
				<el-button type="success" class="handle-del mr10" @click="addAction">新增</el-button>
				<el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAll" style="margin-left: 0px;">批量删除</el-button>

			</div>
			<el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>

				<el-table-column prop="product_id" label="商品ID" align="center" width="80">
				</el-table-column>
				<el-table-column prop="product_name" label="商品名称" align="center">
				</el-table-column>
				<el-table-column prop="product_img" label="商品图片" width="120" align="center">
					<template slot-scope="scope">
						<el-popover placement="right" title="" trigger="hover">
							<img :src="apiUrl+scope.row.product_img[0].url" width="360" height="360" class="head_pic" />
							<img slot="reference" :src="apiUrl+scope.row.product_img[0].url" :alt="apiUrl+scope.row.product_img[0]" style="height: 50px;width: 50px;cursor: pointer;">
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="start_time" label="兑换开始时间" width="200" sortable align="center">
				</el-table-column>
				<el-table-column prop="end_time" label="兑换结束时间" width="200" sortable align="center">
				</el-table-column>
				<el-table-column prop="point_needed" label="兑换所需积分" width="150" align="center" sortable>
				</el-table-column>
				<el-table-column prop="product_category_name" label="商品类别" width="90" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.product_id,scope.$index,scope.row)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.product_id,scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange"
					@size-change="handleSizeChange"   :current-page="cur_page"
					layout="total, sizes, prev, pager, next, jumper"  :total="totalNum" align="center" :page-sizes="[5, 10, 15, 20]">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="620px">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="商品图片" prop="product_img">
					<el-upload action="" list-type="picture-card" :auto-upload="true" name="file" :http-request="uploadImg"
					 :on-preview="handlePictureCardPreview" v-model="form.img_list" :on-remove="handleRemove" :limit="product_img_limit" :on-exceed="limitTip" 
					 :file-list="form.img_list" :before-remove="beforeRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="商品名称" prop="product_name">
					<el-input v-model="form.product_name" placeholder="不超过10个字符"></el-input>
				</el-form-item>
				<el-form-item label="兑换积分" prop="point_needed">
					<el-input v-model="form.point_needed"></el-input>
				</el-form-item>
				<el-form-item label="兑换日期" prop="timePickerValue">
					<el-date-picker v-model="form.timePickerValue" type="datetimerange"  value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商品详情" prop="description">
					<quill-editor ref="myTextEditor" v-model="form.description" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="重要声明">
					<quill-editor ref="myTextEditor2" v-model="form.declaration" :options="editorOption2"></quill-editor>
				</el-form-item>
				<el-form-item label="商品类别" prop="product_category_name">
					<el-select v-model="form.product_category_name" placeholder="请选择商品类别">
					<el-option v-for="(item,index) in classifyList"
					:key="index"
					:label="item.name"
					:value="item.name">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属专区" prop="area_id">
					<el-select v-model="form.area_id" placeholder="请选择所属专区">
					<el-option label="无" value=""></el-option>
					<el-option v-for="(item,index) in areaList"
					:key="index"
					:label="item.name"
					:value="item.area_id">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="使用链接" prop="link">
					<el-input v-model="form.link"></el-input>
				</el-form-item>
				<el-form-item label="商品券码" prop="ticket_code">
					<el-input v-model="form.ticket_code" placeholder="手动输入券码之间英文逗号分隔，TXT文件回车分隔"></el-input>
					<el-upload
						class="upload-demo"
						action=""
						:auto-upload="true"
						multiple
						:limit="1"
						:show-file-list="false"
						:http-request="uploadTxt"
						:before-upload="beforeTxtUpload"
						:file-list="txtList">
					<el-button size="small" type="primary">重新上传券码TXT文件</el-button>
				</el-upload>
				</el-form-item>
				<el-form-item label="商家配图" prop="picture">
					<el-upload action="" list-type="picture-card" :auto-upload="true" :http-request="uploadImgShop"
					 :on-preview="handlePictureCardPreview" v-model="form.img_list_shop" :on-remove="handleRemove" :limit="picture_limit" :on-exceed="limitTip"
					 :file-list="form.img_list_shop" :before-remove="beforeRemoveShopImg">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				
				<el-form-item label="视频上传" prop="Video">
					<video v-if="videoForm.Video !='' && videoFlag == false" :src="videoForm.Video" class="avatar" controls="controls" style="max-width: 400px;max-height: 200px;border-radius: 5px;">您的浏览器不支持视频播放</video>
						<el-upload class="avatar-uploader el-upload--text" action="" :http-request="uploadVideo" :show-file-list="false" :before-upload="beforeUploadVideo" :on-progress="uploadVideoProcess">
								<video v-if="videoForm.Video !='' && videoFlag == false && videoFlag == true" :src="videoForm.Video" class="avatar"  controls="controls">您的浏览器不支持视频播放</video>
								<i class="el-icon-plus"></i>
								<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
						</el-upload>
						<P class="text">请保证视频格式正确，且不超过10M，重选更换</P>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 新增弹出框 -->
		<el-dialog title="新增" :visible.sync="addVisible" width="620px">
			<el-form ref="formAdd" :model="formAdd" :rules="rules" label-width="100px">
				<el-form-item label="商品图片" prop="product_img">
					<el-upload action="" list-type="picture-card" :auto-upload="true" name="file" :http-request="uploadImg"
					 :on-preview="handlePictureCardPreview" v-model="formAdd.img_list" :on-remove="handleRemove" :limit="product_img_limit" :on-exceed="limitTip" 
					 :file-list="formAdd.img_list">
						<i class="el-icon-plus"></i>
					</el-upload>
					<P class="text">请保证图片格式正确，建议分辨率为750*330，最多三张</P>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="商品名称" prop="product_name">
					<el-input v-model="formAdd.product_name" placeholder="不超过10个字符"></el-input>
				</el-form-item>
				<el-form-item label="兑换积分" prop="point_needed">
					<el-input v-model="formAdd.point_needed"></el-input>
				</el-form-item>
				<el-form-item label="兑换日期" prop="timePickerValue">
					<el-date-picker v-model="formAdd.timePickerValue" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商品详情" prop="description">
					<quill-editor ref="myTextEditor" v-model="formAdd.description" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="重要声明">
					<quill-editor ref="myTextEditor2" v-model="formAdd.declaration" :options="editorOption2"></quill-editor>
				</el-form-item>
				<el-form-item label="商品类别" prop="product_category_name">
					<el-select v-model="formAdd.product_category_name" placeholder="请选择商品类别">
					<el-option v-for="(item,index) in classifyList"
					:key="index"
					:label="item.name"
					:value="item.name">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属专区" prop="area_id">
					<el-select v-model="formAdd.area_id" placeholder="请选择所属专区">
					<el-option label="无" value=""></el-option>
					<el-option v-for="(item,index) in areaList"
					:key="index"
					:label="item.name"
					:value="item.area_id">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="使用链接" prop="link">
					<el-input v-model="formAdd.link"></el-input>
				</el-form-item>
				<el-form-item label="商品券码" prop="ticket_code">
					<el-input v-model="formAdd.ticket_code" placeholder="手动输入券码之间英文逗号分隔，TXT文件回车分隔"></el-input>
					<el-upload
						class="upload-demo"
						action=""
						:auto-upload="true"
						multiple
						:limit="1"
						:show-file-list="false"
						:http-request="uploadTxtAdd"
						:before-upload="beforeTxtUpload"
						:file-list="txtList">
					<el-button size="small" type="primary">点击上传券码TXT文件</el-button>
				</el-upload>
				</el-form-item>
				<el-form-item label="商家配图" prop="picture">
					<el-upload action="" list-type="picture-card" :auto-upload="true" :http-request="uploadImgShop"
					 :on-preview="handlePictureCardPreview" v-model="formAdd.img_list_shop" :on-remove="handleRemove" :limit="picture_limit" :on-exceed="limitTip"
					 :file-list="formAdd.img_list_shop">
						<i class="el-icon-plus"></i>
					</el-upload>
					<P class="text">请保证图片格式正确，建议分辨率为336*210</P>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				
				<el-form-item label="视频上传" prop="Video">
					<video v-if="videoForm.Video !='' && videoFlag == false"  :src="videoForm.Video" class="avatar" controls="controls" style="max-width: 400px;max-height: 200px;border-radius: 5px;">您的浏览器不支持视频播放</video>
						<el-upload class="avatar-uploader el-upload--text" :on-success="handleVideoSuc" action=""
						 :http-request="uploadVideo" :show-file-list="false"
						  :before-upload="beforeUploadVideo" :on-progress="uploadVideoProcess">
								<i class="el-icon-plus"></i>
						</el-upload>
						<P class="text">请保证视频格式正确，且不超过10M，重选更换</P>
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "basetable",
  data() {
    return {
	  url: "",
	  txtList:[],
      tableData: [],
      apiUrl: domain.apiUrl,
      cur_page: 1,
      select_page:1,
      filter_page:1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      content: "",
      timePickerValue: [],
      editorOption: { placeholder: "使用规则、使用流程..." },
      editorOption2: { placeholder: "重要声明..." },
      form: {
		    img_list: [],
        img_list_shop: [],
        product_name: "",
        point_needed: "",
        timePickerValue: [],
        start_time: "",
        end_time: "",
        description: "",
        declaration: "",
        product_category_name: "",
        link: "",
        ticket_code: ""
	  },
      formAdd: {
        img_list: [],
        img_list_shop: [],
        product_name: "",
        point_needed: "",
        timePickerValue: [],
        start_time: "",
        end_time: "",
        description: "",
        declaration: "",
        product_category_name: "",
        link: "",
        ticket_code: ""
      },
      videoFlag: false,
      videoForm: {
        Video: ""
      },
      videoUploadPercent: "",
      idx: -1,
      loading: true,
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
      value5: "",
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
      totalNum: 0,
      pageSize: 10,
      product_img_limit: 3,
      picture_limit: 1,
      currentId: 0,
      classifyList: [],
      areaList: [],
      imgListNoHeader: [],
      imgShopNoHeader: [],
      deleteIdArr: [],
      videoNoHeader: "",
      filterList:[]
    };
  },
  created() {
    this.getData();
  },
  watch: {
    //监听路由变化
    $route(to) {
      if (to.path == "/table") {
        this.getData(); //当前页面展示即刷新数据
        this.value5 = "";      
        this.select_cate = "";  
      }
    }
  },
  components: {
    quillEditor
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

    getData() {
      this.select_cate = "";
      this.select_word = "";
      this.value5 = ["",""];
      this.url =
        this.apiUrl +
        "/g01jfsc_zk65m/product/getProductList?page_size=" +
        this.pageSize +
        "&index=" +
        this.cur_page;
      this.$axios
        .get(this.url, {
          page: this.cur_page
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.loading = false;
          this.totalNum = res.data.data.totalElements;
          this.pageSize = res.data.data.pageSize;
        });

      // 获取分类信息
      this.$axios
        .get(
          this.apiUrl +
            "/g01jfsc_zk65m/product_category/getProductCategoryList&index=1"
        )
        .then(res => {
          this.classifyList = res.data.data.list;
        });
      // 获取专区信息
      this.$axios
        .get(this.apiUrl + "/g01jfsc_zk65m/area/getAreaList&index=1")
        .then(res => {
          this.areaList = res.data.data.list;
        });
    },
    getDataByCategory(id){
      this.url =
        this.apiUrl +
        "/g01jfsc_zk65m/product/getProductList?page_size=" +
        this.pageSize +
        "&index=" +
        this.select_page+
         "&product_category_id=" +
        id;
      this.$axios
        .get(this.url, {
          page: this.cur_page
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.loading = false;
          this.totalNum = res.data.data.totalElements;
          this.pageSize = res.data.data.pageSize;
        });
    },
    selectedChange(val){
      this.cur_page = 1;
      this.select_page = 1;
      this.filter_page = 1;
      this.filterDate();
    },
    // 筛选标签
    filterTag(value, row) {
      return row.status === value;
    },
    // 编辑信息
    handleEdit(id, index, row) {
      this.idx = index;
      this.currentId = id;
      this.timePickerValue = [];
      // 点击获取商品详情
      this.$axios
        .get(
          this.apiUrl + "/g01jfsc_zk65m/product/getProductInfo?product_id=" + id
        )
        .then(res => {
          if (res.data.code == 200) {
            let imgList = JSON.parse(res.data.data.product_img);
            let imgListShop = JSON.parse(res.data.data.picture);
            this.imgListNoHeader = JSON.parse(res.data.data.product_img);
            this.imgShopNoHeader = JSON.parse(res.data.data.picture);
            if (res.data.data.video) {
			  this.videoForm.Video = this.apiUrl + res.data.data.video;
			  this.videoNoHeader = res.data.data.video;
            } else {
              this.videoForm.Video = "";
            }
            console.log(this.imgListNoHeader);

            for (var i = 0; i < imgList.length; i++) {
              imgList[i].url = this.apiUrl + imgList[i].url;
            }
            for (var i = 0; i < imgListShop.length; i++) {
              imgListShop[i].url = this.apiUrl + imgListShop[i].url;
            }
            this.timePickerValue.push(res.data.data.start_time);
            this.timePickerValue.push(res.data.data.end_time);
            this.$nextTick(function() {
              this.form = {
                img_list: imgList,
                img_list_shop: imgListShop,
                product_name: res.data.data.product_name,
                point_needed: res.data.data.point_needed,
                timePickerValue: this.timePickerValue,
                start_time: res.data.data.start_time,
                end_time: res.data.data.end_time,
                description: res.data.data.description,
                declaration: res.data.data.declaration,
                product_category_name: res.data.data.product_category_name,
                link: res.data.data.link,
                ticket_code: res.data.data.ticket_code,
                area_id: res.data.data.area_id
              };
              this.editVisible = true;
            });
          }
        });
    },
    // 删除信息
    handleDelete(id, index, row) {
      this.idx = index;
      this.currentId = id;
      this.delVisible = true;
    },
    // 批量删除
    delAll() {
      this.deleteIdArr = [];
      const length = this.multipleSelection.length;
      if (length == 0) {
        this.$message.error("请选择删除项！");
      } else {
        let str = "";
        this.del_list = this.del_list.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].product_name + " ";
          this.deleteIdArr.push(this.multipleSelection[i].product_id);
        }
        this.$axios
          .post(this.apiUrl + "/g01jfsc_zk65m/product/deleteProduct", {
            product_id: this.deleteIdArr,
            paramsSerializer: product_id => {
              return qs.stringify(product_id, { indices: false });
            }
          })
          .then(res => {
            if (res.data.code == 200) {
              this.getData();
              console.log(this.tableData);
              this.$message.success("删除成功!");
              this.multipleSelection = [];
              this.deleteIdArr = [];
            } else {
              this.$message.warn("删除失败!");
            }
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.imgListNoHeader.length == 0 ||
            this.imgShopNoHeader.length == 0 ||
            this.videoForm.Video == "" ||
            this.videoForm.Video == null
          ) {
            this.$message("视频图片不能为空！请重新上传！");
          } else {
            // 发送修改商品信息请求
            console.log(this.imgListNoHeader);
            this.$axios
              .put(this.apiUrl + "/g01jfsc_zk65m/product/updateProduct", {
                product_id: this.currentId,
                product_name: this.form.product_name,
                start_time: this.form.timePickerValue[0],
                end_time: this.form.timePickerValue[1],
                point_needed: this.form.point_needed,
                description: this.form.description,
                product_category_name: this.form.product_category_name,
                link: this.form.link,
                ticket_code: this.form.ticket_code,
                declaration: this.form.declaration,
                picture: this.imgShopNoHeader,
                product_img: this.imgListNoHeader,
                video: this.videoNoHeader,
                area_id: this.form.area_id
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.getData();
                  this.editVisible = false;
                  this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                  this.imgListNoHeader = [];
				  this.imgShopNoHeader = [];
				  this.txtList = [];
				  this.form = {};
                } else {
                  this.$message.warn("修改失败，请稍后重试！");
                }
              });
          }
        } else {
          console.log("error submit!!");
          console.log(this.form.img_list);
          return false;
        }
      });
    },
    // 保存新增
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.imgListNoHeader.length == 0 ||
            this.imgShopNoHeader.length == 0 ||
            this.videoForm.Video == "" ||
            this.videoForm.Video == null
          ) {
            this.$message("视频图片不能为空！请重新上传！");
            console.log(this.imgListNoHeader);
            console.log(this.imgShopNoHeader);
            console.log(this.videoForm);
          } else {
            this.$axios
              .post(this.apiUrl + "/g01jfsc_zk65m/product/addProduct", {
                product_name: this.formAdd.product_name,
                start_time: this.formAdd.timePickerValue[0],
                end_time: this.formAdd.timePickerValue[1],
                point_needed: this.formAdd.point_needed,
                description: this.formAdd.description,
                product_category_name: this.formAdd.product_category_name,
                link: this.formAdd.link,
                ticket_code: this.formAdd.ticket_code,
                declaration: this.formAdd.declaration,
                picture: this.imgShopNoHeader,
                product_img: this.imgListNoHeader,
                video: this.videoNoHeader,
                area_id: this.formAdd.area_id
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.getData();
                  this.addVisible = false;
                  this.$message.success(`添加成功`);
                  this.imgListNoHeader = [];
				  this.imgShopNoHeader = [];
				  this.formAdd = {};
                  this.formAdd.img_list = [];
				  this.formAdd.img_list_shop = [];
				  this.txtList = [];
                  this.$refs["formAdd"].resetFields();
                } else {
                  this.$message.warn(`添加失败`);
                }
              });
          }
        } else {
          console.log("保存失败!!");
          return false;
        }
      });
    },
    // 确定删除
    deleteRow() {
      this.deleteIdArr.push(this.currentId);
      this.$axios
        .post(this.apiUrl + "/g01jfsc_zk65m/product/deleteProduct", {
          product_id: this.deleteIdArr,
          paramsSerializer: product_id => {
            return qs.stringify(product_id, { indices: false });
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.getData();
            this.tableData.splice(this.idx, 1);
            this.$message.success("删除成功");
            this.delVisible = false;
            this.deleteIdArr = [];
          }
        });
    },
    // 移除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      if (fileList.length == 0) {
        this.$message("图片不能为空！");
      }
    },
    beforeRemove(file, fileList) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i] === file) {
          //表示数组里面有这个元素
          console.log(i);
          this.imgListNoHeader.splice(i, 1);
        }
      }
    },
    beforeRemoveShopImg(file, fileList) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i] === file) {
          //表示数组里面有这个元素
          console.log(i);
          this.imgShopNoHeader.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 新增
    addAction() {
      this.imgListNoHeader = [];
      this.imgShopNoHeader = [];
      this.form = {};
      this.videoForm.Video = "";
      this.addVisible = true;
    },
    filterDate() {
      console.log(this.value5);
      if (!this.value5) {
        this.value5 = ['',''];
      } 
        this.$axios
          .get(
            this.apiUrl +
              "/g01jfsc_zk65m/product/getProductList?page_size=" +
              this.pageSize +
              "&index=" +
              this.filter_page+
              "&start_time=" +
              this.value5[0] +
              "&end_time=" +
              this.value5[1]+
              "&keyword="+
              this.select_word+
              "&product_category_id="+
              this.select_cate
          )
          .then(res => {
            console.log(res);
            this.tableData = res.data.data.list;
            this.totalNum = res.data.data.totalElements;
            this.pageSize = res.data.data.pageSize;
          });
      
    },
    limitTip() {
      this.$message("图片数量已达最大限制！");
    },
    // 上传商品图片
    uploadImg(res) {
      var formData = new FormData();
      formData.append("file", res.file);
      this.$axios
        .post(this.apiUrl + "/g01jfsc_zk65m/upload/imgUpload", formData)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.imgListNoHeader.push(res.data.data);
            console.log(this.imgListNoHeader);
          } else {
            this.$message.warn("上传失败！请重试");
          }
        });
    },
    // 上传商家图片
    uploadImgShop(res) {
      var formData = new FormData();
      formData.append("file", res.file);
      this.$axios
        .post(this.apiUrl + "/g01jfsc_zk65m/upload/imgUpload", formData)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.imgShopNoHeader.push(res.data.data);
            console.log(this.imgShopNoHeader);
          }
        });
    },
    // 上传商品视频
    uploadVideo(res) {
      var formData = new FormData();
      formData.append("file", res.file);
      this.$axios
        .post(this.apiUrl + "/g01jfsc_zk65m/upload/videoUpload ", formData)
        .then(res => {
          if (res.data.code == 200) {
            this.form.video = res.data.data;
            this.videoForm.Video = this.apiUrl + res.data.data;
            this.videoNoHeader = res.data.data;
            this.$message.success("上传成功");
            console.log(this.form);
            console.log(this.videoForm);
          }
        });
    },
    handleVideoSuc() {
      this.$message.success("视频传输完成！");
      console.log("传输完成!");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.filterDate();
    },
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
	},
	beforeTxtUpload(file) {
	  const isLt10M = file.size / 1024 / 1024 < 5;
	  console.log(file.type);
      if (
        [
          "text/plain"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的文本格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过5MB哦!");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
    },

    uploadTxt(file, fileList) {
      console.log(file);
      var that = this;
      var txtData = "";
      var reader = new FileReader(); //这是核心！！读取操作都是由它完成的
      reader.readAsText(file.file);
      reader.onload = function(oFREvent) {
        //读取完毕从中取值
        var pointsTxt = oFREvent.target.result.split("\n");
		txtData = pointsTxt.join(",").replace(/\ +/g,"");
		console.log(txtData);
		if(that.form.ticket_code!=""){
        	that.form.ticket_code = that.form.ticket_code+','+txtData;
		}else{
			that.form.ticket_code =	txtData;
		}
		that.txtList = [];
      };
	},
	uploadTxtAdd(file, fileList) {
      console.log(file);
      var that = this;
      var txtData = "";
      var reader = new FileReader(); //这是核心！！读取操作都是由它完成的
      reader.readAsText(file.file);
      reader.onload = function(oFREvent) {
        //读取完毕从中取值
        var pointsTxt = oFREvent.target.result.split("\n");
		txtData = pointsTxt.join(",").replace(/\ +/g,"");
		if(that.formAdd.ticket_code!=""){
        	that.formAdd.ticket_code = that.formAdd.ticket_code+','+txtData;
		}else{
			that.formAdd.ticket_code =	txtData;
		}
		that.txtList = [];
      };
    }
  }
};
</script>

<style scope>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px !important;
  display: inline-block !important;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 14px;
}
.el-upload--text {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.el-upload--text .el-icon-plus {
  font-size: 28px;
}
.el-form-item__content {
  font-size: 13px !important;
}
.upload-demo {
  margin-top: 10px;
}
.upload-demo .el-upload--text {
  width: 150px;
  height: 32px;
  line-height: 32px;
  border: 0;
}
</style>
