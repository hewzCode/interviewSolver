"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const { shell } = require("electron");
const PROCESSING_EVENTS = {
  //global states
  UNAUTHORIZED: "procesing-unauthorized",
  NO_SCREENSHOTS: "processing-no-screenshots",
  API_KEY_OUT_OF_CREDITS: "processing-api-key-out-of-credits",
  //states for generating the initial solution
  INITIAL_START: "initial-start",
  PROBLEM_EXTRACTED: "problem-extracted",
  SOLUTION_SUCCESS: "solution-success",
  INITIAL_SOLUTION_ERROR: "solution-error",
  //states for processing the debugging
  DEBUG_START: "debug-start",
  DEBUG_SUCCESS: "debug-success",
  DEBUG_ERROR: "debug-error"
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  updateContentDimensions: (dimensions) => electron.ipcRenderer.invoke("update-content-dimensions", dimensions),
  takeScreenshot: () => electron.ipcRenderer.invoke("take-screenshot"),
  getScreenshots: () => electron.ipcRenderer.invoke("get-screenshots"),
  deleteScreenshot: (path) => electron.ipcRenderer.invoke("delete-screenshot", path),
  // Event listeners
  onScreenshotTaken: (callback) => {
    const subscription = (_, data) => callback(data);
    electron.ipcRenderer.on("screenshot-taken", subscription);
    return () => {
      electron.ipcRenderer.removeListener("screenshot-taken", subscription);
    };
  },
  onSolutionsReady: (callback) => {
    const subscription = (_, solutions) => callback(solutions);
    electron.ipcRenderer.on("solutions-ready", subscription);
    return () => {
      electron.ipcRenderer.removeListener("solutions-ready", subscription);
    };
  },
  onResetView: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on("reset-view", subscription);
    return () => {
      electron.ipcRenderer.removeListener("reset-view", subscription);
    };
  },
  onSolutionStart: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on(PROCESSING_EVENTS.INITIAL_START, subscription);
    return () => {
      electron.ipcRenderer.removeListener(PROCESSING_EVENTS.INITIAL_START, subscription);
    };
  },
  onDebugStart: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on(PROCESSING_EVENTS.DEBUG_START, subscription);
    return () => {
      electron.ipcRenderer.removeListener(PROCESSING_EVENTS.DEBUG_START, subscription);
    };
  },
  onDebugSuccess: (callback) => {
    electron.ipcRenderer.on("debug-success", (_event, data) => callback(data));
    return () => {
      electron.ipcRenderer.removeListener(
        "debug-success",
        (_event, data) => callback(data)
      );
    };
  },
  onDebugError: (callback) => {
    const subscription = (_, error) => callback(error);
    electron.ipcRenderer.on(PROCESSING_EVENTS.DEBUG_ERROR, subscription);
    return () => {
      electron.ipcRenderer.removeListener(PROCESSING_EVENTS.DEBUG_ERROR, subscription);
    };
  },
  onSolutionError: (callback) => {
    const subscription = (_, error) => callback(error);
    electron.ipcRenderer.on(PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, subscription);
    return () => {
      electron.ipcRenderer.removeListener(
        PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
        subscription
      );
    };
  },
  onProcessingNoScreenshots: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on(PROCESSING_EVENTS.NO_SCREENSHOTS, subscription);
    return () => {
      electron.ipcRenderer.removeListener(PROCESSING_EVENTS.NO_SCREENSHOTS, subscription);
    };
  },
  onProblemExtracted: (callback) => {
    const subscription = (_, data) => callback(data);
    electron.ipcRenderer.on(PROCESSING_EVENTS.PROBLEM_EXTRACTED, subscription);
    return () => {
      electron.ipcRenderer.removeListener(
        PROCESSING_EVENTS.PROBLEM_EXTRACTED,
        subscription
      );
    };
  },
  onSolutionSuccess: (callback) => {
    const subscription = (_, data) => callback(data);
    electron.ipcRenderer.on(PROCESSING_EVENTS.SOLUTION_SUCCESS, subscription);
    return () => {
      electron.ipcRenderer.removeListener(
        PROCESSING_EVENTS.SOLUTION_SUCCESS,
        subscription
      );
    };
  },
  onUnauthorized: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on(PROCESSING_EVENTS.UNAUTHORIZED, subscription);
    return () => {
      electron.ipcRenderer.removeListener(PROCESSING_EVENTS.UNAUTHORIZED, subscription);
    };
  },
  onApiKeyOutOfCredits: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on(PROCESSING_EVENTS.API_KEY_OUT_OF_CREDITS, subscription);
    return () => {
      electron.ipcRenderer.removeListener(
        PROCESSING_EVENTS.API_KEY_OUT_OF_CREDITS,
        subscription
      );
    };
  },
  moveWindowLeft: () => electron.ipcRenderer.invoke("move-window-left"),
  moveWindowRight: () => electron.ipcRenderer.invoke("move-window-right"),
  updateApiKey: (apiKey) => electron.ipcRenderer.invoke("update-api-key", apiKey),
  setApiKey: (apiKey) => electron.ipcRenderer.invoke("set-api-key", apiKey),
  openExternal: (url) => shell.openExternal(url)
});
electron.ipcRenderer.on("restore-focus", () => {
  const activeElement = document.activeElement;
  if (activeElement && typeof activeElement.focus === "function") {
    activeElement.focus();
  }
});
exports.PROCESSING_EVENTS = PROCESSING_EVENTS;
