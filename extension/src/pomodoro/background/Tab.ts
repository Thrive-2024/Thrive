import { EXPIRE_HTML_PATH } from '../consts'
import { tabs, windows } from '../utils/chrome'
import { EXPIRE_PAGE } from '../consts/index'

const openNewTab = (): void => {
  tabs.create(
    {
      url: EXPIRE_PAGE,
      pinned: true
    },
    (tab: any) => {
      focusWindow(tab)
    }
  )
}

const focusWindow = (tab: chrome.tabs.Tab): void => {
  windows.update(tab.windowId, { focused: true })
}

const closeTabs = async (): Promise<void> => {
  await tabs.query({ url: EXPIRE_HTML_PATH }, async (result: any[]) => {
    result.forEach(async (tab: { id: any }) => {
      if (tab.id) {
        await tabs.remove(tab.id)
      }
    })
  })
}

export { openNewTab, closeTabs }
