import compact from 'lodash/compact'
import join from 'lodash/join'
import escapeRegExp from 'lodash/escapeRegExp'
import last from 'lodash/last'

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

/**
 * 过滤出命令行的输出内容
 *
 * @param output
 * @param input
 * @return
 */
export function filterOutput (output: string, input = ''): string {
  if (input !== '') {
    // 如果字符串过长，会添加 ` \b` 字符串来分割字符串
    const regB = new RegExp(escapeRegExp(' \b'), 'g')
    output = output.replace(regB, '')
    // 如果是点击 run，则有 input，则需要处理将 input 过滤掉，来得到 output
    const regInput = new RegExp(`${escapeRegExp(input)}\r+\n`)
    output = last(output.split(regInput)) ?? ''
  }

  const outputArr = output.split('\r\n')
  if (outputArr.length <= 1) {
    return ''
  }

  if (outputArr[0].trim() === '') {
    // 第一行为空，则删除
    outputArr.shift()
  }

  outputArr.pop()

  return outputArr.join('\r\n')
}

/**
 * 返回默认 shell
 * https://github.com/sindresorhus/default-shell
 */
export function shell (): string {
  const env = process.env

  if (process.platform === 'darwin') {
    return env.SHELL ?? '/bin/bash'
  }

  if (process.platform === 'win32') {
    return env.COMSPEC ?? 'cmd.exe'
  }

  return env.SHELL ?? '/bin/sh'
}
