import { TextEditor, window } from 'vscode'

import { Form } from '../form'
import { isTinkerunPHP } from '../utils'

export async function onDidChangeVisibleTextEditors (editors: TextEditor[]): Promise<void> {
  try {
    if (Form.exists() && editors.length > 0) {
      const uri = editors[0].document.uri
      if (isTinkerunPHP(uri)) {
        const form = Form.instance(uri)
        await form.update(uri)
      }
    }
  } catch (e) {
    await window.showInformationMessage(e.message)
  }
}
