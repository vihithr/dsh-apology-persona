/**
 * 测试用 stub：代替 @deepseek-ai/schemastery 的 z。
 * 只提供本包真正用到的最小面：链式 default() 和 Config.parse()。
 */
const make = (kind) => {
  const node = {
    kind,
    default(value) {
      node.defaultValue = value
      return node
    },
    required() {
      node.isRequired = true
      return node
    },
    step() {
      return node
    },
    min() {
      return node
    },
    max() {
      return node
    },
  }
  return node
}

const z = {
  string: () => make('string'),
  number: () => make('number'),
  boolean: () => make('boolean'),
  array: () => make('array'),
  object: (shape) => ({
    kind: 'object',
    shape,
    // 最小 parse：按字段 defaultValue 补齐缺失键，其余透传。
    parse(value) {
      const out = {}
      for (const [k, field] of Object.entries(shape ?? {})) {
        const v = value?.[k]
        out[k] = v === undefined ? field?.defaultValue : v
      }
      return out
    },
  }),
}

export { z }
export default z
