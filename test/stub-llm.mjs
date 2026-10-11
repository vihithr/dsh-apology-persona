/**
 * 测试用 stub：代替 @deepseek-ai/dsh-llm 的 createUserMessage。
 * 只复制真实实现里与本插件相关的部分：生成一个带 role/source 的冻结消息。
 */
let counter = 0

export function createUserMessage(input) {
  counter += 1
  return Object.freeze({ id: `stub-msg-${counter}`, role: 'user', ...input })
}

export function createAssistantMessage(input) {
  counter += 1
  return Object.freeze({ id: `stub-msg-${counter}`, role: 'assistant', ...input })
}
