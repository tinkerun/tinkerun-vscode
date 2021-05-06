import escapeRegExp from 'lodash/escapeRegExp'
import last from 'lodash/last'
import { Uri, window, workspace } from 'vscode'

/**
 * 删除注释、PHP 标签，并且把代码变成一行
 *
 * @param code 从文件读取的代码
 * @return 处理为一行的代码
 */
export function minifyPHPCode (code: string): string {
  return code
    .replace(/^<\?(php)?/, '') // 移除 php tag
    .replace(/\?>$/, '')
    .replace(/^\s*/, '')
    .replace(/\s*$/, '')
    .replace(/\n/g, '\\\n')
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

    // 替换 \r\r\n
    const regRRN = new RegExp(escapeRegExp('\r\r\n'), 'g')
    output = output.replace(regRRN, '')

    // 替换换行的前缀
    // https://github.com/bobthecow/psysh/blob/main/src/Shell.php#L54
    const regBuff = new RegExp(escapeRegExp('\\\r\n... '), 'g')
    output = output.replace(regBuff, '\\\n')

    // 如果是点击 run，则有 input，则需要处理将 input 过滤掉，来得到 output
    const regInput = new RegExp(`${escapeRegExp(input)}\r\n`)
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

/**
 * 返回当前 active 的 uri
 * @param uri
 */
export function activeUri (uri: Uri): Uri {
  if (uri == null) {
    // 设置 uri 为当前打开文档的 uri
    const editor = window.activeTextEditor
    if (editor != null) {
      uri = editor.document.uri
    }
  }

  return uri
}

/**
 * 保存文件内容
 * @param uri 需要保存的文档 uri
 */
export function saveDocument (uri: Uri): void {
  workspace
    .textDocuments
    .find(doc => doc.uri.path === uri.path)
    ?.save()
}
