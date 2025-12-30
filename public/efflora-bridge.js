// Efflora Bridge: external script injected into prototype Next.js app
// - Receives 'inject-script' from parent and executes it in-page
// - Manages data-efflora-dom-id assignment after hydration
// - Notifies parent when page is ready

// Listen for cross-window script injection from Efflora editor
window.addEventListener("message", function (event) {
  if (
    event &&
    event.data &&
    event.data.type === "inject-script" &&
    event.data.script
  ) {
    try {
      const script = document.createElement("script");
      script.textContent = event.data.script;
      document.head.appendChild(script);
      // console.log('[Efflora] 跨域脚本注入成功');
    } catch (error) {
      console.error("[Efflora] 跨域脚本注入失败:", error);
    }
  }
});

// Efflora DOM ID auto-assign system
(function () {
  let domIdCounter = 0;
  const domIdCache = new WeakMap();

  function generateStableHash(element) {
    const features = [];
    features.push(element.tagName.toLowerCase());
    if (element.id) features.push("id:" + element.id);
    if (element.className && typeof element.className === "string") {
      const classes = Array.from(element.classList)
        .filter((cls) => !cls.startsWith("efflora-"))
        .sort()
        .join(".");
      if (classes) features.push("class:" + classes);
    }
    const tagName = element.tagName.toLowerCase();
    if (tagName === "img") {
      if (element.src) {
        const srcParts = element.src.split("/");
        const fileName = srcParts[srcParts.length - 1].split("?")[0];
        features.push("src:" + fileName);
      }
      if (element.alt) features.push("alt:" + element.alt);
    } else if (tagName === "input" || tagName === "textarea") {
      if (element.name) features.push("name:" + element.name);
      if (element.type) features.push("type:" + element.type);
      if (element.placeholder)
        features.push("placeholder:" + element.placeholder);
    } else if (tagName === "button") {
      const text = element.textContent.trim().substring(0, 20);
      if (text) features.push("text:" + text);
    } else if (tagName === "a") {
      if (element.href) {
        const hrefParts = element.href.split("/");
        const lastPart = hrefParts[hrefParts.length - 1]
          .split("#")[0]
          .split("?")[0];
        features.push("href:" + lastPart);
      }
    }
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const sameTagSiblings = siblings.filter(
        (el) => el.tagName === element.tagName,
      );
      const index = sameTagSiblings.indexOf(element);
      if (index !== -1) features.push("nth:" + index);
      if (parent.id) {
        features.push("parent-id:" + parent.id);
      } else if (parent.className && typeof parent.className === "string") {
        const parentClasses = Array.from(parent.classList)
          .filter((cls) => !cls.startsWith("efflora-"))
          .slice(0, 2)
          .join(".");
        if (parentClasses) features.push("parent-class:" + parentClasses);
      }
    }
    if (features.length < 3 && element.textContent) {
      const textHash = element.textContent
        .trim()
        .substring(0, 30)
        .replace(/\s+/g, " ");
      if (textHash) features.push("content:" + textHash);
    }
    const featureString = features.join("|");
    let hash = 0;
    for (let i = 0; i < featureString.length; i++) {
      const char = featureString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  function assignDomId(element) {
    const existingId = element.getAttribute("data-efflora-dom-id");
    if (existingId) return existingId;

    const stableId =
      element.getAttribute("data-efflora-oid") ||
      element.getAttribute("data-efflora-anchor");
    if (stableId) {
      element.setAttribute("data-efflora-dom-id", stableId);
      domIdCache.set(element, stableId);
      return stableId;
    }

    const anchorId = element.getAttribute("data-efflora-anchor");
    if (anchorId) {
      element.setAttribute("data-efflora-dom-id", anchorId);
      domIdCache.set(element, anchorId);
      return anchorId;
    }

    if (domIdCache.has(element)) {
      const cachedId = domIdCache.get(element);
      element.setAttribute("data-efflora-dom-id", cachedId);
      return cachedId;
    }

    const hash = generateStableHash(element);
    const domId = "efflora-" + hash + "-" + ++domIdCounter;
    element.setAttribute("data-efflora-dom-id", domId);
    domIdCache.set(element, domId);
    return domId;
  }

  function initializeDomIds() {
    const interactiveSelectors = [
      "div",
      "span",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "button",
      "input",
      "textarea",
      "select",
      "label",
      "a",
      "img",
      "nav",
      "header",
      "footer",
      "section",
      "article",
      "main",
      "aside",
      "ul",
      "ol",
      "li",
      "table",
      "tr",
      "td",
      "th",
      "form",
      "fieldset",
      "legend",
    ];

    document.querySelectorAll("[data-efflora-anchor]").forEach((element) => {
      assignDomId(element);
    });

    interactiveSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => assignDomId(element));
    });

    // console.log('[Efflora] Initialized DOM IDs for ' + domIdCounter + ' elements');
  }

  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            assignDomId(node);
            node.querySelectorAll("*").forEach((child) => {
              if (child.nodeType === Node.ELEMENT_NODE) assignDomId(child);
            });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initAfterWindowLoad() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initializeDomIds();
        setupMutationObserver();
      });
    });
  }

  if (document.readyState === "complete") {
    initAfterWindowLoad();
  } else {
    window.addEventListener("load", initAfterWindowLoad, { once: true });
  }
})();

// Notify parent window when page is ready
(function () {
  function notifyPageReady() {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: "page-ready", url: window.location.href },
          "*",
        );
      }
    } catch (e) {
      // ignore
    }
  }
  if (document.readyState === "complete") {
    requestAnimationFrame(() => notifyPageReady());
  } else {
    window.addEventListener(
      "load",
      () => requestAnimationFrame(() => notifyPageReady()),
      { once: true },
    );
  }
})();
