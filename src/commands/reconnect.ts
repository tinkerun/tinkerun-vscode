import { Uri, window } from 'vscode'

import { activeUri } from '../utils'
import { TinkerTerminal } from '../terminal'

/**
 * 重新连接 tinkerun
 *
 * @param uri
 */
export async function reconnect (uri: Uri): Promise<void> {
  uri = activeUri(uri)

  try {
    const terminal = await TinkerTerminal.reconnect(uri)
    terminal.show()
  } catch (e) {
    TinkerTerminal.dispose()
    await window.showInformationMessage(e.message)
  }
}
