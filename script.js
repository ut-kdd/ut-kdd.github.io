(() => {
  "use strict";

  const content = window.LabSite.content;
  if (!content) return;

  const { byId, setText } = window.LabSite;
  const externalLink = (url) => /^https?:\/\//i.test(url || "");
  const initialsFrom = (name) => (name || "Research Lab")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const { lab, professor, research, opportunities, students, links } = content;
  // Keep the rest of the homepage working when publications are omitted.
  const publications = Array.isArray(content.publications) ? content.publications : [];

  document.title = [lab.fullName, lab.university].filter(Boolean).join(" · ") || "Research laboratory";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = [lab.fullName, lab.university, lab.heroLead, lab.heroSummary].filter(Boolean).join(" — ");

  setText("universityName", lab.university);
  setText("collegeName", lab.location);
  setText("departmentName", lab.department);
  setText("headerDepartment", lab.department);
  setText("headerUniversity", lab.university);
  setText("labName", lab.fullName);
  setText("labInitials", initialsFrom(lab.shortName));
  setText("labNote", lab.labNote);
  setText("heroEyebrow", lab.heroEyebrow);
  setText("heroTitle", lab.heroTitle);
  setText("heroLead", lab.heroLead);
  setText("heroSummary", lab.heroSummary);
  const labImage = byId("labImage");
  const labVisual = byId("labVisual");
  labVisual.hidden = !lab.image;
  if (lab.image) labImage.src = lab.image;
  labImage.alt = lab.imageAlt || "Laboratory image";
  setText("labImageCaption", lab.imageCaption);
  setText("aboutTitle", lab.aboutTitle);
  setText("aboutLead", lab.aboutLead);
  setText("aboutBody", lab.aboutBody);

  setText("professorInitials", professor.initials || initialsFrom(professor.name));
  setText("professorName", professor.name);
  setText("professorRole", professor.role);
  setText("professorBio", professor.bio);
  window.LabSite.configureLink(byId("professorPageLink"), lab.professorSiteUrl);

  const professorLinks = byId("professorLinks");
  professor.links.forEach((item) => {
    const anchor = document.createElement("a");
    window.LabSite.configureLink(anchor, item.url);
    anchor.textContent = item.label;
    if (item.url) professorLinks.append(anchor);
  });

  const researchList = byId("researchList");
  research.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "research-item";

    const number = document.createElement("span");
    number.className = "research-item__number";
    number.textContent = item.number || String(index + 1).padStart(2, "0");

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const summary = document.createElement("p");
    summary.textContent = item.description;
    body.append(title, summary);

    article.append(number, body);
    researchList.append(article);
  });

  setText("welcomeText", opportunities.welcome);
  setText("applicationText", opportunities.process);
  const applicationEmail = byId("applicationEmail");
  if (lab.email) {
    applicationEmail.href = `mailto:${lab.email}`;
    applicationEmail.textContent = `${applicationEmail.textContent} →`;
  } else {
    applicationEmail.hidden = true;
  }

  const publicationList = byId("publicationList");
  publications.forEach((item) => {
    const article = document.createElement("article");
    article.className = "publication-item";

    const year = document.createElement("div");
    year.className = "publication-item__year";
    year.textContent = item.year;

    const body = document.createElement("div");
    const heading = document.createElement("h3");
    if (item.url) {
      const titleLink = document.createElement("a");
      titleLink.href = item.url;
      titleLink.textContent = item.title;
      if (externalLink(item.url)) {
        titleLink.target = "_blank";
        titleLink.rel = "noopener noreferrer";
      }
      heading.append(titleLink);
    } else {
      heading.textContent = item.title;
    }

    const authors = document.createElement("p");
    authors.textContent = item.authors;
    const venue = document.createElement("p");
    venue.className = "venue";
    venue.textContent = item.venue;
    const resources = document.createElement("div");
    resources.className = "publication-resources";
    item.resources.forEach((resource) => {
      const link = document.createElement("a");
      link.textContent = resource.label;
      link.href = resource.url;
      resources.append(link);
    });
    body.append(heading, authors, venue, resources);
    article.append(year, body);
    publicationList.append(article);
  });

  const renderPeople = (items, targetId, showTopics = true) => {
    const target = byId(targetId);
    items.forEach((person) => {
      const row = document.createElement("article");
      row.className = "person-row";

      const identity = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = person.name;
      const degree = document.createElement("span");
      degree.textContent = person.degree;
      const identityHeading = document.createElement("div");
      identityHeading.className = "person-identity-heading";
      identityHeading.append(name);

      const profiles = document.createElement("div");
      profiles.className = "person-links";
      [["Homepage", person.url], ["LinkedIn", person.linkedin]].filter(([, url]) => url).forEach(([label, url]) => {
        const anchor = document.createElement("a");
        window.LabSite.configureLink(anchor, url);
        if (label === "LinkedIn") {
          anchor.className = "linkedin-icon-link";
          anchor.setAttribute("aria-label", `${person.name} on LinkedIn`);
          const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          icon.setAttribute("viewBox", "0 0 24 24");
          icon.setAttribute("width", "13");
          icon.setAttribute("height", "13");
          icon.setAttribute("aria-hidden", "true");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("fill", "currentColor");
          path.setAttribute("d", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.847zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z");
          icon.append(path);
          anchor.append(icon);
        } else {
          anchor.textContent = label;
          anchor.setAttribute("aria-label", `${person.name} homepage`);
        }
        profiles.append(anchor);
      });
      if (profiles.children.length) identityHeading.append(profiles);
      identity.append(identityHeading, degree);

      row.append(identity);
      if (showTopics && person.topic) {
        const topic = document.createElement("p");
        topic.textContent = person.topic;
        row.append(topic);
      }
      target.append(row);
    });
  };

  renderPeople(students, "studentList");

  setText("contactText", lab.contactText);
  setText("addressText", lab.address);
  const emailLink = byId("emailLink");
  emailLink.href = lab.email ? `mailto:${lab.email}` : "";
  emailLink.textContent = lab.email;

  const universityLink = byId("universityLink");
  universityLink.href = lab.website || "#";
  if (externalLink(lab.website)) {
    universityLink.target = "_blank";
    universityLink.rel = "noopener noreferrer";
  }

  const socialLinks = byId("socialLinks");
  const socialItems = [
    ["GitHub", links.github],
    ["LinkedIn", links.linkedin],
    ["Bluesky", links.bluesky]
  ];
  socialItems.filter(([, url]) => url).forEach(([label, url]) => {
    const anchor = document.createElement("a");
    anchor.href = url || "#";
    anchor.textContent = label;
    if (externalLink(url)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    socialLinks.append(anchor);
  });

  setText("footerLabName", lab.fullName);
  setText("currentYear", new Date().getFullYear());

  const menuButton = byId("menuButton");
  const navigation = byId("primaryNavigation");
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
  window.LabSite.finish("lab");
})();
