import { commands, ExtensionContext, window } from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'
import { openForm } from './commands/openForm'
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
    window.onDidChangeVisibleTextEditors(async editors => {
      if (Form.exists() && editors.length > 0) {
        const uri = editors[0].document.uri

        if (/\.tinkerun.+\.php$/.test(uri.path)) {
          const form = Form.instance(uri)
          await form.update(uri)
        }
      }
    })
  )
}

export function deactivate (): void {
  Form.dispose()
}
