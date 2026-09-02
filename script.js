const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const browserTabs = Array.from(document.querySelectorAll("[data-browser-tab]"));
const browserPanels = Array.from(document.querySelectorAll(".browser-panel"));
const browserAddress = document.querySelector("[data-browser-address]");
const validBrowserTabs = new Set(browserTabs.map((tab) => tab.dataset.browserTab));

const activateBrowserTab = (targetId, options = {}) => {
  const { updateHistory = false, moveFocus = false } = options;

  if (!validBrowserTabs.has(targetId)) {
    return;
  }

  browserTabs.forEach((tab) => {
    const isActive = tab.dataset.browserTab === targetId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;

    if (isActive && moveFocus) {
      tab.focus();
    }
  });

  browserPanels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });

  if (browserAddress) {
    browserAddress.textContent = `setliu22.github.io/${targetId}`;
  }

  document.title = `Seton Liu | ${targetId === "projects" ? "Projects" : "Podcasts"}`;

  if (updateHistory && window.location.hash !== `#${targetId}`) {
    window.history.pushState({ browserTab: targetId }, "", `#${targetId}`);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
};

browserTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateBrowserTab(tab.dataset.browserTab, { updateHistory: true });
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = browserTabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + browserTabs.length) % browserTabs.length;
    } else if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % browserTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = browserTabs.length - 1;
    }

    activateBrowserTab(browserTabs[nextIndex].dataset.browserTab, {
      updateHistory: true,
      moveFocus: true,
    });
  });
});

window.addEventListener("popstate", () => {
  const targetId = window.location.hash.slice(1);
  activateBrowserTab(validBrowserTabs.has(targetId) ? targetId : "projects");
});

const initialBrowserTab = window.location.hash.slice(1);
activateBrowserTab(validBrowserTabs.has(initialBrowserTab) ? initialBrowserTab : "projects");

const screenshotTriggers = document.querySelectorAll("[data-screenshot-target]");
const screenshotDialogs = document.querySelectorAll(".screenshot-dialog");
const screenshotCloseButtons = document.querySelectorAll("[data-screenshot-close]");

const loadPaperPages = (dialog) => {
  const container = dialog?.querySelector(".paper-pages");

  if (!container || container.dataset.loaded === "true") {
    return;
  }

  const pageCount = Number.parseInt(container.dataset.pageCount || "0", 10);
  const paperPath = container.dataset.paperPath;
  const paperTitle = container.dataset.paperTitle || "Preprint";

  if (!paperPath || pageCount < 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const image = document.createElement("img");
    const paddedPageNumber = String(pageNumber).padStart(2, "0");

    image.src = `${paperPath}/page-${paddedPageNumber}.jpg`;
    image.alt = `${paperTitle}, page ${pageNumber}`;
    image.width = 1400;
    image.height = 1980;
    image.decoding = "async";
    image.loading = pageNumber === 1 ? "eager" : "lazy";
    fragment.appendChild(image);
  }

  container.appendChild(fragment);
  container.dataset.loaded = "true";
};

const closeScreenshotDialog = (dialog) => {
  if (!dialog) {
    return;
  }

  if (typeof dialog.close === "function") {
    dialog.close();
    return;
  }

  dialog.removeAttribute("open");
};

screenshotTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.getAttribute("data-screenshot-target");
    const dialog = document.getElementById(targetId);

    if (!dialog) {
      return;
    }

    loadPaperPages(dialog);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }

    dialog.setAttribute("open", "");
  });
});

screenshotCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeScreenshotDialog(button.closest("dialog"));
  });
});

screenshotDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeScreenshotDialog(dialog);
    }
  });
});
