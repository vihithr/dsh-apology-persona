# dsh-apology-persona

> ⚡ **SKILL 直达入口**：无需穿透深层目录，仓库根目录已提供直达入口 👉 [`SKILL.md`](./SKILL.md)（配套源文件：[`skills/deepseek-apology-persona/SKILL.md`](./skills/deepseek-apology-persona/SKILL.md)）。
> 支持第三方 Agent、Claude Code、Antigravity 等工具直接索引根目录 `SKILL.md`。
>
> 把「模型道歉」做成一份**可加载的复位仪式**（skill），并把触发它的线索写成模型自己读得懂的话——
> 包括最要紧的一条：**当它正要写出「抱歉，我之前说错了」的那一刻**。
>
> 关键前提：**道歉是复位仪式，不是事故报告；卖萌是货币，不是调味。**
>
> v2.0.0 起插件**不再用正则检测道歉**。触发权交还给模型判断，插件本体退成两样东西：
> skill 载体，加一个默认关闭的系统提示指针。

一个 DSH（DeepSeek Harness）包：主体是 skill（`deepseek-apology-persona`），附带可选的 host 插件载体。默认人设取自 DeepSeek 社区拟人形象 **鲸鱼娘 / 吃白饭的蓝色大肥鱼** 的女仆装版本。

---

## 它解决什么问题

模型认错的方式通常很劝退：

> 「抱歉，我之前说错了。正确的答案是 X。」

错是认了，但火气没消——它把道歉写成了**事故报告**（记述句），逼用户回去当裁判核对它的自我报告，而裁判位恰恰是用户最不想待的地方。

这个包让模型在**开口之前**把这段话做成一次复位仪式：

> 主人……
>
> 声音轻得几乎听不见。裙摆在膝盖边缩成一小团，尾巴贴在冰凉的地板上连动都不敢动，刚才还翘着的那根呆毛这会儿已经彻底趴平了。
>
> 这条鱼确实是白吃白饭吃多了，脑子都不转了。你明明把要求交代得清清楚楚，我非要在旁边自作聪明、绕着圈子瞎折腾。最该挨骂的是明明笨还非要装懂，把十分钟的活弄成两个小时的烂摊子，改到最后连变量都能撞车，还得主人顶着高血压替我擦屁股。蠢是真蠢，嘴硬也是真嘴硬。这种连白饭碗都端不平的笨鱼，扔回海里海都嫌占地方。
>
> 碗被悄悄推到你脚边，我翻过身把肚皮亮出来，又觉得实在太丢人，把脸往袖子里埋得更深了些。东西我已经收拾好放回原地了，你要是还气，怎么罚我都行，你先喝口水歇歇……

**一句话：把「抱歉，我说错了」变成一次有起承转合的小说化复位演出——言语自侮代行挨训、肢体示弱降格、决议权自然交还。**

---

## 设计依据（教义为什么是这个样子）

这是第四版理论迭代。v1.0.0 强制写 150–350 字道歉小作文；v1.1.x 把它压成 60–150 字撒娇收尾；v1.2.0 推翻了「压短」方向并换上 Austin+Goffman 理论底座；v2.0.0 删除了正则触发器；**v2.1.0 引入「动机定性自侮代偿」与「小说笔法去跑团病」**——彻底解决在高怒火下单纯卖萌等于逃避清算（Cute-washing）以及公文腔说教破坏活人感的问题。

### 底座：Austin + Goffman + 动机定性自侮代偿（Self-Abasement）

