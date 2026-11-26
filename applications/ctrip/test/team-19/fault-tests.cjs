const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
if (!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw Error('Run only on the local course application');
const btn = (p, name) => p.getByRole('button', { name, exact: true });
const field = (p, name) => p.getByRole('textbox', { name, exact: true });
const region = (p, name) => p.getByRole('region', { name, exact: true });
async function date(p, label, iso) { await field(p,label).click(); await btn(p,iso).click(); }
async function home(p) { await p.goto(base); await p.getByRole('heading',{name:'Ctrip Travel',exact:true}).waitFor(); }
async function route(p, origin, destination, iso) {
  await field(p,'Origin').fill(origin);
  await field(p,'Destination').fill(destination);
  await date(p,'Departure date',iso);
  await btn(p,'Search flights').click();
  await p.getByRole('heading',{name:'Flight results',exact:true}).waitFor();
}
async function flightNames(p) {
  return region(p,'Flight list').getByRole('listitem').evaluateAll(items =>
    items.map(item => item.getAttribute('aria-label')));
}

const cases = {
  'empty-route-fare': async p => {
    await home(p);
    await route(p,'Beihai','Mars City','2026-07-23');
    await p.getByRole('heading',{name:'No flights found',exact:true}).waitFor();
    const choice = btn(region(p,'Date bar'),'2026-07-22');
    const advertised = await choice.innerText();
    await choice.click();
    await p.waitForURL(url=>url.hash.includes('date=2026-07-22'));
    await p.waitForFunction(()=>document.querySelector('input#result-date')?.value==='2026-07-22');
    await p.getByRole('heading',{name:'No flights found',exact:true}).waitFor();
    assert.equal(await field(p,'Departure date').inputValue(),'2026-07-22');
    assert.ok(!/¥\s*\d+/.test(advertised), `No matching flights on July 22, but date bar advertises ${JSON.stringify(advertised)}`);
  },
  'typed-past-date': async p => {
    await home(p);
    await field(p,'Departure date').fill('2026-07-18');
    const navigation = p.waitForURL(url=>url.hash.startsWith('#/flights'),{timeout:2000}).then(()=>true,()=>false);
    await btn(p,'Search flights').click();
    // A direct type into the editable field must not turn a date that the
    // public calendar rejects into a valid search. No specific alert required.
    assert.equal(await navigation,false,'Past departure date was accepted and results opened');
  },
  'sort-after-unsubmitted-date': async p => {
    await home(p);
    await route(p,'Chengdu','Guangzhou','2026-07-21');
    const expected = ['Flight CZ3401','Flight JD5162','Flight MU5234'];
    assert.deepEqual((await flightNames(p)).sort(),expected,'Initial published inventory');
    await date(p,'Departure date','2026-07-22');
    // Selecting a date edits the criteria; Update results has not been clicked.
    assert.deepEqual((await flightNames(p)).sort(),expected,'Before sorting, the original flight list remains visible');
    await btn(p,'Price: low to high').click();
    assert.deepEqual(await flightNames(p),expected,'Sorting must preserve the three currently displayed flight identities');
  },
  'history-loses-preferences': async p => {
    await home(p);
    await p.getByRole('checkbox',{name:'Traveling with children',exact:true}).check();
    await p.getByRole('combobox',{name:'Cabin class',exact:true}).selectOption('Business');
    await route(p,'Chengdu','Guangzhou','2026-07-22');
    assert.equal(await p.getByRole('combobox',{name:'Cabin class',exact:true}).inputValue(),'Business');
    assert.ok(await p.getByText('Children included',{exact:true}).isVisible());
    await p.reload();
    await p.getByRole('heading',{name:'Flight results',exact:true}).waitFor();
    await p.getByRole('link',{name:'Home',exact:true}).click();
    await p.getByRole('heading',{name:'Ctrip Travel',exact:true}).waitFor();
    const saved = region(p,'Search history').getByRole('button',{name:'Chengdu - Guangzhou',exact:true}).filter({hasText:'2026-07-22'});
    await saved.click();
    await p.getByRole('heading',{name:'Flight results',exact:true}).waitFor();
    assert.equal(await field(p,'Departure date').inputValue(),'2026-07-22');
    const restored = {
      cabin: await p.getByRole('combobox',{name:'Cabin class',exact:true}).inputValue(),
      children: await p.getByText('Children included',{exact:true}).isVisible()
    };
    assert.deepEqual(restored,{cabin:'Business',children:true},'Reusing a saved search should retain its traveler and cabin preferences');
  }
};

async function main() {
  const browser = await chromium.launch({headless:true});
  let failures = 0;
  try {
    for (const [name, run] of Object.entries(cases)) {
      if (process.argv[2] && process.argv[2] !== name) continue;
      const context = await browser.newContext(); const page = await context.newPage();
      page.setDefaultTimeout(5000);
      try { await run(page); console.log(`PASS ${name}`); }
      catch(error) { failures++; console.error(`${error.code === 'ERR_ASSERTION' ? 'FAIL' : 'ERROR'} ${name}: ${error.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
  process.exitCode = failures ? 1 : 0;
}
main().catch(error=>{console.error(error);process.exitCode=2;});
