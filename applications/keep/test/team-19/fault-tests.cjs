const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base=process.env.BASE_URL || 'http://127.0.0.1:4175';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw Error('Run only on the local course application');
const btn=(p,name)=>p.getByRole('button',{name,exact:true});
const note=(p,title)=>p.getByRole('region',{name:title,exact:true});
async function create(p,title,content){
  await btn(p,'Take a note').click();
  const editor=p.getByRole('dialog',{name:'Note editor',exact:true});
  await editor.getByRole('textbox',{name:'Title',exact:true}).fill(title);
  await editor.getByRole('textbox',{name:'Content',exact:true}).fill(content);
  await btn(editor,'Close').click();
  await note(p,title).waitFor();
}
async function home(p){await p.goto(base);await btn(p,'Take a note').waitFor();}
const cases={
  'search-active-notes-from-archive':async p=>{
    await home(p);
    const tag=`T19-${Date.now()}`;
    const active=`${tag} Active`, archived=`${tag} Archive`;
    await create(p,active,'Unique active content');
    await create(p,archived,'Unique archive content');
    await btn(note(p,archived),`Archive ${archived}`).click();
    await btn(p.getByRole('navigation',{name:'Sidebar',exact:true}),'Archived').click();
    await note(p,archived).waitFor();
    await p.getByRole('searchbox',{name:'Search',exact:true}).fill(tag);
    assert.deepEqual([await note(p,active).count(),await note(p,archived).count()],[1,0],'Keyword search must return matching active notes, not archived notes');
  },
  'rename-label-to-existing-name':async p=>{
    await home(p);
    const prefix=`T19-${Date.now()}`;
    const a=`${prefix}-A`, b=`${prefix}-B`;
    const sidebar=p.getByRole('navigation',{name:'Sidebar',exact:true});
    await btn(sidebar,'Edit Labels').click();
    const d=p.getByRole('dialog',{name:'Edit Labels',exact:true});
    for(const name of [a,b]){
      await d.getByRole('textbox',{name:'New label',exact:true}).fill(name);
      await btn(d,'Create label').click();
      await d.getByRole('textbox',{name:`Label name ${name}`,exact:true}).waitFor();
    }
    await d.getByRole('textbox',{name:`Label name ${a}`,exact:true}).fill(b);
    await btn(d,`Save label ${a}`).click();
    await btn(d,'Done').click();
    const count=await btn(sidebar,b).count();
    await p.reload();
    await sidebar.waitFor();
    const reloadedCount=await btn(sidebar,b).count();
    assert.deepEqual([count,reloadedCount],[1,1],`Rename produced ${count} sidebar actions with identical business label ${b}; after reload: ${reloadedCount}`);
  }
};
async function main(){
  const browser=await chromium.launch({headless:true});let failures=0;
  try {for(const [name,run] of Object.entries(cases)){
    if(process.argv[2]&&process.argv[2]!==name)continue;
    const context=await browser.newContext();const p=await context.newPage();p.setDefaultTimeout(5000);
    try{await run(p);console.log(`PASS ${name}`);}catch(error){failures++;console.error(`${error.code==='ERR_ASSERTION'?'FAIL':'ERROR'} ${name}: ${error.message}`);}finally{await context.close();}
  }}finally{await browser.close();}
  process.exitCode=failures?1:0;
}
main().catch(error=>{console.error(error);process.exitCode=2;});
