webpackJsonp([5],{"9SKD":function(t,e){},hcRw:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={name:"basetable",data:function(){return{url:"",tableData:[],activeName:1,cur_page:0,filter_page:0,apiUrl:domain.apiUrl,multipleSelection:[],select_type:"",select_status:"",select_username:"",select_phone:"",select_email:"",del_list:[],is_search:!1,editVisible:!1,projectVisible:!1,flagVisible:!1,modifyVisible:!1,delVisible:!1,dialogImageUrl:"",dialogVisible:!1,content:"",timePickerValue:[],editorOption:{placeholder:"使用规则、使用流程..."},form:{},idx:-1,loading:!0,totalNum:0,pageSize:10,currentId:0,deleteIdArr:[],projectInfos:{},tags:[],currentTags:[],inputVisible:!1,inputValue:"",newTags:[],userStatus:{checkPending:"审核中",normal:"正常",refused:"未通过"},userTypes:{designingInstitute:"研究院",firstParty:"甲方",freeDesigner:"自由设计师"}}},created:function(){this.getData()},components:{},watch:{$route:function(t){"/user"==t.path&&this.getData()}},computed:{data:function(){return this.tableData}},methods:{handleCurrentChange:function(t){this.cur_page=t,this.filter_page=t,this.filterDate()},select_word_change:function(t){this.filter_page=0},selectChange:function(t){this.cur_page=0,this.filter_page=0,this.filterDate()},selectChangeByPage:function(t){var e=this;this.url=this.apiUrl+"",this.$axios.get(this.url).then(function(t){console.log(t),e.tableData=t.data.data.list,e.totalNum=t.data.data.totalElements})},getData:function(){var t=this;this.select_type="",this.select_status="",this.select_username="",this.select_phone="",this.select_email="",this.url=this.apiUrl+"/client/api/member/findPage?type=freeDesigner",this.$axios.get(this.url).then(function(e){for(var a in console.log(e),t.tableData=e.data.content,t.userStatus)for(var i=0;i<e.data.content.length;i++)a==e.data.content[i].status&&(e.data.content[i].status=t.userStatus[a]);for(var a in t.userTypes)for(i=0;i<e.data.content.length;i++)a==e.data.content[i].type&&(e.data.content[i].type=t.userTypes[a]);t.loading=!1,t.totalNum=e.data.totalElements})},handleDetails:function(t,e,a){var i=this;this.idx=e,this.currentId=t,this.timePickerValue=[],this.form={},this.$axios.get(this.apiUrl+"/client/api/member/findById?id="+t).then(function(t){console.log(t),200==t.status&&(i.$nextTick(function(){for(var e=[],a=0;a<t.data.memberExt.personnelTypes.length;a++)e.push(t.data.memberExt.personnelTypes[a].name);for(var i in this.form={username:t.data.memberExt.u_name,phoneNum:t.data.memberExt.u_phoneNum,email:t.data.memberExt.u_email,realName:t.data.memberExt.realName,birthday:t.data.memberExt.birthday,sex:t.data.memberExt.sex?"男":"女",workTime:t.data.memberExt.workTime,graduate:t.data.memberExt.graduateInstitutions,personnelTypes:e.join(","),type:t.data.type,flags:t.data.memberExt.flags},this.userTypes)i==this.form.type&&(this.form.type=this.userTypes[i])}),i.editVisible=!0)})},handleProjects:function(t,e,a){var i=this;this.idx=e,this.currentId=t,this.timePickerValue=[],this.$axios.get(this.apiUrl+"/client/api/member/findById?id="+t).then(function(t){200==t.status&&(console.log(t.data),i.$nextTick(function(){this.projectInfos=t.data.projectInfos}),i.projectVisible=!0)})},handleModify:function(t,e,a){var i=this;this.idx=e,this.currentId=t,this.timePickerValue=[],this.$axios.get(this.apiUrl+"/client/api/member/findById?id="+t).then(function(t){200==t.status&&(i.$nextTick(function(){this.form={username:t.data.memberExt.u_name,type:t.data.type,status:t.data.status,id:t.data.id}}),i.modifyVisible=!0)})},handleFlag:function(t,e,a){var i=this;this.idx=e,this.currentId=t,this.timePickerValue=[],this.tags=[],this.$axios.get(this.apiUrl+"/client/api/member/findById?id="+t).then(function(t){200==t.status&&(i.flagVisible=!0,t.data.memberExt.flags?i.currentTags=t.data.memberExt.flags.split(","):i.currentTags=[])}),this.$axios.get(this.apiUrl+"/client/api/flag/findAll").then(function(t){if(200==t.status)for(var e=0;e<t.data.length;e++)i.tags.push(t.data[e].name)})},handleDelete:function(t,e,a){this.idx=e,this.currentId=t,this.delVisible=!0},delAll:function(){var t=this;this.deleteIdArr=[];var e=this.multipleSelection.length;if(0==e)this.$message.error("请选择删除项！");else{this.del_list=this.del_list.concat(this.multipleSelection);for(var a=0;a<e;a++)this.multipleSelection[a].order_code+" ",this.deleteIdArr.push(this.multipleSelection[a].id);this.$axios({method:"post",url:this.apiUrl+"/client/api/member/deleteByIds",data:{ids:this.deleteIdArr,_method:"delete"},transformRequest:[function(t){var e="";for(var a in t)e+=encodeURIComponent(a)+"="+encodeURIComponent(t[a])+"&";return e}]}).then(function(e){t.getData(),t.tableData.splice(t.idx,1),t.$message.success("删除成功"),t.delVisible=!1,t.deleteIdArr=[]})}},handleSelectionChange:function(t){this.multipleSelection=t},deleteRow:function(){var t=this;this.deleteIdArr.push(this.currentId),this.$axios({method:"post",url:this.apiUrl+"/client/api/member/deleteByIds",data:{ids:this.deleteIdArr,_method:"delete"},transformRequest:[function(t){var e="";for(var a in t)e+=encodeURIComponent(a)+"="+encodeURIComponent(t[a])+"&";return e}]}).then(function(e){t.getData(),t.tableData.splice(t.idx,1),t.$message.success("删除成功"),t.delVisible=!1,t.deleteIdArr=[]})},handleRemove:function(t,e){console.log(t,e)},addAction:function(){this.addVisible=!0},handleSizeChange:function(t){this.pageSize=t,this.filterDate()},filterDate:function(){var t=this;this.$axios.get(this.apiUrl+"/client/api/member/findPage?size="+this.pageSize+"&page="+this.filter_page+"&memberName="+this.select_username+"&phoneNum="+this.select_phone+"&email="+this.select_email+"&type="+this.select_type+"&status="+this.select_status).then(function(e){for(var a in console.log(e),t.userStatus)for(var i=0;i<e.data.content.length;i++)a==e.data.content[i].status&&(e.data.content[i].status=t.userStatus[a]);for(var a in t.userTypes)for(i=0;i<e.data.content.length;i++)a==e.data.content[i].type&&(e.data.content[i].type=t.userTypes[a]);t.tableData=e.data.content,t.totalNum=e.data.totalElements})},handleClose:function(t){console.log(t,this.currentTags),this.currentTags.splice(this.currentTags.indexOf(t),1),-1!=this.newTags.indexOf(t)&&this.newTags.splice(this.newTags.indexOf(t),1)},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick(function(e){t.$refs.saveTagInput.$refs.input.focus()})},handleInputConfirm:function(){var t=this.inputValue;console.log(this.currentTags),t&&(-1==this.currentTags.indexOf(t)?(this.currentTags.push(t),-1==this.newTags.indexOf(t)&&-1==this.tags.indexOf(t)&&(console.log(this.tags),this.newTags.push(t))):this.$message("该标签已存在")),this.inputVisible=!1,this.inputValue=""},saveFlagChange:function(){var t=this;this.flagVisible=!1;for(var e=[],a=0;a<this.newTags.length;a++)e.push({name:this.newTags[a]});this.$axios.post(this.apiUrl+"/client/api/flag/adds",e).then(function(t){console.log(t)}),this.$axios({method:"post",url:this.apiUrl+"/client/api/memberExt/update",data:{flags:this.currentTags,memberId:this.currentId,_method:"PUT"},transformRequest:[function(t){var e="";for(var a in t)e+=encodeURIComponent(a)+"="+encodeURIComponent(t[a])+"&";return e}]}).then(function(e){200==e.status&&t.$message.success("设置成功!")})},tagClick:function(t){var e=this.currentTags;this.tags;console.log(t),-1==e.indexOf(t)?e.push(t):this.$message("已有此标签！")},saveStatusChange:function(){var t=this;this.modifyVisible=!1,console.log(this.form.status);var e=new FormData;e.append("id",this.currentId),e.append("status",this.form.status),e.append("_method","PUT"),this.$axios.post(this.apiUrl+"/client/api/member/update",e).then(function(e){200==e.status&&(t.$message.success("修改成功!"),t.getData())})}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-tickets"}),t._v("  用户管理")])],1)],1),t._v(" "),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"用户身份"},on:{change:t.selectChange},model:{value:t.select_type,callback:function(e){t.select_type=e},expression:"select_type"}},[a("el-option",{key:"1",attrs:{label:"甲方",value:"firstParty"}}),t._v(" "),a("el-option",{key:"3",attrs:{label:"设计师",value:"freeDesigner"}})],1),t._v(" "),a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"用户状态"},on:{change:t.selectChange},model:{value:t.select_status,callback:function(e){t.select_status=e},expression:"select_status"}},[a("el-option",{key:"1",attrs:{label:"正常",value:"normal"}}),t._v(" "),a("el-option",{key:"2",attrs:{label:"审核中",value:"checkPending"}}),t._v(" "),a("el-option",{key:"3",attrs:{label:"未通过",value:"refused"}})],1),t._v(" "),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"手机号"},on:{input:t.select_word_change},model:{value:t.select_phone,callback:function(e){t.select_phone=e},expression:"select_phone"}}),t._v(" "),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"邮箱"},on:{input:t.select_word_change},model:{value:t.select_email,callback:function(e){t.select_email=e},expression:"select_email"}}),t._v(" "),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"success"},on:{click:t.filterDate}},[t._v("筛选")]),t._v(" "),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:t.getData}},[t._v("显示全部")]),t._v(" "),a("el-button",{staticClass:"handle-del mr10",staticStyle:{"margin-left":"0px"},attrs:{type:"danger",icon:"el-icon-delete"},on:{click:t.delAll}},[t._v("批量删除")])],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticClass:"table",attrs:{data:t.data,border:"",stripe:""},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"id",label:"编号",align:"center",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"phoneNum",label:"手机号",align:"center",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"email",label:"邮箱地址",align:"center",width:"200"}}),t._v(" "),a("el-table-column",{attrs:{prop:"status",label:"状态",align:"center",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"注册时间",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"loginTime",label:"最近登录",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center",width:"500px"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",icon:"el-icon-tickets"},on:{click:function(a){t.handleDetails(e.row.id,e.$index,e.row)}}},[t._v("查看详细")]),t._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-tickets"},on:{click:function(a){t.handleProjects(e.row.id,e.$index,e.row)}}},[t._v("项目经验")]),t._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-tickets"},on:{click:function(a){t.handleModify(e.row.id,e.$index,e.row)}}},[t._v("修改状态")]),t._v(" "),a("el-button",{attrs:{type:"danger",icon:"el-icon-tickets"},on:{click:function(a){t.handleDelete(e.row.id,e.$index,e.row)}}},[t._v("删除")]),t._v(" "),a("el-button",{attrs:{type:"success",icon:"el-icon-delete"},on:{click:function(a){t.handleFlag(e.row.id,e.$index,e.row)}}},[t._v("设置标签")])]}}])})],1),t._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"","current-page":t.cur_page,layout:"total, sizes, prev, pager, next, jumper",total:t.totalNum,align:"center","page-sizes":[5,10,15,20]},on:{"current-change":t.handleCurrentChange,"size-change":t.handleSizeChange}})],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"用户详情",visible:t.editVisible,width:"620px"},on:{"update:visible":function(e){t.editVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px",disabled:!0}},[a("el-form-item",{attrs:{label:"手机号"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.phoneNum))])]),t._v(" "),a("el-form-item",{attrs:{label:"邮箱"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.email))])]),t._v(" "),a("el-form-item",{attrs:{label:"真实姓氏"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.realName))])]),t._v(" "),a("el-form-item",{attrs:{label:"出生年月"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.birthday))])]),t._v(" "),a("el-form-item",{attrs:{label:"性别"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.sex))])]),t._v(" "),a("el-form-item",{attrs:{label:"毕业院校"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.graduate))])]),t._v(" "),a("el-form-item",{attrs:{label:"从业年限"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.workTime))])]),t._v(" "),a("el-form-item",{attrs:{label:"擅长领域"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.personnelTypes))])]),t._v(" "),a("el-form-item",{attrs:{label:"身份"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.type))])]),t._v(" "),a("el-form-item",{attrs:{label:"标签"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.flags))])])],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.editVisible=!1}}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"项目经验",visible:t.projectVisible,width:"620px"},on:{"update:visible":function(e){t.projectVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.projectInfos,"label-width":"100px"}},[t.projectInfos.length>0?a("el-collapse",{model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},t._l(t.projectInfos,function(e){return a("el-collapse-item",{key:e.id,staticClass:"projectTitle",attrs:{title:e.name}},[a("div",[t._v("项目类型："+t._s(e.platformType.name))]),t._v(" "),a("div",[t._v("业主名称："+t._s(e.ownerName))]),t._v(" "),a("div",[t._v("业主级别："+t._s(e.ownerLevel))]),t._v(" "),a("div",[t._v("资产规模："+t._s(e.assetScale))]),t._v(" "),a("div",[t._v("业主成功案例："+t._s(e.ownerCases))]),t._v(" "),a("div",[t._v("项目落成时间："+t._s(e.finishDate))]),t._v(" "),a("div",[t._v("项目所在地："+t._s(e.city))]),t._v(" "),a("div",[t._v("项目规模："+t._s(e.scale))]),t._v(" "),a("div",[t._v("项目角色："+t._s(e.role))]),t._v(" "),a("div",[t._v("参与时间："+t._s(e.startDate)+" 至 "+t._s(e.endDate))])])})):a("p",[t._v("暂无项目经验")])],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.projectVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.projectVisible=!1}}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"修改状态",visible:t.modifyVisible,width:"620px"},on:{"update:visible":function(e){t.modifyVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"编号",prop:"product_category_name"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.id))])]),t._v(" "),a("el-form-item",{attrs:{label:"用户名",prop:"product_category_name"}},[a("div",{staticClass:"form-label"},[t._v(t._s(t.form.username))])]),t._v(" "),a("el-form-item",{attrs:{label:"修改状态",prop:"status"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},[a("el-option",{key:"1",attrs:{label:"审核中",value:"checkPending"}}),t._v(" "),a("el-option",{key:"2",attrs:{label:"正常",value:"normal"}}),t._v(" "),a("el-option",{key:"3",attrs:{label:"未通过",value:"refused"}})],1)],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.modifyVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.saveStatusChange}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"设置标签",visible:t.flagVisible,width:"620px"},on:{"update:visible":function(e){t.flagVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px"},nativeOn:{submit:function(t){t.preventDefault()}}},[a("p",{staticClass:"tag-title"},[t._v("已有标签")]),t._v(" "),t._l(t.currentTags,function(e){return a("el-tag",{key:e.index,attrs:{"disable-transitions":!1,closable:""},on:{close:function(a){t.handleClose(e)}},model:{value:t.currentTags,callback:function(e){t.currentTags=e},expression:"currentTags"}},[t._v("\n\t\t\t\t"+t._s(e)+"\n\t\t\t")])}),t._v(" "),t.inputVisible?a("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:t.handleInputConfirm},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?e.target.blur(e):null}},model:{value:t.inputValue,callback:function(e){t.inputValue=e},expression:"inputValue"}}):a("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:t.showInput}},[t._v("+ 添加")]),t._v(" "),a("p",{staticClass:"tag-title"},[t._v("可选标签")]),t._v(" "),t._l(t.tags,function(e){return a("el-tag",{key:e.index,attrs:{size:"medium",type:"info"},nativeOn:{click:function(a){t.tagClick(e)}},model:{value:t.tags,callback:function(e){t.tags=e},expression:"tags"}},[t._v("\n\t\t\t\t"+t._s(e)+"\n\t\t\t")])})],2),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.flagVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.saveFlagChange}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"提示",visible:t.delVisible,width:"300px",center:""},on:{"update:visible":function(e){t.delVisible=e}}},[a("div",{staticClass:"del-dialog-cnt"},[t._v("删除不可恢复，是否确定删除？")]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.deleteRow}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var l=a("VU/8")(i,s,!1,function(t){a("9SKD")},"data-v-702f76e6",null);e.default=l.exports}});