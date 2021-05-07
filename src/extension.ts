import { commands, ExtensionContext, window, workspace } from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'
import { openForm } from './commands/openForm'
import { onDidSaveTextDocument } from './events/onDidSaveTextDocument'
import { onDidChangeVisibleTextEditors } from './events/onDidChangeVisibleTextEditors'
import { Context } from './context'
import { Form } from './form'

export function activate (context: ExtensionContext): void {
  Context.set(context)

  context.subscriptions.push(
    commands.registerCommand('tinkerun.install', install)
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.run', run)
  )

  context.subscriptions.push(
    commands.registerCommand('tinkerun.openForm', openForm)
  )

  context.subscriptions.push(
    workspace.onDidSaveTextDocument(onDidSaveTextDocument)
  )

  context.subscriptions.push(
    window.onDidChangeVisibleTextEditors(onDidChangeVisibleTextEditors)
  )
}

export function deactivate (): void {
  Form.dispose()
}
