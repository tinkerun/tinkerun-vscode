import { QuickPickItem, Uri, window, workspace } from 'vscode'
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
  } catch (e) {
  }

  return {
    connections: []
  }
}

/**
 * 获取 config 中的 connection，并且选择
 * 如果只有一个，则返回第一个
 * 如果有多个，则返回 quickPick 的选择
 *
 * @param uri
 */
export async function connection (uri: Uri): Promise<TinkerConnection | undefined> {
  const { connections } = await config(uri)

  if (connections.length <= 1) {
    // 默认选择第一个
    return connections[0]
  }

  // 选择 connection
  const item = await window.showQuickPick(
    connections.map((c): QuickPickItem => {
      return {
        label: c.name,
        detail: `$(console) ${c.command}`
      }
    }),
    {
      placeHolder: 'Pick a Connection to Run'
    }
  )

  return connections.find(c => c.name === item?.label)
}
