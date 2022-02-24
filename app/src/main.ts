const { tabs } = require("chrome");

//// main.ts
// exposes functions to be used by the app in order to manipulate tabs

export function getTabs(name?: string): chrome.tabs.Tab[] {
  return [];
}

export function selectGroup(name: string) {}

export function createGroup(name: string) {}

export function deleteGroup(name: string) {}

export function renameGroup(name: string, newName: string) {}

export function moveTab(tab: chrome.tabs.Tab, name: string) {}

