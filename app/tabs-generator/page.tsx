"use client";

import { useEffect, useMemo, useState } from "react";

type TabDef = { id: string; title: string; content: string };

// Safe HTML text escape
function escapeHTML(s: string) {
  return s.replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[ch];
  });
}

function makeId(prefix: string, i: number) {
  return prefix + "-" + (i + 1);
}

function buildExportHTML(inputTabs: TabDef[], startIndex = 0): string {
  const tabs = inputTabs.length
    ? inputTabs
    : [{ id: "t-1", title: "Tab 1", content: "Edit me" }];

  const wrap =
    "max-width:960px;margin:16px auto;padding:8px;border:1px solid #e5e7eb;border-radius:8px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;background:#fff;";
  const tablist = "display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px 0;";
  const tabBtn = (selected: boolean) =>
    "border:1px solid " +
    (selected ? "#2563eb" : "#e5e7eb") +
    ";background:" +
    (selected ? "#2563eb" : "#f8fafc") +
    ";color:" +
    (selected ? "#fff" : "#111") +
    ";padding:8px 12px;border-radius:8px;cursor:pointer;font:inherit;";
  const panel =
    "border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:#fff;";

  const listId = "tabs";
  const tabIds = tabs.map((_, i) => "tab-" + (i + 1));
  const panelIds = tabs.map((_, i) => "panel-" + (i + 1));

  const buttonsHTML = tabs
    .map((t, i) => {
      const selected = i === startIndex;
      const title =
        t.title && t.title.trim().length > 0
          ? escapeHTML(t.title)
          : "Tab " + (i + 1);
      return (
        '<button role="tab"' +
        ' id="' +
        tabIds[i] +
        '"' +
        ' aria-selected="' +
        (selected ? "true" : "false") +
        '"' +
        ' aria-controls="' +
        panelIds[i] +
        '"' +
        ' tabindex="' +
        (selected ? "0" : "-1") +
        '"' +
        ' style="' +
        tabBtn(selected) +
        '">' +
        title +
        "</button>"
      );
    })
    .join("");

  const panelsHTML = tabs
    .map((t, i) => {
      const title =
        t.title && t.title.trim().length > 0
          ? escapeHTML(t.title)
          : "Tab " + (i + 1);
      const content = t.content && t.content.length > 0
        ? t.content
        : "Content for " + title;
      const hidden = i === startIndex ? "" : ' hidden=""';
      return (
        '<div role="tabpanel"' +
        ' id="' +
        panelIds[i] +
        '"' +
        ' aria-labelledby="' +
        tabIds[i] +
        '"' +
        hidden +
        ' style="' +
        panel +
        '">' +
        content +
        "</div>"
      );
    })
    .join("");

  const html =
    "<!doctype html>" +
    '<html lang="en">' +
    "<head>" +
    '<meta charset="utf-8">' +
    "<title>Tabs</title>" +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    "</head>" +
    '<body style="margin:0;background:#f5f7fb;">' +
    '<main id="main" style="' +
    wrap +
    '">' +
    '<h1 style="margin:0 0 12px 0;font-size:20px;line-height:1.3;">Tabs Demo</h1>' +
    '<div role="tablist" aria-label="Tabs" id="' +
    listId +
    '" style="' +
    tablist +
    '">' +
    buttonsHTML +
    "</div>" +
    panelsHTML +
    "</main>" +
    "<script>(function(){\n" +
    '  var list = document.getElementById("' +
    listId +
    '");\n' +
    "  if(!list) return;\n" +
    "  var tabs = Array.from(list.querySelectorAll('[role=\"tab\"]'));\n" +
    "  var panels = tabs.map(function(tab){\n" +
    "    var id = tab.getAttribute('aria-controls');\n" +
    "    return id ? document.getElementById(id) : null;\n" +
    "  });\n" +
    "  function activate(idx, focus){\n" +
    "    tabs.forEach(function(tab, i){\n" +
    "      var selected = i === idx;\n" +
    "      tab.setAttribute('aria-selected', selected ? 'true' : 'false');\n" +
    "      tab.setAttribute('tabindex', selected ? '0' : '-1');\n" +
    "      if(selected && focus) tab.focus();\n" +
    "      if(panels[i]){\n" +
    "        if(selected){ panels[i].removeAttribute('hidden'); }\n" +
    "        else { panels[i].setAttribute('hidden',''); }\n" +
    "      }\n" +
    "      tab.style.borderColor = selected ? '#2563eb' : '#e5e7eb';\n" +
    "      tab.style.background = selected ? '#2563eb' : '#f8fafc';\n" +
    "      tab.style.color = selected ? '#fff' : '#111';\n" +
    "    });\n" +
    "  }\n" +
    "  tabs.forEach(function(tab, i){ tab.addEventListener('click', function(){ activate(i, true); }); });\n" +
    "  list.addEventListener('keydown', function(e){\n" +
    "    var current = tabs.findIndex(function(t){ return t.getAttribute('aria-selected') === 'true'; });\n" +
    "    if(current < 0) current = 0;\n" +
    "    if(e.key === 'ArrowRight'){ e.preventDefault(); activate((current + 1) % tabs.length, true); }\n" +
    "    else if(e.key === 'ArrowLeft'){ e.preventDefault(); activate((current - 1 + tabs.length) % tabs.length, true); }\n" +
    "    else if(e.key === 'Home'){ e.preventDefault(); activate(0, true); }\n" +
    "    else if(e.key === 'End'){ e.preventDefault(); activate(tabs.length - 1, true); }\n" +
    "  });\n" +
    "})();</script>" +
    "</body></html>";

  return html;
}

