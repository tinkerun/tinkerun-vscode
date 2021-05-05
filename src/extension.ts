import { commands, ExtensionContext, window } from 'vscode'

import { install } from './commands/install'
import { run } from './commands/run'
import { form } from './commands/form'
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
    commands.registerCommand('tinkerun.form', form)
  )

  context.subscriptions.push(
    window.onDidChangeVisibleTextEditors(async editors => {
      if (Form.exists() && editors.length > 0) {
        const uri = editors[0].document.uri

        const reg = new RegExp('\.tinkerun.+\.php$')

        if (reg.test(uri.path)) {
          const form = await Form.instance(uri)
          await form.update(uri)
        }
      }
    })
  )
}

export function deactivate (): void {
  Form.dispose()
}
