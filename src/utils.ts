import compact from 'lodash/compact'
import join from 'lodash/join'

/**
 * 删除注释、PHP 标签，并且把代码变成一行
 *
 * @param code 从文件读取的代码
 * @return 处理为一行的代码
 */
export function minifyPHPCode (code: string): string {
  // 移除 php tag
  code = code.replace(/^<\?(php)?/, '')
  code = code.replace(/\?>$/, '')

  // 删除多行和内嵌注释
  code = code.replace(/\/\*(.|\r|\n)*?\*\//g, '')
  // 删除单行注释
  code = code.replace(/(\/\/|#).*/g, '')
  // 合并成一行代码
  return join(compact(
    code.split('\n').map(c => c.trim())
    // @warning 合并字符串需要一个空格，如果是多行字符串，当需要执行多行 SQL 的时候
  ), ' ')
}