export default function TabsGeneratorPage() {
  const [tabs, setTabs] = useState<TabDef[]>([
    { id: "t-1", title: "Overview", content: "Welcome! Edit this content." },
    { id: "t-2", title: "Details", content: "Put details here." },
  ]);
  const [startIndex, setStartIndex] = useState(0);
  const [html, setHtml] = useState("");

  // restore/save simple state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tabsGen");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tabs)) setTabs(parsed.tabs);
        if (typeof parsed.startIndex === "number") setStartIndex(parsed.startIndex);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("tabsGen", JSON.stringify({ tabs, startIndex }));
    } catch {}
  }, [tabs, startIndex]);

  const output = useMemo(() => buildExportHTML(tabs, startIndex), [tabs, startIndex]);

  function addTab() {
    setTabs((t) => [...t, { id: makeId("t", t.length), title: "Tab " + (t.length + 1), content: "" }]);
  }
  function removeTab(index: number) {
    setTabs((t) => t.filter((_, i) => i !== index));
    if (startIndex >= tabs.length - 1) setStartIndex(Math.max(0, startIndex - 1));
  }
  function moveTab(index: number, dir: -1 | 1) {
    setTabs((t) => {
      const copy = t.slice();
      const j = index + dir;
      if (j < 0 || j >= copy.length) return copy;
      const item = copy[index];
      copy.splice(index, 1);
      copy.splice(j, 0, item);
      return copy;
    });
  }
  async function copyHTML() {
    await navigator.clipboard.writeText(output);
    alert("Copied!");
  }
  function downloadHTML() {
    const blob = new Blob([output], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Hello.html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      {/* Keep skip link in layout; this is a no-op if duplicated */}
      <a href="#main" className="skip-link">Skip to main content</a>

      <h1 style={{ marginBottom: 12 }}>Tabs Generator (Assignment 1)</h1>

      <section aria-label="Tabs configuration" style={{ marginBottom: 16 }}>
        {tabs.map((tab, i) => (
          <fieldset key={tab.id} style={{ marginBottom: 12, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <legend style={{ padding: "0 6px" }}>Tab {i + 1}</legend>

            <label htmlFor={tab.id + "-title"} style={{ display: "block", marginBottom: 4 }}>
              Title
            </label>
            <input
              id={tab.id + "-title"}
              type="text"
              value={tab.title}
              onChange={(e) =>
                setTabs((prev) => prev.map((t, idx) => (idx === i ? { ...t, title: e.target.value } : t)))
              }
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 8 }}
            />

            <label htmlFor={tab.id + "-content"} style={{ display: "block", marginBottom: 4 }}>
              Content (HTML allowed)
            </label>
            <textarea
              id={tab.id + "-content"}
              rows={5}
              value={tab.content}
              onChange={(e) =>
                setTabs((prev) => prev.map((t, idx) => (idx === i ? { ...t, content: e.target.value } : t)))
              }
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 8, fontFamily: "inherit" }}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => moveTab(i, -1)}>Move Up</button>
              <button type="button" onClick={() => moveTab(i, 1)}>Move Down</button>
              <button type="button" onClick={() => removeTab(i)}>Remove</button>
            </div>
          </fieldset>
        ))}

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={addTab}>Add Tab</button>

          <label htmlFor="startIndex" style={{ marginLeft: 8 }}>
            Start on tab #
          </label>
          <input
            id="startIndex"
            type="number"
            min={1}
            max={Math.max(1, tabs.length)}
            value={Math.min(tabs.length, Math.max(1, startIndex + 1))}
            onChange={(e) => {
              const n = parseInt(e.target.value || "1", 10);
              const idx = isNaN(n) ? 1 : n;
              setStartIndex(Math.max(0, Math.min(tabs.length - 1, idx - 1)));
            }}
            style={{ width: 80, padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={copyHTML}>Copy</button>
          <button type="button" onClick={downloadHTML}>Download Hello.html</button>
        </div>
      </section>

      <section aria-label="Preview" style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>Preview</h2>
        <iframe
          title="Tabs Preview"
          style={{ width: "100%", height: 360, border: "1px solid #e5e7eb", borderRadius: 8 }}
          srcDoc={output}
        />
      </section>

      <section aria-label="Generated HTML">
        <h2 style={{ marginBottom: 8 }}>Generated HTML</h2>
        <textarea
          readOnly
          value={output}
          style={{ width: "100%", minHeight: 280, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
        />
      </section>
    </div>
  );
}
