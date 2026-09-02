const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

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
