import { TextDocument, window } from 'vscode'

import { Form } from '../form'
import { isTinkerunPHP } from '../utils'

export async function onDidSaveTextDocument (doc: TextDocument): Promise<void> {
  try {
    const uri = doc.uri
    if (Form.exists() && isTinkerunPHP(uri)) {
      const form = Form.instance(uri)
      await form.update(uri)
    }
  } catch (e) {
    await window.showInformationMessage(e.message)
  }
}
