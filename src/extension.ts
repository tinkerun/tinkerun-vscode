import { commands, ExtensionContext } from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'

export function activate (context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('tinkerun.install', async () => await install(context))
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.run', run)
  )
}

export function deactivate (): void {}
