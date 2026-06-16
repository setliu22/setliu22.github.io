const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const screenshotTriggers = document.querySelectorAll("[data-screenshot-target]");
const screenshotDialogs = document.querySelectorAll(".screenshot-dialog");
const screenshotCloseButtons = document.querySelectorAll("[data-screenshot-close]");

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
