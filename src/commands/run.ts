import { Uri, window, workspace } from 'vscode'
import { TextDecoder } from 'util'

import { TinkerTerminal } from '../terminal'
import { activeUri, saveDocument } from '../utils'

/**
 * 执行 uri 文件的代码
 *
 * @param uri 需要执行的文件 uri
 */
export async function run (uri: Uri): Promise<void> {
  try {
    uri = activeUri(uri)
    saveDocument(uri)

    // 读取文件内容
    const data = await workspace.fs.readFile(uri)
    // 输入至 terminal 并且显示
    await TinkerTerminal.runCode(new TextDecoder().decode(data), uri)
  } catch (e) {
    await window.showInformationMessage(e.message)
  }
}
