import { Uri, window } from 'vscode'

import { activeUri, saveDocument } from '../utils'
import { Form } from '../form'

export async function openForm (uri: Uri): Promise<void> {
  try {
    uri = activeUri(uri)
    saveDocument(uri)

    const form = Form.instance(uri)
    await form.update(uri)
  } catch (e) {
    await window.showInformationMessage(e.message)
  }
}
