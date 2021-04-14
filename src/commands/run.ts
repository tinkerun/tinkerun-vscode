import { Uri, workspace } from 'vscode'
import { TextDecoder } from 'util'

import { terminal } from '../terminal'
import { minifyPHPCode } from '../utils'

/**
 * 执行 uri 文件的代码
 *
 * @param uri 需要执行的文件 uri
 */
export async function run (uri: Uri): Promise<void> {
  const term = await terminal(uri)
  if (term != null) {
    const data = await workspace.fs.readFile(uri)
    const code = new TextDecoder().decode(data)
    term.sendText(minifyPHPCode(code))
    term.show()
  }
}
