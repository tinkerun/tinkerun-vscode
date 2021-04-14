import { Uri, workspace } from 'vscode'
import { join } from 'path'
import { TextDecoder } from 'util'

import { TINKERUN_CONFIG_FILE, TINKERUN_DIR } from './constants'

/**
 * 根据 uri 返回该 workspace 文件夹下的 config 数据
 *
 * @param uri
 * @return 该 workspace 下的 tinkerun 配置
 */
export async function config (uri: Uri): Promise<TinkerConfig> {
  try {
    const workspaceFolder = workspace.getWorkspaceFolder(uri)
    if (workspaceFolder != null) {
      const configFileUri = workspaceFolder.uri.with({
        path: join(workspaceFolder.uri.path, TINKERUN_DIR, TINKERUN_CONFIG_FILE)
      })

      const data = await workspace.fs.readFile(configFileUri)
      return JSON.parse(new TextDecoder().decode(data))
    }
  } catch (e) {}

  return Promise.resolve({
    connections: []
  })
}
