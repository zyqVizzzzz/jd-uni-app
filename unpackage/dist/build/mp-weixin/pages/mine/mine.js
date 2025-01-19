"use strict";const e=require("../../common/vendor.js"),a=require("../../utils/require.js"),o=require("../../api/points.js"),t=require("../../utils/eventBus.js");require("../../config.js"),Math||n();const n=()=>"../../components/LoginPopup.js",i={__name:"mine",setup(n){const i=e.ref(null),s=e.ref("device"),r=e.ref({nickname:"",avatarUrl:"",bio:"",following:0,followers:0,points:0}),l=e.ref([]),c=e.ref(0),u=e=>{c.value=e.detail.current};e.onMounted((()=>{const a=e.index.getStorageSync("userInfo");if(a)try{r.value=JSON.parse(a)}catch(o){console.error("解析本地用户信息失败:",o)}d((()=>{v(),p(),f()})),t.emitter.on("updateUserInfo",(()=>{console.log("收到更新事件"),v(),p(),f()}))})),e.onShow((()=>{const a=e.index.getStorageSync("userInfo");if(a)try{r.value=JSON.parse(a)}catch(o){console.error("解析本地用户信息失败:",o)}d((()=>{v(),p(),f()}))}));const d=a=>{if(!e.index.getStorageSync("token"))return m(),!1;a()},v=async()=>{try{const o=await a.request({url:"/users/me"});200===o.data.code&&(r.value=o.data.data,e.index.setStorageSync("userInfo",JSON.stringify(o.data.data)))}catch(o){console.error("获取用户信息失败:",o),e.index.showToast({title:"获取用户信息失败",icon:"none"})}},g=e.ref(0),p=async()=>{try{const e=await o.pointApi.getUserPoints();200===e.data.code&&(g.value=e.data.data.totalPoints)}catch(e){}},f=async()=>{const o=JSON.parse(e.index.getStorageSync("userInfo")).openid;try{const e=await a.request({url:"/devices/user/"+o});200===e.data.code&&(l.value=e.data.data)}catch(t){console.error("获取设备列表失败:",t),e.index.showToast({title:"获取设备列表失败",icon:"none"})}},m=()=>{i.value.open()},x=e=>{console.log(e)},y=()=>{},S=e=>{s.value=e},w=()=>{e.index.navigateTo({url:"/pages/setting/setting"})},h=()=>{e.index.navigateTo({url:"/pages/points/points"})},q=()=>{e.index.navigateTo({url:"/pages/followingList/followingList"})},T=()=>{e.index.navigateTo({url:"/pages/contactCostumer/contactCostumer"})},j=()=>{e.index.navigateTo({url:"/pages/message/message"})};return(a,o)=>e.e({a:r.value.avatarUrl||"/static/avatar.png",b:e.t(r.value.nickname||"未设置昵称"),c:e.t(r.value.bio||""),d:e.t(r.value.following||0),e:e.o(q),f:e.t(r.value.followers||0),g:e.o(q),h:e.t(g.value||0),i:e.o(h),j:"device"===s.value},(s.value,{}),{k:"device"===s.value?1:"",l:e.o((e=>S("device"))),m:"medal"===s.value},(s.value,{}),{n:"medal"===s.value?1:"",o:e.o((e=>S("medal"))),p:"device"===s.value},"device"===s.value?{q:e.f(l.value,((a,o,t)=>({a:e.t(a.device_name),b:"online"===a.device_status?1:"",c:e.t("online"===a.device_status?"已连接":"未连接"),d:o}))),r:e.o((o=>(a.device,void e.index.navigateTo({url:"/pages/device/device"})))),s:e.o(((...e)=>a.handleAddDevice&&a.handleAddDevice(...e))),t:c.value,v:e.o(u)}:{},{w:"medal"===s.value},(s.value,{}),{x:e.o(w),y:e.o(j),z:e.o(T),A:e.sr(i,"093d7f73-0",{k:"loginPopupRef"}),B:e.o(x),C:e.o(y)})}};wx.createPage(i);
