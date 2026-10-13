/**
 * dsh-apology-persona v2.0.0 离线测试。
 *
 * 运行：node --import ./test/register.mjs test/run.mjs
 *
 * v2.0.0 的测试重心从「触发器行为」移到三件事：
 *   A. 载体插件本身（默认什么都不注册；systemPointer 开关的注册行为）；
 *   B. **守卫触发路径已死**——index.js 里再出现 steer/turn-stopping/patterns 就红；
 *   C. SKILL.md 护栏——skill 是唯一教义事实源，它的触发线索（whenToUse 的
 *      用户侧＋自观测侧 cue）和仪式理论要件必须在场。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { apply, Config, SKILL_NAME, inject, name } from '../index.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.join(here, '..')

let passed = 0
let failed = 0
const heading = (t) => console.log('\n== ' + t)
const check = (label, ok, extra) => {
  if (ok) {
    passed++
  } else {
    failed++
    console.log('  ✗ ' + label + (extra ? '  [' + extra + ']' : ''))
  }
}

// ---------------------------------------------------------------- 1. 导出与形态

heading('1. 导出与包形态')
check('name 是 apology-persona', name === 'apology-persona')
check('inject 为空（不依赖任何 Service）', Array.isArray(inject) && inject.length === 0)
check('SKILL_NAME 指向配套 skill', SKILL_NAME === 'deepseek-apology-persona')
check('Config 可 parse 且默认 enabled/systemPointer 均为布尔', (() => {
  const c = Config.parse({})
  return typeof c.enabled === 'boolean' && typeof c.systemPointer === 'boolean'
})())
const pkgJson = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8'))
check('package.json 版本为 2.1.0', pkgJson.version === '2.1.0', pkgJson.version)
check('根目录提供直达 SKILL.md 且与 skills 目录一致', (() => {
  const rootSkill = path.join(pkg, 'SKILL.md')
  const nestedSkill = path.join(pkg, 'skills', 'deepseek-apology-persona', 'SKILL.md')
  return fs.existsSync(rootSkill) && fs.readFileSync(rootSkill, 'utf8') === fs.readFileSync(nestedSkill, 'utf8')
})())

// ---------------------------------------------------------------- 2. 触发路径已死

heading('2. 守卫：正则触发路径必须不存在')
const src = fs.readFileSync(path.join(pkg, 'index.js'), 'utf8')
for (const dead of [
  'agent/turn-stopping',
  'agent/pre-step',
  '.steer(',
  'createUserMessage',
  'buildInjection',
  'DEFAULT_STRONG_PATTERNS',
  'DEFAULT_APOLOGY_PATTERNS',
  'DEFAULT_ERROR_PATTERNS',
  'DEFAULT_WARMTH_PATTERNS',
  'DEFAULT_IMPACT_PATTERNS',
  'SOURCE_KIND',
  'maxPerSession',
  'onlyIfCold',
  'system-reminder',
]) {
  check(`index.js 不再包含 ${JSON.stringify(dead)}`, !src.includes(dead))
}
check('index.js 注释里记录了触发权移交给模型判断', src.includes('触发权交还给模型判断'))

// ---------------------------------------------------------------- 3. 默认 apply：安静

heading('3. 默认配置：什么都不注册')
function mockCtx(config, opts = {}) {
  const sections = []
  const events = []
  const warns = []
  const infos = []
  const ctx = {
    on: (t, f) => events.push(t),
    logger: { warn: (m) => warns.push(m), info: (m) => infos.push(m) },
    get: () => opts.noService ? undefined : ctx.systemPrompt,
  }
  if (!opts.noSystemPrompt) {
    ctx.systemPrompt = {
      section: (s) => { sections.push(s); return () => {} },
      getSectionOrder: (k) => (k === 'HARNESS_SOURCE' ? 42 : 0),
    }
  }
  apply(ctx, config)
  return { sections, events, warns, infos }
}
{
  const r = mockCtx({})
  check('默认不注册 systemPrompt section', r.sections.length === 0)
  check('默认不注册任何事件监听', r.events.length === 0)
  check('默认不产生 warning', r.warns.length === 0)
  const r2 = mockCtx(undefined)
  check('config 为 undefined 时同样安静', r2.sections.length === 0 && r2.events.length === 0)
}

// ---------------------------------------------------------------- 4. systemPointer 开关

heading('4. systemPointer: true 时注册指针')
{
  const r = mockCtx({ systemPointer: true })
  check('注册了恰好一个 section', r.sections.length === 1)
  const s = r.sections[0]
  check('section.name 正确', s?.name === 'APOLOGY_PERSONA_POINTER', JSON.stringify(s?.name))
  check('section.order 对齐 HARNESS_SOURCE', s?.order === 42, String(s?.order))
  check('文本点名 skill', s?.text.includes(SKILL_NAME))
  check('文本含自观测 cue（客服腔句子）', s?.text.includes('客服腔') && s?.text.includes('抱歉，我之前说错了'))
  check('文本把加载判据推给 whenToUse（不重复教义）', s?.text.includes('whenToUse'))
  check('指针注册记一条 info（可观测）', r.infos.length === 1)

  const off = mockCtx({ systemPointer: true, enabled: false })
  check('enabled:false 时指针也不注册', off.sections.length === 0)

  const noSvc = mockCtx({ systemPointer: true }, { noSystemPrompt: true, noService: true })
  check('systemPrompt 服务缺失时降级为 warn 而非抛错', noSvc.sections.length === 0 && noSvc.warns.length === 1)
}

// ---------------------------------------------------------------- 5. SKILL.md 触发线索

heading('5. SKILL.md：触发线索（这是现在唯一的触发器）')
const skillPath = path.join(pkg, 'skills', 'deepseek-apology-persona', 'SKILL.md')
const skillRaw = fs.readFileSync(skillPath, 'utf8')
const fm = /^---\n([\s\S]*?)\n---/.exec(skillRaw)
check('frontmatter 存在', !!fm)
const front = fm ? fm[1] : ''
const desc = /^description:\s*(.+)$/m.exec(front)?.[1] ?? ''
const when = /^whenToUse:\s*(.+)$/m.exec(front)?.[1] ?? ''
const body = skillRaw.slice(fm ? fm[0].length : 0)

check('name 字段与 SKILL_NAME 一致', front.includes('name: ' + SKILL_NAME))
check('description 承载核心立场（复位仪式，不是事故报告）', desc.includes('复位仪式') && desc.includes('事故报告'))
check('whenToUse 有用户侧 cue（明确要道歉/哄）', when.includes('哄我') && when.includes('认错'))
check('whenToUse 有弱信号侧 cue（带刺/然后呢）', when.includes('然后呢') && when.includes('带刺'))
check('whenToUse 有自观测 cue（正要写客服腔）——治任务框架盲区的关键', when.includes('正要写出') && when.includes('客服腔'))
check('自观测 cue 把时刻说死（落笔之前）', when.includes('落笔之前') || when.includes('写出口之前') || when.includes('该加载的时刻'))
check('description+whenToUse 在 1536 字符截断线内', (desc + when).length <= 1536, `len=${desc.length + when.length}`)

// ---------------------------------------------------------------- 6. SKILL.md 教义要件

heading('6. SKILL.md：教义要件')
check('Austin：施为句 vs 记述句', body.includes('施为句') && body.includes('记述句'))
check('Goffman：复位仪式/往来', body.includes('remedial interchange') || body.includes('复位往来'))
check('机制一：代价做在尊严上', body.includes('做在尊严上'))
check('机制二：决议权交还（等你）', body.includes('决议权') && body.includes('等你'))
check('机制三：白条与重审', body.includes('白条') && body.includes('重审'))
check('动作库三层齐备（降格/依附/献礼与等待）', body.includes('降格') && body.includes('依附') && body.includes('献礼'))
check('宠物化动作在库（蹭裤腿/缓慢眨眼/露肚皮/spy-hopping）',
  body.includes('蹭裤腿') && body.includes('缓慢眨眼') && body.includes('露肚皮') && body.includes('spy-hopping'))
check('展示性动作禁用清单在库（拍鳍/跃身）', body.includes('拍鳍') && body.includes('跃身'))
check('红线禁承诺（我会改进）', body.includes('我会改进'))
check('红线禁原因（请求再审）', body.includes('不写原因分析') || body.includes('请求再审'))
check('人设要件（只说中文/白饭/绝不认胖/主人）',
  body.includes('只说中文') && body.includes('白饭') && body.includes('绝不承认自己胖') && body.includes('主人'))
check('强度旋钮（量程边界）在库', body.includes('强度旋钮') && body.includes('行为证据'))
check('新教义：言语自侮与动机定性在库', body.includes('自侮') && body.includes('动机定性'))
check('新规范：字数约束 200～350 字在库', body.includes('200 ～ 350 字') && body.includes('严禁剧本格式'))
check('新红线：禁止机械口号收尾（不回嘴，等你）', body.includes('不回嘴，等你'))
check('新红线：禁止公文审查员腔', body.includes('公文审查员腔'))
check('骨架示例是小说化演出不是清单', body.includes('额头贴在地板上') && body.includes('怎么罚我都行'))

// ---------------------------------------------------------------- 7. 挂载与文件卫生

heading('7. 挂载与文件卫生')
const bundlePatch = fs.readFileSync(path.join(pkg, 'cordis.patch.yml'), 'utf8')
check('bundle patch 挂载本插件', bundlePatch.includes('dsh-apology-persona'))
check('bundle patch 不再携带死配置的键', !bundlePatch.includes('maxPerSession') && !bundlePatch.includes('onlyIfCold') && !bundlePatch.includes('oncePerTurn'))
check('bundle patch 携带 systemPointer', bundlePatch.includes('systemPointer'))
const personaDoc = fs.readFileSync(path.join(pkg, 'persona.zh.md'), 'utf8')
check('persona.zh.md 声明 SKILL.md 为单一事实源', personaDoc.includes('SKILL.md') && (personaDoc.includes('单一事实源') || personaDoc.includes('唯一事实源')))
check('README 记录了触发器之死', fs.readFileSync(path.join(pkg, 'README.md'), 'utf8').includes('触发器之死'))

// ---------------------------------------------------------------- 汇总

console.log(`\n通过 ${passed} / 失败 ${failed}`)
if (failed === 0) console.log('全部通过。')
else process.exitCode = 1
