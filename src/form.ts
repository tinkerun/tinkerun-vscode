import { Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode'
import { basename } from 'path'
import {instance, PHPForm} from 'php-form'

import { Context } from './context'
import {TextDecoder} from 'util'
import {TinkerTerminal} from './terminal'

export class Form {
  private static form: Form | undefined

  private _phpForm: PHPForm | undefined

  private panel: WebviewPanel

  private uri: Uri

  constructor (uri: Uri) {
    this.uri = uri
    this.panel = window.createWebviewPanel(
      'tinkerun.viewType.form',
      this.title(),
      ViewColumn.Two,
      {
        enableScripts: true
      }
    )

    this.panel.onDidDispose(() => {
      Form.form = undefined
    })

    this.setIconPath()
  }

  private setIconPath (): void {
    const context = Context.get()

    if (context != null) {
      const root = Uri.joinPath(context.extensionUri, 'resources')

      this.panel.iconPath = {
        light: Uri.joinPath(root, 'form-light.svg'),
        dark: Uri.joinPath(root, 'form-dark.svg')
      }
    }
  }

  private title (): string {
    return `Form: ${basename(this.uri.fsPath)}`
  }

  async phpForm(): Promise<PHPForm> {
    if (this._phpForm == null) {
      this._phpForm = await instance()
    }

    return this._phpForm
  }

  async runCode (code: string): Promise<void> {
    try {
      const terminal = await TinkerTerminal.instance(this.uri)
      await terminal.sendCode(code)
      terminal.show()
    } catch (e) {
      TinkerTerminal.dispose()
    }
  }

  async update (uri: Uri): Promise<void> {
    this.uri = uri
    this.panel.title = this.title()
    this.panel.webview.html = await this.webviewContent()
  }

  private extensionUri(path: string): Uri | undefined {
    const context = Context.get()
    if (context != null) {
      return this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, path))
    }

    return undefined
  }

  private async webviewContent (): Promise<string> {
    const data = await workspace.fs.readFile(this.uri)
    const code = new TextDecoder().decode(data)
    const phpForm = await this.phpForm()
    const fields = await phpForm.parseCode(code)

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinkerun Form</title>
    <link href="${this.extensionUri('build/webview/form.css')}" rel="stylesheet"/>
</head>
<body>
    <div x-data="formData()">
      <template x-for="(field, index) in fields" :key="index">
        <div class="field">
          <label class="field-label" x-text="field.label || field.name"></label>
          <template x-if="field.description">
            <p class="field-description" x-text="field.description" ></p>
          </template>
          
          <input class="field-input" x-model.debounce="field.value"/>
        </div>
      </template>
    </div>
    
    <div class="section">
        <button class="btn btn-primary">Run</button>
    </div>
   
    <script>
       const fields = ${JSON.stringify(fields)};
    </script>
    <script src="${this.extensionUri('build/webview/form.js')}"></script>
</body>
</html>
    `
  }

  static dispose (): void {
    Form.form?.panel.dispose()
  }

  static exists (): boolean {
    return Form.form != null
  }

  static instance (uri: Uri): Form {
    if (Form.form == null) {
      Form.form = new Form(uri)
    }

    return Form.form
  }
}
