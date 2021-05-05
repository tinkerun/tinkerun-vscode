import { ExtensionContext } from 'vscode'

export class Context {
  private static context: ExtensionContext | undefined

  static set (context: ExtensionContext): void {
    Context.context = context
  }

  static get (): ExtensionContext | undefined {
    return Context.context
  }
}
