import { commands, ExtensionContext } from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'
import { reconnect } from './commands/reconnect'

export function activate (context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('tinkerun.install', async () => await install(context))
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.run', run)
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.reconnect', reconnect)
  )
}

export function deactivate (): void {}
