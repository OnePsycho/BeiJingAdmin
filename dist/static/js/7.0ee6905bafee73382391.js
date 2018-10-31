webpackJsonp([7],{"/KTk":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("mw3O"),l=i.n(a),r={name:"basetable",data:function(){return{url:"",tableData:[],apiUrl:domain.apiUrl,cur_page:1,multipleSelection:[],select_word:"",del_list:[],is_search:!1,editVisible:!1,addVisible:!1,delVisible:!1,dialogImageUrl:"",dialogVisible:!1,content:"",timePickerValue:"",form:{name:"",create_time:""},formAdd:{name:"",create_time:""},idx:-1,loading:!0,rules:{name:[{required:!0,trigger:"blur"},{min:1,max:10,message:"长度在 1 到 10 个字符",trigger:"blur"}]},currentId:0,totalNum:0,pageSize:10,deleteIdArr:[]}},created:function(){this.getData()},computed:{data:function(){return this.tableData}},methods:{handleCurrentChange:function(t){this.cur_page=t,this.getData()},filterAction:function(){var t=this;console.log(this.select_word),this.url=this.apiUrl+"/g01jfsc_zk65m/product_category/getProductCategoryList?index=1&page_size="+this.pageSize+"&keyword="+this.select_word,this.$axios.get(this.url).then(function(e){t.tableData=e.data.data.list,t.loading=!1,t.totalNum=e.data.data.totalElements})},getData:function(){var t=this;this.select_word="",this.url=this.apiUrl+"/g01jfsc_zk65m/product_category/getProductCategoryList?index="+this.cur_page+"&page_size="+this.pageSize,this.$axios.get(this.url).then(function(e){t.tableData=e.data.data.list,t.loading=!1,t.totalNum=e.data.data.totalElements})},handleEdit:function(t,e,i){this.idx=e,this.currentId=t;var a=this.tableData[e];this.form={name:a.name},this.editVisible=!0},handleDelete:function(t,e,i){this.idx=e,this.currentId=t,this.delVisible=!0},delAll:function(){var t=this;this.deleteIdArr=[];var e=this.multipleSelection.length;if(0==e)this.$message.error("请选择删除项！");else{this.del_list=this.del_list.concat(this.multipleSelection);for(var i=0;i<e;i++)this.multipleSelection[i].name+" ",this.deleteIdArr.push(this.multipleSelection[i].product_category_id);this.$axios.post(this.apiUrl+"/g01jfsc_zk65m/product_category/deleteProductCategory",{product_category_id:this.deleteIdArr,paramsSerializer:function(t){return l.a.stringify(t,{indices:!1})}}).then(function(e){200==e.data.code&&(t.getData(),t.$message.success("删除成功!"),t.multipleSelection=[],t.deleteIdArr=[])})}},handleSelectionChange:function(t){this.multipleSelection=t},saveEdit:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return console.log("error submit!!"),!1;e.$axios.put(e.apiUrl+"/g01jfsc_zk65m/product_category/updateProductCategory",{product_category_id:e.currentId,name:e.form.name}).then(function(t){200==t.data.code&&(e.getData(),e.editVisible=!1,e.$message.success("修改第 "+(e.idx+1)+" 行成功"))})})},saveAdd:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return console.log("error submit!!"),!1;e.$axios.post(e.apiUrl+"/g01jfsc_zk65m/product_category/addProductCategory",{name:e.formAdd.name}).then(function(t){200==t.data.code&&(e.getData(),e.addVisible=!1,e.$message.success("添加成功"),e.formAdd={})})})},deleteRow:function(){var t=this;this.deleteIdArr.push(this.currentId),this.$axios.post(this.apiUrl+"/g01jfsc_zk65m/product_category/deleteProductCategory",{product_category_id:this.deleteIdArr,paramsSerializer:function(t){return l.a.stringify(t,{indices:!1})}}).then(function(e){200==e.data.code&&(t.getData(),t.tableData.splice(t.idx,1),t.$message.success("删除成功"),t.delVisible=!1,t.deleteIdArr=[])})},handlePictureCardPreview:function(t){this.dialogImageUrl=t.url,this.dialogVisible=!0},addAction:function(){this.addVisible=!0},handleSizeChange:function(t){this.pageSize=t,this.getData()}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"table"},[i("div",{staticClass:"crumbs"},[i("el-breadcrumb",{attrs:{separator:"/"}},[i("el-breadcrumb-item",[i("i",{staticClass:"el-icon-menu"}),t._v("  分类管理")])],1)],1),t._v(" "),i("div",{staticClass:"container"},[i("div",{staticClass:"handle-box"},[i("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"筛选关键词"},model:{value:t.select_word,callback:function(e){t.select_word=e},expression:"select_word"}}),t._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:t.filterAction}},[t._v("筛选")]),t._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:t.getData}},[t._v("重置")]),t._v(" "),i("el-button",{staticClass:"handle-del mr10",attrs:{type:"success"},on:{click:function(e){t.addVisible=!0}}},[t._v("新增")]),t._v(" "),i("el-button",{staticClass:"handle-del mr10",staticStyle:{"margin-left":"0px"},attrs:{type:"danger",icon:"el-icon-delete"},on:{click:t.delAll}},[t._v("批量删除")])],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticClass:"table",attrs:{data:t.data,border:"",stripe:""},on:{"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),t._v(" "),i("el-table-column",{attrs:{prop:"name",label:"类别名称",width:"280"}}),t._v(" "),i("el-table-column",{attrs:{prop:"create_time",label:"创建时间",align:"center",sortable:""}}),t._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center",width:"280px"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{type:"primary",icon:"el-icon-edit"},on:{click:function(i){t.handleEdit(e.row.product_category_id,e.$index,e.row)}}},[t._v("编辑")]),t._v(" "),i("el-button",{attrs:{type:"danger",icon:"el-icon-delete"},on:{click:function(i){t.handleDelete(e.row.product_category_id,e.$index,e.row)}}},[t._v("删除")])]}}])})],1),t._v(" "),i("div",{staticClass:"pagination"},[i("el-pagination",{attrs:{background:"",layout:"total, sizes, prev, pager, next, jumper",total:t.totalNum,align:"center","page-sizes":[20,40]},on:{"current-change":t.handleCurrentChange,"size-change":t.handleSizeChange}})],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"编辑",visible:t.editVisible,width:"580px"},on:{"update:visible":function(e){t.editVisible=e}}},[i("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"类别名称",prop:"name"}},[i("el-input",{attrs:{placeholder:"请选择商品类别"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1)],1),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(e){t.saveEdit("form")}}},[t._v("确 定")])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"新增",visible:t.addVisible,width:"580px"},on:{"update:visible":function(e){t.addVisible=e}}},[i("el-form",{ref:"formAdd",attrs:{model:t.formAdd,rules:t.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"类别名称",prop:"name"}},[i("el-input",{attrs:{placeholder:"输入类别名称"},model:{value:t.formAdd.name,callback:function(e){t.$set(t.formAdd,"name",e)},expression:"formAdd.name"}})],1)],1),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.addVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(e){t.saveAdd("formAdd")}}},[t._v("确 定")])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"提示",visible:t.delVisible,width:"300px",center:""},on:{"update:visible":function(e){t.delVisible=e}}},[i("div",{staticClass:"del-dialog-cnt"},[t._v("删除不可恢复，是否确定删除？")]),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.deleteRow}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var o=i("VU/8")(r,s,!1,function(t){i("FNY3")},"data-v-3b1b0fbb",null);e.default=o.exports},FNY3:function(t,e){}});