import { ExtensionContext, window, workspace, WorkspaceFolder } from 'vscode'
import { join } from 'path'

import { TINKERUN_DIR } from '../constants'

/**
 * 用于加载 .tinkerun 默认文件夹至 workspace 中
 *
 * @param context
 */
export async function install (context: ExtensionContext): Promise<void> {
  try {
    const folders = workspace.workspaceFolders

    if ((folders != null) && folders.length > 0) {
      let folder: WorkspaceFolder|undefined = folders[0]

      if (folders.length > 1) {
        // 有多个文件夹打开的时候，选择文件夹
        folder = await window.showWorkspaceFolderPick()
        if (folder == null) {
          return
        }
      }

      const sourceUri = context.extensionUri.with({
        path: join(context.extensionUri.path, 'resources/template')
      })

      const targetUri = folder.uri.with({
        path: join(folder.uri.path, TINKERUN_DIR)
      })

      await workspace.fs.copy(sourceUri, targetUri, { overwrite: false })

      await window.showInformationMessage('Tinkerun: Install succeed')

      return
    }

    // 没有文件夹打开
    await window.showInformationMessage('Tinkerun: No workspace folder opened')
  } catch (e) {
    await window.showInformationMessage(e.message)
  }
}
