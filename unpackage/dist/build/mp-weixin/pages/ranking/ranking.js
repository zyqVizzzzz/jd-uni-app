"use strict";const a=require("../../common/vendor.js"),e=require("../../utils/require.js"),t=require("../../api/userRelations.js");if(require("../../config.js"),!Array){a.resolveComponent("uni-popup")()}Math;const r={__name:"ranking",setup(r){const n=a.ref("national"),l=a.ref("杭州");a.ref("浙江省");const i=a.ref("day"),o=a.ref([]),s=a.ref(null),u=a.ref([]),d=a.ref(null),c=a.ref([]);a.ref(0),a.ref(null);const v=a.ref(!1),y=a.ref(""),g=a.computed((()=>u.value&&Array.isArray(u.value)?u.value:[])),f=()=>{d.value.close(),v.value=!1},m=async()=>{await e.request({url:"/rankings/generate-mock-data",method:"POST"})},p=async(t="daily")=>{try{let a;if(a="national"===n.value?await e.request({url:"/rankings",data:{type:t,limit:20}}):await e.request({url:"/rankings/region",data:{type:t,city:l.value,cityCode:y.value}}),200===a.data.code){const e=a.data.data;u.value=e.slice(0,3).map((a=>({name:a.user_id.nickname,avatar:a.user_id.avatarUrl,isFollowing:a.user_id.isFollowing,score:((a.total_distance||0)/1e3).toFixed(2),rank:a.rank,userId:a.user_id._id}))),o.value=e.slice(3).map((a=>({name:a.user_id.nickname,avatar:a.user_id.avatarUrl,isFollowing:a.user_id.isFollowing,distance:((a.total_distance||0)/1e3).toFixed(2),rank:a.rank,userId:a.user_id._id})))}}catch(r){console.error("获取排行榜失败:",r),a.index.showToast({title:"获取排行榜失败",icon:"none"})}},k=async()=>{var a,t;try{const r=await e.request({url:"/rankings/me",data:{type:"day"===i.value?"daily":"month"===i.value?"monthly":"yearly"}});if(200===r.data.code){const e=r.data.data;s.value=e?{rank:e.rank||0,name:(null==(a=e.user_id)?void 0:a.nickname)||"未知用户",avatar:(null==(t=e.user_id)?void 0:t.avatarUrl)||"/static/default-avatar.png",distance:((e.total_distance||0)/1e3).toFixed(2)}:{rank:0,name:"未知用户",avatar:"/static/default-avatar.png",distance:0}}}catch(r){console.error("获取个人排名失败:",r),s.value={rank:0,name:"未知用户",avatar:"/static/default-avatar.png",distance:0}}},w=async a=>{i.value=a;await p({day:"daily",month:"monthly",year:"yearly"}[a]),await k()};return a.onMounted((()=>{p(),k()})),a.onShow((()=>{p(),k()})),(e,r)=>a.e({a:a.o(m),b:a.o(f),c:a.f(c.value,((e,t,r)=>({a:a.t(e.city),b:a.t(e.userCount),c:e.cityCode,d:a.o((a=>{return t=e,l.value=t.city,y.value=t.cityCode,f(),void p(i.value);var t}),e.cityCode)}))),d:a.sr(d,"25b49241-0",{k:"cityPopup"}),e:a.p({type:"center","background-color":"#fff"}),f:"day"===i.value?1:"",g:a.o((a=>w("day"))),h:"month"===i.value?1:"",i:a.o((a=>w("month"))),j:"year"===i.value?1:"",k:a.o((a=>w("year"))),l:a.f(g.value,((e,r,n)=>a.e({a:e},e?{b:e.avatar||"/static/avatar-default@3x.png",c:a.t(e.rank),d:a.t(e.name),e:a.t(e.score),f:a.t(e.isFollowing?"已关注":"关注"),g:a.o((r=>(async e=>{try{let a;a=e.isFollowing?await t.userRelationsApi.unfollowUser(e.userId):await t.userRelationsApi.followUser(e.userId),200!==a.data.code&&201!==a.data.code||(u.value=u.value.map((a=>a.userId===e.userId?{...a,isFollowing:!a.isFollowing}:a)),o.value=o.value.map((a=>a.userId===e.userId?{...a,isFollowing:!a.isFollowing}:a)))}catch(r){console.error("关注操作失败:",r),a.index.showToast({title:r.message||"操作失败",icon:"none"})}})(e)),r),h:e.isFollowing?1:"",i:a.n(1===e.rank?"yellow":2===e.rank?"orange":"pink")}:{j:e.avatar||"/static/avatar-default@3x.png",k:a.t(0===r?2:1===r?1:3),l:a.n(0===r?"orange":1===r?"yellow":"pink")},{m:r}))),m:o.value.length>0},o.value.length>0?{n:a.f(o.value,((e,t,r)=>({a:a.t(e.rank),b:e.avatar||"/static/avatar-default@3x.png",c:a.t(e.name),d:a.t(e.distance),e:e.rank})))}:{},{o:a.t(s.value.rank),p:s.value.avatar||"/static/avatar-default@3x.png",q:a.t(s.value.name),r:a.t(s.value.distance)})}};wx.createPage(r);
