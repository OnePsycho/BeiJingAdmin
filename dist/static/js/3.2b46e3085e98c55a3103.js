webpackJsonp([3],{"9bBU":function(e,t,i){i("mClu");var a=i("FeBl").Object;e.exports=function(e,t,i){return a.defineProperty(e,t,i)}},"9s1Z":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,l=i("bOdI"),r=i.n(l),s=i("mw3O"),o=i.n(s),n={name:"basetable",data:function(){return{url:"",tableData:[],apiUrl:domain.apiUrl,cur_page:1,filter_page:1,multipleSelection:[],select_word:"",del_list:[],is_search:!1,editVisible:!1,addVisible:!1,delVisible:!1,dialogImageUrl:"",dialogVisible:!1,content:"",timePickerValue:"",form:{},formAdd:{},idx:-1,loading:!0,rules:{name:[{required:!0,trigger:"blur",message:"专区名称不能为空"},{min:1,max:10,message:"长度在 1 到 10 个字符",trigger:"blur"}],description:[{required:!0,trigger:"blur",message:"专区描述不能为空"},{min:1,max:20,message:"长度在 1 到 20 个字符",trigger:"blur"}]},currentId:0,totalNum:0,pageSize:10,product_img_limit:1,deleteIdArr:[],imgListNoHeader:[],imgUploadUrl:""}},created:function(){this.getData()},watch:{$route:function(e){"/area"==e.path&&(this.select_word="",this.getData())}},computed:{data:function(){return this.tableData}},methods:(a={handleCurrentChange:function(e){this.cur_page=e,this.filter_page=e,this.filterDate()},select_word_change:function(e){this.filter_page=1},getData:function(){var e=this;this.select_word="",this.url=this.apiUrl+"/g01jfsc_zk65m/area/getAreaList?index="+this.cur_page+"&page_size="+this.pageSize,this.$axios.get(this.url).then(function(t){e.tableData=t.data.data.list,e.loading=!1,e.totalNum=t.data.data.totalElements})},handleEdit:function(e,t,i){this.imgListNoHeader=[],this.idx=t,this.currentId=e;var a=this.tableData[t];this.imgListNoHeader.push({url:this.apiUrl+a.picture}),this.form={name:a.name,description:a.description,url:a.picture},this.editVisible=!0},handleDelete:function(e,t,i){this.idx=t,this.currentId=e,this.delVisible=!0},delAll:function(){var e=this;this.deleteIdArr=[];var t=this.multipleSelection.length;if(0==t)this.$message.error("请选择删除项！");else{this.del_list=this.del_list.concat(this.multipleSelection);for(var i=0;i<t;i++)this.multipleSelection[i].name+" ",this.deleteIdArr.push(this.multipleSelection[i].area_id);this.$axios.post(this.apiUrl+"/g01jfsc_zk65m/area/deleteArea",{area_id:this.deleteIdArr,paramsSerializer:function(e){return o.a.stringify(e,{indices:!1})}}).then(function(t){200==t.data.code&&(e.getData(),e.$message.success("删除成功!"),e.multipleSelection=[],e.deleteIdArr=[])})}},handleSelectionChange:function(e){this.multipleSelection=e},saveEdit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.$axios.put(t.apiUrl+"/g01jfsc_zk65m/area/updateArea",{area_id:t.currentId,name:t.form.name,description:t.form.description,picture:t.imgUploadUrl}).then(function(e){200==e.data.code&&(t.getData(),t.editVisible=!1,t.$message.success("修改第 "+(t.idx+1)+" 行成功"))})})},saveAdd:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.$axios.post(t.apiUrl+"/g01jfsc_zk65m/area/addArea",{name:t.formAdd.name,description:t.formAdd.description,picture:t.imgUploadUrl}).then(function(e){200==e.data.code&&(t.getData(),t.addVisible=!1,t.$message.success("添加成功"),t.formAdd={})})})},deleteRow:function(){var e=this;this.deleteIdArr.push(this.currentId),this.$axios.post(this.apiUrl+"/g01jfsc_zk65m/area/deleteArea",{area_id:this.deleteIdArr,paramsSerializer:function(e){return o.a.stringify(e,{indices:!1})}}).then(function(t){200==t.data.code&&(e.getData(),e.tableData.splice(e.idx,1),e.$message.success("删除成功"),e.delVisible=!1,e.deleteIdArr=[])})},handlePictureCardPreview:function(e){this.dialogImageUrl=e.url,this.dialogVisible=!0},addAction:function(){this.imgListNoHeader=[],this.form={},this.formAdd={},this.addVisible=!0},handleSizeChange:function(e){this.pageSize=e,this.getData()},limitTip:function(){this.$message("图片数量已达最大限制！")},handleRemove:function(e,t){console.log(e,t),0==t.length&&this.$message("图片不能为空！")},uploadImg:function(e){var t=this;this.imgListNoHeader=[];var i=new FormData;i.append("file",e.file),this.$axios.post(this.apiUrl+"/g01jfsc_zk65m/upload/imgUpload",i).then(function(e){200==e.data.code?(t.$message.success("上传成功"),t.imgListNoHeader.push({url:t.apiUrl+e.data.data.url}),t.imgUploadUrl=e.data.data.url,console.log(t.imgListNoHeader)):t.$message.warn("上传失败！请重试")})}},r()(a,"handleSizeChange",function(e){this.pageSize=e,this.filterDate()}),r()(a,"filterDate",function(){var e=this;this.$axios.get(this.apiUrl+"/g01jfsc_zk65m/area/getAreaList?page_size="+this.pageSize+"&index="+this.filter_page+"&keyword="+this.select_word).then(function(t){console.log(t),e.tableData=t.data.data.list,e.totalNum=t.data.data.totalElements,e.pageSize=t.data.data.pageSize,0==t.data.data.list.length&&(e.filter_page=1,e.filterDate())})}),a)},d={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"table"},[i("div",{staticClass:"crumbs"},[i("el-breadcrumb",{attrs:{separator:"/"}},[i("el-breadcrumb-item",[i("i",{staticClass:"el-icon-goods"}),e._v("  专区管理")])],1)],1),e._v(" "),i("div",{staticClass:"container"},[i("div",{staticClass:"handle-box"},[i("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"筛选关键词"},on:{input:e.select_word_change},model:{value:e.select_word,callback:function(t){e.select_word=t},expression:"select_word"}}),e._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:e.filterDate}},[e._v("筛选")]),e._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:e.getData}},[e._v("重置")]),e._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"success"},on:{click:e.addAction}},[e._v("新增")]),e._v(" "),i("el-button",{staticClass:"handle-del mr10",staticStyle:{"margin-left":"0px"},attrs:{type:"danger",icon:"el-icon-delete"},on:{click:e.delAll}},[e._v("批量删除")])],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticClass:"table",attrs:{data:e.data,border:"",stripe:""},on:{"selection-change":e.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),e._v(" "),i("el-table-column",{attrs:{prop:"name",label:"专区名称",width:"280"}}),e._v(" "),i("el-table-column",{attrs:{prop:"description",label:"专区描述",width:"280"}}),e._v(" "),i("el-table-column",{attrs:{prop:"create_time",label:"创建时间",align:"center",sortable:""}}),e._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center",width:"280px"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"primary",icon:"el-icon-edit"},on:{click:function(i){e.handleEdit(t.row.area_id,t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),i("el-button",{attrs:{type:"danger",icon:"el-icon-delete"},on:{click:function(i){e.handleDelete(t.row.area_id,t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),i("div",{staticClass:"pagination"},[i("el-pagination",{attrs:{background:"",layout:"total, sizes, prev, pager, next, jumper",total:e.totalNum,align:"center","page-sizes":[5,10,15,20]},on:{"current-change":e.handleCurrentChange,"size-change":e.handleSizeChange}})],1)],1),e._v(" "),i("el-dialog",{attrs:{title:"编辑",visible:e.editVisible,width:"580px"},on:{"update:visible":function(t){e.editVisible=t}}},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"专区名称",prop:"name"}},[i("el-input",{attrs:{placeholder:"请输入专区名称"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"专区描述",prop:"description"}},[i("el-input",{attrs:{placeholder:"请输入专区描述"},model:{value:e.form.description,callback:function(t){e.$set(e.form,"description",t)},expression:"form.description"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"专区配图",prop:"picture"}},[i("el-upload",{attrs:{action:"","list-type":"picture-card","auto-upload":!0,name:"file","http-request":e.uploadImg,"on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove,limit:e.product_img_limit,"on-exceed":e.limitTip,"file-list":e.imgListNoHeader},model:{value:e.form.picture,callback:function(t){e.$set(e.form,"picture",t)},expression:"form.picture"}},[i("i",{staticClass:"el-icon-plus"})]),e._v(" "),i("P",{staticClass:"text"},[e._v("请保证图片格式正确，建议分辨率为326*186")])],1)],1),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.editVisible=!1}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveEdit("form")}}},[e._v("确 定")])],1)],1),e._v(" "),i("el-dialog",{attrs:{title:"新增",visible:e.addVisible,width:"580px"},on:{"update:visible":function(t){e.addVisible=t}}},[i("el-form",{ref:"formAdd",attrs:{model:e.formAdd,rules:e.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"专区名称",prop:"name"}},[i("el-input",{attrs:{placeholder:"请输入专区名称"},model:{value:e.formAdd.name,callback:function(t){e.$set(e.formAdd,"name",t)},expression:"formAdd.name"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"专区描述",prop:"description"}},[i("el-input",{attrs:{placeholder:"请输入专区描述"},model:{value:e.formAdd.description,callback:function(t){e.$set(e.formAdd,"description",t)},expression:"formAdd.description"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"专区配图",prop:"picture"}},[i("el-upload",{attrs:{action:"","list-type":"picture-card","auto-upload":!0,name:"file","http-request":e.uploadImg,"on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove,limit:e.product_img_limit,"on-exceed":e.limitTip,"file-list":e.imgListNoHeader},model:{value:e.formAdd.picture,callback:function(t){e.$set(e.formAdd,"picture",t)},expression:"formAdd.picture"}},[i("i",{staticClass:"el-icon-plus"})]),e._v(" "),i("P",{staticClass:"text"},[e._v("请保证图片格式正确，建议分辨率为326*186")])],1)],1),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.addVisible=!1}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveAdd("formAdd")}}},[e._v("确 定")])],1)],1),e._v(" "),i("el-dialog",{attrs:{title:"提示",visible:e.delVisible,width:"300px",center:""},on:{"update:visible":function(t){e.delVisible=t}}},[i("div",{staticClass:"del-dialog-cnt"},[e._v("删除不可恢复，是否确定删除？")]),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.delVisible=!1}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:e.deleteRow}},[e._v("确 定")])],1)])],1)},staticRenderFns:[]};var c=i("VU/8")(n,d,!1,function(e){i("huO/")},"data-v-ce69cdf8",null);t.default=c.exports},C4MV:function(e,t,i){e.exports={default:i("9bBU"),__esModule:!0}},bOdI:function(e,t,i){"use strict";t.__esModule=!0;var a,l=i("C4MV"),r=(a=l)&&a.__esModule?a:{default:a};t.default=function(e,t,i){return t in e?(0,r.default)(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}},"huO/":function(e,t){},mClu:function(e,t,i){var a=i("kM2E");a(a.S+a.F*!i("+E39"),"Object",{defineProperty:i("evD5").f})}});