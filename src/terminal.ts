import { commands, EventEmitter, Pseudoterminal, QuickPickItem, Terminal, Uri, window, workspace } from 'vscode'
import debounce from 'lodash/debounce'

import { config } from './config'
import { IPty, spawn } from './node-pty'
import { filterOutput, shell } from './utils'

let terminal: TinkerTerminal | undefined

export class TinkerTerminal {
  /**
   * 自定义 terminal 的 write 事件
   * @private
   */
  private readonly writeEmitter = new EventEmitter<string>()

  /**
   * 自定义的 node-pty
   * @private
   */
  private pty: IPty | undefined

  /**
   * 自定义的 terminal
   * @private
   */
  private terminal: Terminal | undefined

  /**
   * 执行脚本所在的 workspace 目录
   * @private
   */
  private readonly uri: Uri | undefined

  /**
   * 临时存储输入
   * @private
   */
  private input = ''

  /**
   * 临时存储输出
   * @private
   */
  private output = ''

  constructor (uri: Uri) {
    const folder = workspace.getWorkspaceFolder(uri)
    if (folder != null) {
      this.uri = folder.uri
    }
  }

  /**
   * 初始化 pty 和 terminal
   * @private
   */
  private async init (): Promise<void> {
    await this.initPty()
    this.initTerminal()
  }

  /**
   * 获取 config 中的 connection，并且选择
   *
   * @private
   */
  private async connection (): Promise<TinkerConnection | undefined> {
    if (this.uri != null) {
      const { connections } = await config(this.uri)

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
  }

  /**
   * 根据配置，初始化 pty
   * @private
   */
  private async initPty (): Promise<void> {
    const connection = await this.connection()

    if (connection != null) {
      this.pty = spawn(shell(), [], {
        name: `Tinkerun: ${connection.name}`,
        cwd: this.uri?.path,
        env: process.env
      })

      this.pty?.write(`${connection.command}\r`)
      this.pty?.onData(data => {
        this.output += data
        // 只有在有输入，并且在准备输出的结果中包含输入的时候，才执行最终的输出
        if (this.input !== '' && this.output.includes(this.input)) {
          this.writeOutput()
        }
      })
    }
  }

  /**
   * 输出结果
   * @private
   */
  private readonly writeOutput = debounce(() => {
    // 根据 input 和 output 过滤出最终结果
    const result = filterOutput(this.output, this.input)
    this.writeEmitter.fire(result)
    // 解决 cursor 不正确以及清理不正确的问题
    this.writeEmitter.fire('\r\n')
  }, 500)

  /**
   * 初始化 terminal
   * @private
   */
  private initTerminal (): void {
    const pseudo: Pseudoterminal = {
      onDidWrite: this.writeEmitter.event,
      // 关闭的时候，需要清理 pty，writeEmitter，以及内存中的 terminal
      close: () => {
        this.writeEmitter.dispose()
        this.pty?.kill()
        terminal = undefined
      },
      open: () => {}
    }

    this.terminal = window.createTerminal({
      name: 'Tinkerun',
      pty: pseudo
    })
  }

  /**
   * @param code 需要在 tinker 中执行的代码
   */
  sendCode (code: string): void {
    // 更新输入内容
    this.input = code
    // 清空输出内容
    this.output = ''

    this.pty?.write(`${code}\r`)
  }

  /**
   * 显示当前 terminal
   */
  show (): void {
    this.terminal?.show()
  }

  /**
   * 清理 terminal 内容
   */
  async clear (): Promise<void> {
    this.terminal?.show()
    // 清理 terminal
    await commands.executeCommand('workbench.action.terminal.clear')
  }

  /**
   * @param uri 触发执行按钮的文件地址
   */
  static async instance (uri: Uri): Promise<TinkerTerminal> {
    if (terminal != null) {
      return terminal
    }

    terminal = new TinkerTerminal(uri)
    await terminal.init()
    return terminal
  }
}
