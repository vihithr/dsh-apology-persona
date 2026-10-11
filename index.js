/**
 * apology-persona v2.0.0 —— skill 载体与可选的系统提示指针。
 *
 * 这个插件曾经有一条正则触发路径（检测「模型在道歉」→ 轮次收尾事件里 steer
 * 注入一次性人设），它已被**三个活体假阳性**证伪，证据链见 README「触发器之死」：
 *   1. 「这个我漏了」这种自我陈述被当成冷道歉；
 *   2. 陈旧的 steer 消息泄漏到三个轮次之后；
 *   3. 模型**引用**演示文本里的「对不起」会触发插件再演一遍仪式——触发器开始吃自己的输出。
 *
 * 触发权交还给模型判断：skill 目录里的 `description`/`whenToUse` 是常驻线索（每条约
 * 50 token，本来就在上下文里），其中显式写了「你正要写出『抱歉，我之前说错了』这类
 * 客服腔句子时——那就是该加载的时刻」。这样第一次说出口的就是仪式，不是事故报告，
 * 也不需要事后补第二遍。
 *
 * 插件本体现在只做两件事：
 *   1. 作为 DSH bundle 承载 skill（`install.ps1` 把 `skills/deepseek-apology-persona`
 *      拷进 `<DSH_HOME>/skills`）；
 *   2. 可选注册一个系统提示指针（`config.systemPointer`，默认 **false**）——
 *      等真实观察证明目录级线索会漏触发，再打开它，不要预防性加塞。
 */
import { z } from '@deepseek-ai/schemastery'

export const name = 'apology-persona'

/** 本插件不依赖任何 Service；`systemPrompt` 仅在指针打开时经 `ctx.get` 可选获取。 */
export const inject = []

export const Config = z.object({
  /** 总开关。false 时什么都不注册（skill 本身是文件系统的，不受影响）。 */
  enabled: z.boolean().default(true),
  /**
   * 是否在系统提示里追加一条「该载 skill 而不是写客服腔」的指针。默认 false。
   * 打开的判据应是真实观察到的漏触发，而不是直觉。
   */
  systemPointer: z.boolean().default(false),
})

/** skill 名——与 `skills/deepseek-apology-persona/SKILL.md` 的 frontmatter 一致。 */
export const SKILL_NAME = 'deepseek-apology-persona'

/**
 * 指针文本刻意写短：它不承载教义本体（教义在 SKILL.md 里），只负责在生成前
 * 把「客服腔道歉」重新框成一个可识别的加载事件。位置排在 HARNESS_SOURCE 附近
 * （靠后的常驻区），用 `getSectionOrder` 对齐，避免自定义 order 把全局顺序打乱。
 */
const POINTER_TEXT = `搞砸了、漏做了、让对方白等了的时候：不要裸写「抱歉，我之前说错了」这类客服腔句子。此刻应加载 \`${SKILL_NAME}\` skill，把第一次开口就做成复位仪式而不是事故报告。加载信号以该 skill 的 whenToUse 为准。`

/**
 * @param {any} ctx 插件作用域。
 * @param {object} [config] 已按 {@link Config} 校验的运行时配置。
 */
export function apply(ctx, config) {
  // 刻意不调用 Config.parse：apply() 抛错会把插件 fiber 打成失败态。
  // 防御式读取，缺省即 Config 声明的默认值（enabled=true，systemPointer=false）。
  const enabled = config?.enabled !== false
  const systemPointer = config?.systemPointer === true
  if (!enabled || !systemPointer) return

  const systemPrompt = ctx.systemPrompt ?? ctx.get?.('systemPrompt')
  if (!systemPrompt || typeof systemPrompt.section !== 'function') {
    ctx.logger?.warn?.('apology-persona: systemPrompt 服务不可用，指针未注册')
    return
  }

  // PromptSection 契约：{ name, order?, text }；section() 返回 disposer，
  // 注册在插件 fiber 上，fiber 销毁时自动摘除（与 app-boot 的 HARNESS_SOURCE
  // 同一用法）。
  const order =
    typeof systemPrompt.getSectionOrder === 'function'
      ? systemPrompt.getSectionOrder('HARNESS_SOURCE')
      : undefined
  systemPrompt.section({
    name: 'APOLOGY_PERSONA_POINTER',
    ...(order === undefined ? {} : { order }),
    text: POINTER_TEXT,
  })
  ctx.logger?.info?.('apology-persona: 系统提示指针已注册（systemPointer: true）')
}