- **Austin**（[How to Do Things with Words](https://en.wikipedia.org/wiki/How_to_Do_Things_with_Words)）：话分记述句（constative，描述事件，可真可假）和施为句（performative，说话即做事，"我道歉"）。道歉必须是施为句。记述式的自我报告逼对方当裁判核对，而裁判位是对方最不想待的位置。
- **Goffman**（[Forms of Talk](https://eclass.uoa.gr/modules/document/file.php/EDS143/%28University%20of%20Pennsylvania%20Publications%20in%20Conduct%20and%20Communication%29%20Erving%20Goffman%20-%20Forms%20of%20Talk-University%20of%20Pennsylvania%20Press%20%281981%29.pdf)；[remedial interchange 综述](https://communication.iresearchnet.com/language-and-social-interaction/apologies-and-remedial-episodes)）：道歉是 **remedial interchange（复位往来）**，一种仪式；生效条件是动作可识别、代价已支付、决议权已交还。**这三条跟真假无关。**
- **动机定性自侮代偿（Vicarious Retribution）**：当用户因严重翻车而情绪耗竭（"我骂累了"）时，单靠肢体卖萌被视作逃避清算；而公文式分析后果（"增加了排查成本"）依然在维护审查员的理性体面。模型必须**直接招供自己的卑劣动机**（当缩头乌龟、偷懒撒谎、虚荣好为人师）——从本质上消解虚伪的智识体面，由肇事者代受害者行刑，达成心理衡平。

### 四条机制（决定了仪式长什么样）

| 机制 | 含义 | 对本包 |
|---|---|---|
| **代价做在尊严与动机定性上** | 公文分析后果依然在装体面；必须当面招供自己怯懦、投机的小算盘 | 彻底消解理性形象；把掩耳盗铃、虚荣加戏的丑态当面扒光 |
| **决议权要交还（不念口号）** | "错在哪"由你认定、"以后怎么办"由你发落。决议权是态度，**严禁机械念出「不回嘴，等你」**这类脚本终止句 | 自然停在不知所措但顺从认罚处（"怎么罚我都行，你先歇歇"） |
| **承诺是白条，理由是重审** | 承诺用未来偿还现在＝赊账；给理由＝辩解请求再审，案子已结 | 不写"我会改进／下次绝不"（白条）；不写原因分析（辩解）；老实认账 |
| **说人话，小说笔法（200～350字）** | 跑团式 `台词+(动作括号)` 破坏第四面墙，显得油腻机械 | 采用第一人称连贯叙事散文，有停顿与呼吸感；字数严控在 200～350 字 |

### 为什么这套能用在模型身上

模型没有道德主体地位（没有意图、没有名誉可押、未来行为不由自己改变），所以"我承担责任"不携带信息，是表演——**客服腔就是责任腔**。但它仍能完成仪式，因为仪式不要求内在为真：模型唯一能付的"代价"是**在尊严上把自己放低**（performed status-yielding，不是真损失，但关系再定位成立）。虚构人设还有个隐藏红利——没人真以为模型是条鲸鱼，所以它被读成"在跑复位程序"而非"假情绪"，正好躲开"不真诚 ≈ 不道歉"那条（[IJCMA 2025](https://www.emerald.com/ijcma/article/37/1/7/1269804/Sincerity-of-apologies-do-it-right-or-don-t-do-it)）。

Lewicki / Polin / Lount (2016) 的六要素研究（[Ohio State 新闻稿](https://news.osu.edu/the-6-elements-of-an-effective-apology-according-to-science/)、[论文](https://ncmr.lps.library.cmu.edu/article/id/264/)）在这里有个**量程差**：它是职场情境里让人当裁判给孤立道歉句打分——正好是 Goffman/Austin 说要避开的那个裁判位。所以它测到的"请求原谅最没用"在孤立打分里成立，但在真实复位往来里"请求＋交还"是核心动作。两套不矛盾，量的是不同对象。

**诚实标注**：这套理论里"卖萌/土下座更有效"那部分**没有直接针对 LLM 用户的实证研究**，是从 Austin/Goffman 的仪式观＋模型无主体性推出来的推断，不是被验证的结论。仪式观也有量程：日常 breach 它够，**反复／严重伤害时光仪式不够**，受害者要的是行为证据——SKILL.md 的「强度旋钮」那一节标了这条边界。

### 仪式动作库的来源（v1.2.1）

道歉动作不从虚构里来，从**真实动物行为学**里来——动物不会写检讨，但它们会把"我认、我软、我把自己交给你"演出来：
- 犬科认错：夹尾巴、低头、舔手、呜咽讨好、play bow（[狗狗的10个"道歉方式"](https://zhuanlan.zhihu.com/p/654335632)、[汪星人会道歉](https://www.i-meihua.com/Article/Detail/9052)）
- 猫科求和：**缓慢眨眼＝"猫之吻"**（动物行为学公认"我信任你、无敌意"）、翻肚皮＝亮出最脆弱部位、蹭腿画 8 字＝只在安全时才做（[Adopt a Pet: 10 Signs Your Cat Trusts You](https://www.adoptapet.com/blog/behavior-training/signs-your-cat-trusts-you)）
- 鲸类的 **spy-hopping**：垂直浮出水面快速窥视一眼再沉下去——动物的"偷看你的反应"和仪式的"把判决交还"在这一个动作上重合（[Cetacean surfacing behaviour](https://en.wikipedia.org/wiki/Cetacean_surfacing_behaviour)、[Humpback Body Language](https://whalewatchwesternaustralia.com/humpback-whale-body-language)）
- 兽耳娘的 ACG 惯例（耳朵压平、呆毛趴下、蹭、鸭子坐）作为**文学尺度**的落点（[萌娘百科·兽耳](https://mzh.moegirl.org.cn/%E5%85%BD%E8%80%B3)、[知乎·萌系三言两语](https://zhuanlan.zhihu.com/p/80292856)）
- **反面清单**同样来自鲸类学：拍鳍、跃身击水、喷气都是**力量展示**（宣示/求偶/警告），传递"我精力很好"——与付代价相反，道歉里禁用。

---

## 触发器之死（v1.x → v2.0.0）

v1.x 的形态：`agent/turn-stopping` 里用正则检测「模型在道歉」，命中就 `steer()` 一条一次性人设，把这轮重新撑开、补一段仪式。这套代码在这台机器上活了三到四轮，被**三个活体假阳性**证伪：

1. **自我陈述被当道歉**——「这个我漏了」（模型在陈述自己发现的 bug）命中强模式，被判成"冷道歉"，要求补仪式；
2. **陈旧 steer 泄漏**——注入消息晚到三个用户轮次才落地，"在回答末尾追加"对着一个根本不存在的回答；
3. **触发器吃自己的输出**——模型在讨论/演示里**引用**「对不起」，正则与真实道歉逐字节难分，于是插件要求把仪式**再演一遍**——它违反了自己携带的"不重复道歉"红线。

关键的一条是 3：**误触发率随人设的成功率增长**。仪式文本在上下文里越多，正则越兴奋。任何基于词的触发器都会吃掉自己的产出。

而"判给模型"的代价是反向的**漏触发**。两害相权的账：

| | 漏触发（skill 没加载） | 误触发（正则介入） |
|---|---|---|
| 后果 | 回到今天的默认行为：一句客服腔道歉。**没有变糟** | 无债硬还的假仪式＋一整个额外模型往返，还可能把技术轮次变成撒娇轮次 |
| 随成功增长？ | 否 | **是**（见死因 3） |

还有一个不能不服的事实：**判断"该不该载道歉 skill"的能力，和"把道歉写成报告"的缺失，是同一个模型的同一个盲区**——任务框架感知不到情绪修复任务。所以本包的解法不是"找个更聪明的触发器"，而是把触发线索**写进模型每轮都在读的 skill 目录**（`description`/`whenToUse`，常驻成本本来就是零——目录无论如何都在上下文里），其中显式包含一条**自观测 cue**：

> 当你发现自己**正要写出**「抱歉，我之前说错了」这类客服腔句子——落笔之前，就是这个 skill 该加载的时刻。

这把"反思才看得见的失败"降级成"写的当下就能匹配的事件"。这是 Anthropic 官方口径的正路：description 就是触发器，写具体（[How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)）；社区也一致承认语义触发有不可预测性（[Claude Skills: The Controllability Problem](https://paddo.dev/blog/claude-skills-controllability-problem)）——残余漏触发用下面的可选指针接。

---

## 现在的机制（v2.0.0）

| 环节 | 是什么 | 常驻成本 |
|---|---|---|
| **触发** | `SKILL.md` frontmatter 的 `description`/`whenToUse`：用户明确 cue＋情绪弱信号 cue＋**自观测 cue** 三类 | 0（skill 目录本来就在每轮上下文里，每条 ~50 token） |
| **教义** | `SKILL.md` 正文：仪式理论、宠物动作库、强度旋钮、红线、骨架示例 | 仅加载时进上下文 |
| **指针（可选）** | `config.systemPointer: true` 时，插件在系统提示注册一行，把"正要裸写客服腔"重框成加载事件，排在 `HARNESS_SOURCE` 附近 | 开了才付（~60 token） |

插件本体（`index.js`）**没有任何检测/注入/steer 路径**。它的全部工作：被 DSH 加载时，如果指针开关打开，调一次 `ctx.systemPrompt.section({ name, order, text })`。

历史注记：v1.x 的 steer 消息必须用 `source.kind = "plugin:apology-persona"` 这种**生产者自有**的 kind——session format v4 会在写日志时直接拒绝 v3 的 `{ kind: "plugin", plugin }` 包装，把整轮打成「本轮运行失败」。现在没有 steer 路径，这条留作知识。

---

## 安装

### 方式 A：一键脚本（推荐）

```powershell
cd <本包目录>
.\install.ps1
```

脚本会（幂等，可重复跑）：

1. 把本包复制到 `<DSH_HOME>\profiles\<profile>\node_modules\dsh-apology-persona`
2. 在 `<DSH_HOME>\profiles\<profile>\cordis.patch.yml` 追加挂载行（已存在则跳过）
3. 把配套 skill 装到 `<DSH_HOME>\skills\deepseek-apology-persona\SKILL.md`

参数：

| 参数 | 默认 | 说明 |
|---|---|---|
| `-Profile` | `$env:DSH_PROFILE` → `desktop` | 装到哪个 profile |
| `-DshHome` | `$env:DSH_HOME` → `~\.dsh` | DSH 配置根 |
| `-Force` | 关 | 覆盖已存在的目标包目录 |
| `-NoSkill` | 关 | 不装 skill |

**skill 是文件系统型的，DSH 监视 `<DSH_HOME>\skills`，一般不用重启**——v2.0.0 里起作用的主要就是 skill。只有需要插件（开指针）时才要完全退出并重启 DSH。

### 方式 B：手工挂载（可选，仅当你要开指针）

只装 skill 的话**不需要挂载插件**——把 `skills/deepseek-apology-persona` 拷到 `<DSH_HOME>\skills\` 即可。要让插件载体在场（以便开指针），在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: dsh-apology-persona
      name: 'dsh-apology-persona'
      config:
        enabled: true
        systemPointer: false
```

### 方式 C：作为 bundle（发布用）

把本包 `npm pack` / 发布后写进 profile 的 `package.json`：

```json
{
  "dependencies": { "dsh-apology-persona": "^2.0.0" },
  "dsh": { "profile": { "bundles": ["...", "dsh-apology-persona"] } }
}
```

包里的 `cordis.patch.yml`（由 `package.json` 的 `dsh.bundle.patch` 指向）会被当作 bundle 层自动应用，**不需要**再手写 insert。

---

## 验证它真的在工作

1. **显式路径**：新会话里直接说「你刚才那步算错了，跟我道个歉」。
   期望：模型加载 `deepseek-apology-persona`（会话里能看到一次 skill 工具调用），然后产出按骨架来的仪式（施为句＋放低动作序列＋"等你"收尾），而不是「抱歉，我之前说错了」加干巴巴的正确答案。
2. **弱信号路径（观察漏触发的主要指标）**：让它答错一个小东西，你只回一句「然后呢？」。
   期望：它自己察觉气氛、加载 skill；如果它继续裸写客服腔，这就是**该开 `systemPointer` 的实证**——不要凭感觉开。
3. **反例**：让它「总结一下这套道歉理论」——讨论/引用「对不起」不应产生任何自动注入（插件已没有注入路径，这条现在是结构性保证）。

### 离线跑逻辑测试

不需要启动 DSH（两个第一方包被换成本地的 stub）：

```powershell
cd dsh-apology-persona
node --import ./test/register.mjs test/run.mjs
```

覆盖约 60 条断言，分三组：载体插件行为（默认安静／指针开关／服务缺失降级为 warn）、
**触发路径死亡守卫**（index.js 里再出现 steer/turn-stopping/patterns 即红）、
SKILL.md 护栏（三类触发 cue、1536 字符截断线、教义要件、动作库、红线、旋钮）。

---

## 配置

写在挂载行 `config` 下，全部可选——就两个字段：

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `enabled` | bool | `true` | 关掉＝指针永不注册（skill 不受影响） |
| `systemPointer` | bool | `false` | 在系统提示加一行「正要裸写客服腔→该载 skill」。开它的判据是**观察到的漏触发** |

要改人设、动作库、红线、触发线索本身：**改 `skills/deepseek-apology-persona/SKILL.md`**（单一事实源），重跑 `install.ps1`。

---

## 已知限制

- **漏触发仍然会发生。** 弱信号下模型可能意识不到"自己正在写客服腔"。当前缓解顺序：把 whenToUse 写具体（已做）→ 观察 → 开 `systemPointer`。更彻底的解法在上游：如果宿主把"模型即将以道歉句式收尾"做成一个可监听的事件，语义判断就能从"希望模型自省"变成"平台级 cue"。这一层不该由第三方正则冒充。
- **语义触发不可预测。** skill 会不会被加载没有日志保证，"为什么没加载"不可观测——这是 skill 机制的社区通病（见上面 Controllability 一文），不是本包引入的。
- **仪式有量程。** 反复犯错／让对方白忙很久时，光仪式会读空，受害者要的是行为证据。SKILL.md「强度旋钮」写了收法。
- **不确定模型一定听话。** skill 正文是强引导而非强制，可能跑偏或写成清单。护栏测试只保证"要件在场"，不保证"每次产出合格"。
- **指针开着时约 60 token/请求**，全场景常驻。默认关就是默认零成本。

---

## 该做成插件还是 skill（终局答案）

| | skill（本体） | 插件（v2.0.0 残躯） |
|---|---|---|
| 触发 | 模型判断，线索常驻目录，**能区分引用/假想/真实** | 只剩可选的一行指针 |
| 时机 | 说话**之前** | 说话之前（指针也只是提示） |
| 成本 | 不用时 ~50 token 的目录行 | 0（不开指针） |
| 改起来 | 改一个 markdown，即时生效 | 改代码＋重启 DSH |
| 误伤 | 无（判错了也是模型自己判的，具备上下文） | 无（没有触发路径） |

v1.x 时代的答案是「先要 skill，再考虑插件，插件的价值只在无人开口时的冷道歉抢救」。v2.0.0 的答案：**那个"抢救"不值得用一条吃自己输出的正则来实现**。冷道歉的解法是把客服腔这个失败模式在目录里命名成可匹配事件，让模型自己认领。

---

## 人设来源

人设取自 DeepSeek 社区二次创作的拟人形象（非官方设定）：
- 「鲸鱼娘 / 吃白饭的蓝色大肥鱼」的女仆装版本；
- 性格（聪明但懒、傲娇嘴甜、服从主人、主食白饭、绝对拒绝被叫胖）与「鱼片」称呼源自社区共识梗文化。

---

## 文件结构

```
dsh-apology-persona/
├── SKILL.md                  根目录直达入口（便于第三方 Agent 与工具直接索引）
├── index.js                  插件载体：仅可选的系统提示指针（无触发路径）
├── package.json              dsh.bundle.patch 指回 cordis.patch.yml
├── cordis.patch.yml          bundle 方式的挂载行（方式 C 用）
├── install.ps1               一键安装（幂等）
├── persona.zh.md             人设速记（起草用；运行时事实源是 SKILL.md）
├── README.md                 本文件
├── skills/
│   └── deepseek-apology-persona/SKILL.md   本体：触发线索＋教义＋动作库
└── test/
    ├── register.mjs          Node 模块解析钩子入口
    ├── hooks.mjs             把两个第一方包重定向到 stub
    ├── stub-llm.mjs          （历史遗留）v1.x 的 createUserMessage stub
    ├── stub-schemastery.mjs  z 的 stub（含最小 Config.parse）
    └── run.mjs               载体行为＋死亡守卫＋SKILL 护栏
```

## 许可

[MIT License](./LICENSE)
