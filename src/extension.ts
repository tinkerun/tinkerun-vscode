import {commands, ExtensionContext, window} from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'
import {dispose} from './terminal'

export function activate (context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('tinkerun.install', async () => await install(context))
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.run', run)
  )

  context.subscriptions.push(
    window.onDidCloseTerminal(async terminal => {
      const pid = await terminal.processId
      if (pid) {
        await dispose(pid)
      }
    })
  )
}

export function deactivate (): void {}
