import assert from 'node:assert/strict';
// @ts-ignore Node type stripping supports .ts imports
import {seed,adopt,advance,renew,metrics,revenueSeries} from './app/store.ts';
let d:any=structuredClone(seed);assert.equal(metrics(d).claimed,87);assert.equal(metrics(d).users,82);assert.equal(metrics(d).revenue,42213);assert.equal(revenueSeries(d)[6],42213);
d=adopt(d,{name:'测试用户',phone:'13912345678',city:'杭州',tree:'A088',plan:'家庭认领',date:'2026-09-14',method:'邮寄',address:'演示地址'});let u=d.users.at(-1);assert.equal(metrics(d).revenue,42712);assert.equal(d.trees[87].user,u.id);assert.throws(()=>adopt(d,{phone:'13912345679',tree:'A088'}));
d.orders.push({id:'TEST',tree:'A088',user:u.id,year:2026,status:'待成熟',method:'邮寄'});assert.throws(()=>advance(d,'TEST'));d.trees[87].stage='成熟';d=advance(d,'TEST');d=advance(d,'TEST');d=advance(d,'TEST');assert.throws(()=>advance(d,'TEST'));Object.assign(d.orders.at(-1),{tracking:'DEMO1',carrier:'顺丰',address:'演示地址',shipDate:'2026-09-28'});d=advance(d,'TEST');d=advance(d,'TEST');d=advance(d,'TEST');assert.equal(d.orders.at(-1).status,'已完成');d=renew(d,u.id,499);assert.equal(d.users.at(-1).history.at(-1).year,2027);assert.equal(metrics(d).revenue,42712);assert.throws(()=>renew(d,u.id,499));console.log('PASS: allocations, revenue, duplicate protection, maturity gate, shipping requirements, completion, renewal and annual isolation');

