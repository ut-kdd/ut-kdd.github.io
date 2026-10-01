(() => {
  "use strict";
  const { content } = window.LabSite;
  const root = document.getElementById("datasetPage");
  if (!root) return;

  const escape = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const labels = {
    record: "Dataset record", contents: "Contents", overview: "Overview",
    datasetContents: "Dataset contents", intendedUse: "Intended use",
    limitations: "Limitations", creators: "Creators", citation: "Citation",
    related: "Related publications", keywords: "Keywords", year: "Release",
    version: "Version", type: "Data type", size: "Size", license: "License",
    status: "Access", notFound: "Dataset not found",
    notFoundMessage: "This dataset is unavailable or has been removed.",
    allDatasets: "All datasets", labHomepage: "Laboratory homepage"
  };
  const label = (key) => escape(content.ui.dataset?.[key] ?? labels[key] ?? key);
  const link = (url, title) => `<a${url ? ` href="${escape(url)}"` : ""}>${escape(title)}</a>`;
  const slug = new URLSearchParams(location.search).get("slug");
  const dataset = content.datasets.find((item) => item.slug === slug);

  if (!dataset) {
    root.innerHTML = `<main class="paper"><h1>${label("notFound")}</h1><p>${label("notFoundMessage")}</p><p><a href="index.html#resources">${label("allDatasets")}</a></p></main>`;
    return;
  }

  document.title = [dataset.title, content.lab.university].filter(Boolean).join(" · ");
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = dataset.description;

  const metadata = [
    ["year", dataset.year], ["version", dataset.version], ["type", dataset.type],
    ["size", dataset.size], ["license", dataset.license], ["status", dataset.status]
  ].filter(([, value]) => value);
  const sections = [
    ["overview", dataset.overview, (value) => `<p>${escape(value)}</p>`],
    ["datasetContents", dataset.contents, (items) => `<ul class="dataset-list">${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`],
    ["intendedUse", dataset.intendedUse, (value) => `<p>${escape(value)}</p>`],
    ["limitations", dataset.limitations, (value) => `<p>${escape(value)}</p>`]
  ].filter(([, value]) => Array.isArray(value) ? value.length : value);

  root.innerHTML = `
    <nav class="screen-nav" aria-label="Website navigation">
      <a class="dataset-home" href="index.html"><img src="assets/university-of-tehran-logo.png" alt="" width="30" height="30"><span>${escape(content.lab.fullName || label("labHomepage"))}</span></a>
      <span>${escape(content.lab.department)} · ${escape(content.lab.university)}</span>
    </nav>
    <main class="paper" id="mainDataset">
      <header class="dataset-header">
        <div>
          <p class="dataset-type">${label("record")}</p>
          <h1>${escape(dataset.title)}</h1>
          ${dataset.description ? `<p class="dataset-description">${escape(dataset.description)}</p>` : ""}
          ${dataset.links.length ? `<div class="dataset-links">${dataset.links.map((item) => link(item.url, item.label)).join("")}</div>` : ""}
        </div>
        ${metadata.length ? `<dl class="dataset-meta">${metadata.map(([key, value]) => `<div><dt>${label(key)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>` : ""}
      </header>
      ${sections.length ? `<nav class="contents"><span>${label("contents")}:</span>${sections.map(([key], index) => `<a href="#${key}">${index + 1} ${label(key)}</a>`).join("")}</nav>` : ""}
      <div class="dataset-layout">
        <article class="dataset-main">
          ${sections.map(([key, value, render], index) => `<section class="document-section" id="${key}"><h2><span>${index + 1}.</span> ${label(key)}</h2>${render(value)}</section>`).join("")}
        </article>
        <aside class="dataset-aside">
          ${dataset.creators.length ? `<section><h2>${label("creators")}</h2><ul>${dataset.creators.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></section>` : ""}
          ${dataset.citation ? `<section><h2>${label("citation")}</h2><pre class="citation">${escape(dataset.citation)}</pre></section>` : ""}
          ${dataset.relatedPublications.length ? `<section><h2>${label("related")}</h2><ul>${dataset.relatedPublications.map((item) => `<li>${link(item.url, item.label)}</li>`).join("")}</ul></section>` : ""}
          ${dataset.keywords.length ? `<section><h2>${label("keywords")}</h2><ul class="keyword-list">${dataset.keywords.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></section>` : ""}
        </aside>
      </div>
      <footer class="document-footer"><p>${escape(content.lab.fullName)} — ${label("record")}</p><a href="index.html#resources">${label("allDatasets")}</a></footer>
    </main>`;
  window.LabSite.finish("dataset");
})();
