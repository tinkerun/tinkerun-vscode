import { ExtensionContext } from 'vscode'

let extensionContext: ExtensionContext | undefined

export const Context = {
  set (context: ExtensionContext) {
    extensionContext = context
  },

  get () {
    return extensionContext
  }
}
