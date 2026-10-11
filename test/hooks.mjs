/**
 * Node 模块解析钩子：把两个第一方包重定向到本目录下的 stub，
 * 这样不必启动 DSH 也能 import 插件并跑测试。
 *
 * 用法：node --import ./test/register.mjs test/run.mjs
 */
export async function resolve(specifier, context, next) {
  if (specifier === '@deepseek-ai/dsh-llm') {
    return { url: new URL('./stub-llm.mjs', import.meta.url).href, shortCircuit: true }
  }
  if (specifier === '@deepseek-ai/schemastery') {
    return { url: new URL('./stub-schemastery.mjs', import.meta.url).href, shortCircuit: true }
  }
  return next(specifier, context)
}
