import {QuickPickItem, Terminal, Uri, window, workspace} from 'vscode'

import {config} from './config'

const terminals = new Map<string, Terminal>()

/**
 * 清除 terminals 中的数据
 *
 * @param processId 命令行的 pid
 */
export async function dispose(processId: number): Promise<void> {
  for (const [key, terminal] of terminals.entries()) {
    const pid = await terminal.processId
    if (pid === processId) {
      terminals.delete(key)
    }
  }
}

/**
 * 通过 uri 查找 terminals 中存储的进程
 *
 * @param uri 需要执行的代码文件的 uri
 * @return 存储着的 terminal 进程
 */
export async function terminal(uri: Uri): Promise<Terminal | undefined> {
  const workspaceFolder = workspace.getWorkspaceFolder(uri)
  if (workspaceFolder != null) {
    const key = workspaceFolder.uri.path

    let term = terminals.get(key)
    if (term != null) {
      return term
    }

    const {connections} = await config(uri)
    let connection: TinkerConnection | undefined

    if (connections.length <= 1) {
      // 默认选择第一个
      connection = connections[0]
    } else {
      // 选择 connection
      const item = await window.showQuickPick(
        connections.map((c): QuickPickItem => {
          return {
            label: c.name,
            detail: `$(console) ${c.command}`,
          }
        }),
        {
          placeHolder: 'Pick a Connection to Run',
        },
      )

      connection = connections.find(c => c.name === item?.label)
    }

    if (connection != null) {
      term = window.createTerminal(`Tinkerun: ${connection.name}`)
      term.sendText(connection.command)

      terminals.set(key, term)
    }

    return term
  }

  await window.showInformationMessage('Tinkerun: No workspace folder opened')
}
