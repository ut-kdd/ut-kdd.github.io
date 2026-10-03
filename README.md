# Data Mining Lab website update

Copy these six files into the root of the lab GitHub Pages repository:
`index.html`, `styles.css`, `content.js`, `script.js`, `alumni.html`, `alumni.js`.

The existing `content-utils.js`, `common.css`, and `assets/` must remain in the repository.

Changes: the professor profile appears just after the contents bar on phones; alumni have their own page; contents labels match section headings; current members and prospective students appear before the full 38-entry publications list.

Review any later local changes before replacing files, then use `git diff`, `git add index.html styles.css content.js script.js alumni.html alumni.js`, `git commit -m "Improve lab layout and add publications"`, and `git push`.

The 2026 publication entry is included as supplied but needs a verified publisher URL or DOI. Papers without verified direct links display as plain text.
