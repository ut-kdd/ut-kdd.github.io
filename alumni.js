(() => {
  "use strict";
  const { content, setText, configureLink } = window.LabSite;
  const target = document.getElementById("alumniList");
  setText("universityName", content.lab.university);
  setText("collegeName", content.lab.location);
  setText("departmentName", content.lab.department);
  setText("footerLabName", content.lab.fullName);
  document.title = "Alumni · " + content.lab.fullName;

  content.alumni.forEach((person) => {
    const row = document.createElement("article");
    row.className = "person-row";
    const identity = document.createElement("div");
    const heading = document.createElement("div");
    heading.className = "person-identity-heading";
    const name = document.createElement("strong");
    if (person.url) {
      const link = document.createElement("a");
      configureLink(link, person.url);
      link.textContent = person.name;
      heading.append(link);
    } else {
      name.textContent = person.name;
      heading.append(name);
    }
    if (person.linkedin) {
      const profiles = document.createElement("div");
      profiles.className = "person-links";
      const link = document.createElement("a");
      configureLink(link, person.linkedin);
      link.className = "linkedin-icon-link";
      link.setAttribute("aria-label", person.name + " on LinkedIn");
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("width", "13");
      icon.setAttribute("height", "13");
      icon.setAttribute("aria-hidden", "true");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("fill", "currentColor");
      path.setAttribute("d", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.847zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C23.2 24 24 23.227 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z");
      icon.append(path);
      link.append(icon);
      profiles.append(link);
      heading.append(profiles);
    }
    identity.append(heading);
    if (person.degree) {
      const degree = document.createElement("span");
      degree.textContent = person.degree;
      identity.append(degree);
    }
    row.append(identity);
    target.append(row);
  });
})();
