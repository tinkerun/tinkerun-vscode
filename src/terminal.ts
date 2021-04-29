import { commands, EventEmitter, Pseudoterminal, Terminal, Uri, window, workspace } from 'vscode'
import debounce from 'lodash/debounce'

import { connection } from './config'
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
   * 存储选中的 connection
   * @private
   */
  private conn: TinkerConnection |undefined

  /**
   * 检查是否已连接
   * @private
   */
  private isConnected = false

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

  /**
   * 是否为 terminal 模式
   * @private
   */
  private isTerminalMode = false

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
    await this.initTerminal()
  }

  /**
   * 返回选择的 connection
   * @private
   */
  private async connection (): Promise<TinkerConnection> {
    if (this.conn != null) {
      return this.conn
    }

    if (this.uri != null) {
      this.conn = await connection(this.uri)
      if (this.conn != null) {
        return this.conn
      }

      throw new Error('Tinkerun: No connection selected')
    }

    throw new Error('Tinkerun: The Uri of the document to running tinker is an error')
  }

  /**
   * 根据配置，初始化 pty
   * @private
   */
  private async initPty (): Promise<void> {
    const conn = await this.connection()

    if (conn != null) {
      this.pty = spawn(shell(), [], {
        name: `Tinkerun: ${conn.name}`,
        cwd: this.uri?.fsPath,
        env: process.env
      })

      this.pty?.write(`${conn.command}\r`)
      this.pty?.onData(async data => {
        // 如果是 terminal 模式，则直接输出
        if (this.isTerminalMode) {
          this.writeEmitter.fire(data)
          return
        }

        this.output += data
        if (!this.isConnected) {
          this.writeEmitter.fire(data)
        }
        // 如果有 >>> 表示已经连接成功
        if (this.output.includes('>>> ')) {
          if (!this.isConnected) {
            this.isConnected = true
            this.newLine()
          }
          // 只有在有输入，才执行最终的输出
          if (this.input !== '') {
            await this.clear()
            this.writeOutput()
          }
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
    this.newLine()
  }, 200)

  /**
   * 初始化 terminal
   * @private
   */
  private async initTerminal (): Promise<void> {
    const conn = await this.connection()

    const pseudo: Pseudoterminal = {
      onDidWrite: this.writeEmitter.event,
      // 关闭的时候，需要清理 pty，writeEmitter，以及内存中的 terminal
      close: this.dispose.bind(this),
      open: () => {
        this.writeEmitter.fire('\x1b[32mTinkerun is Initializing...\x1b[0m')
        this.newLine()
      },
      handleInput: (data: string) => {
        // 如果有输入则变成 terminal 模式
        if (!this.isTerminalMode) {
          this.isTerminalMode = true
        }

        // 直接输入至 pty
        this.pty?.write(data)
      }
    }

    this.terminal = window.createTerminal({
      name: `Tinkerun: ${conn.name}`,
      pty: pseudo
    })
  }

  /**
   * 清理
   * @private
   */
  private dispose (): void {
    this.writeEmitter.dispose()
    this.pty?.kill()
    terminal = undefined
  }

  private newLine (): void {
    this.writeEmitter.fire('\r\n')
  }

  /**
   * @param code 需要在 tinker 中执行的代码
   */
  async sendCode (code: string): Promise<void> {
    if (this.isTerminalMode) {
      // 取消 terminal 模式
      this.isTerminalMode = false
      // 清理 >>>
      this.newLine()
      await this.clear()
    }

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

  static dispose (): void {
    if (terminal != null) {
      terminal.dispose()
    }
  }
}
