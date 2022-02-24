//// background.js

const { runtime, storage, tabs, windows } = chrome;

function mergeStoredActiveGroup(state) {
  return {
    ...state,
    tabs: [...(state.tabs ?? [])],
  };
}

/**
 * Event listeners
 */
runtime.onInstalled.addListener(() => {
  storage.local.set({
    activeGroup: {
      name: "Welcome",
      tabs: [],
    },
  });
});

/** When a tab is created, add it to the current group */
tabs.onCreated.addListener((tab) => {
  console.log("tab: ", tab);
  (async () => {
    const { activeGroup, homeWindowId } = await storage.local.get([
      "activeGroup",
      "homeWindowId",
    ]);
    console.log("onCreate: ", activeGroup);
    const newActiveGroup = {
      ...activeGroup,
      tabs: [...(activeGroup.tabs ?? []), tab],
    };
    await storage.local.set({ activeGroup: newActiveGroup });
    console.log("new onCreate: ", newActiveGroup);
  })();
});

/**
 * Startup
 */
async function onStartup() {
  const homeTab = await setupHomeTab();
  await setupGroups(homeTab);
  await setupHiddenWindow();
}

async function setupHomeTab() {
  const homeTabProps = {
    url: runtime.getURL("app/build/index.html"),
    pinned: true,
  };
  let [homeTab] = await tabs.query(homeTabProps);
  if (!homeTab) {
    homeTab = await tabs.create(homeTabProps);
  }
  await storage.local.set({
    homeTabId: homeTab.id,
    homeWindowId: homeTab.windowId,
  });
  return homeTab;
}

async function setupHiddenWindow() {
  const hiddenWindow = await windows.create({
    //state: "minimized",
    state: "normal", // make this minimized in production
  });
  await storage.local.set({ hiddenWindowId: hiddenWindow.id });
}

async function setupGroups(homeTab) {
  let { activeGroup } = await storage.local.get(["activeGroup"]);
  console.log("setupGroups: ", activeGroup, activeGroup.tabs);
  const tabSet = await Promise.all(
    activeGroup.tabs.map((tab) =>
      tabs.create({ ...tab, openerTabId: homeTab.id })
    )
  );
  console.log({ tabSet });
  await storage.local.set({
    activeGroup: {
      ...activeGroup,
      tabs: tabSet,
    },
  });
}

/** initialize */
onStartup();
