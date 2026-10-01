/* Shared content handling. Usually only content.js needs editing. */
(() => {
  'use strict';
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const text = value => ['string', 'number'].includes(typeof value) ? String(value) : '';
  const list = value => Array.isArray(value) ? value : [];
  const strings = value => list(value).map(text).filter(value => value.trim());
  const records = value => list(value).filter(value => value && typeof value === 'object' && !Array.isArray(value) && value.enabled !== false);
  const fields = (value, keys) => Object.fromEntries(keys.split(' ').map(key => [key, text(object(value)[key])]));
  const safeUrl = value => {
    const url = text(value).trim();
    if (!url || url === '#' || /[\u0000-\u0020\u007f]/.test(url)) return '';
    if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^(https?:|mailto:|tel:)/i.test(url)) return '';
    return url;
  };
  const links = value => records(value).map(item => ({...fields(item,'label title detail'),url:safeUrl(item.url)}));
  const normalize = raw => {
    raw = object(raw);
    const lab = fields(raw.lab, 'shortName fullName university department location heroEyebrow heroTitle heroLead heroSummary labNote aboutTitle aboutLead aboutBody contactText email address website labUrl professorSiteUrl image imageAlt imageCaption');
    const professor = fields(raw.professor,'name initials role headline bio email office officeHours availability personalLinkText photo siteUrl');
    professor.biography = strings(object(raw.professor).biography);
    professor.links = links(object(raw.professor).links);
    const personalPage = fields(raw.personalPage,'eyebrow title introduction closing');
    personalPage.collections = records(object(raw.personalPage).collections).map(item => ({...fields(item,'title note'),items:links(item.items)}));
    const courses = records(raw.courses).map(item => ({...fields(item,'slug code title term level credits format description overview notice assessmentNote'),
      url:safeUrl(item.url) || (text(item.slug) ? `course.html?slug=${encodeURIComponent(text(item.slug))}` : ''),
      outcomes:strings(item.outcomes),topics:strings(item.topics),
      assessment:records(item.assessment).map(row => fields(row,'item weight')),resources:links(item.resources),sections:object(item.sections)
    })).filter(item => item.slug && item.title);
    const datasets = records(raw.datasets).map(item => ({
      ...fields(item,'slug title description overview year version type size license status citation intendedUse limitations'),
      url:safeUrl(item.url) || (text(item.slug) ? `dataset.html?slug=${encodeURIComponent(text(item.slug))}` : ''),
      creators:strings(item.creators),keywords:strings(item.keywords),contents:strings(item.contents),
      links:links(item.links).filter(link => link.url),relatedPublications:links(item.relatedPublications).filter(link => link.url)
    })).filter(item => item.slug && item.title);
    const software = records(raw.software).map(item => ({...fields(item,'title description language version license url codeUrl documentationUrl'),links:links(item.links).filter(link=>link.url)}));
    const opportunities = {...fields(raw.opportunities,'welcome process'),steps:strings(object(raw.opportunities).steps)};
    return {lab,professor,personalPage,courses,datasets,software,opportunities,
      research:records(raw.research).map(item => ({...fields(item,'number title description'),tags:strings(item.tags)})),
      publications:records(raw.publications).map(item => ({...fields(item,'year title authors venue'),url:safeUrl(item.url),resources:links(item.resources).filter(link => link.url)})),
      students:records(raw.students).map(item => ({...fields(item,'name degree topic'),url:safeUrl(item.url),linkedin:safeUrl(item.linkedin)})),
      alumni:records(raw.alumni).map(item => ({...fields(item,'name degree'),url:safeUrl(item.url),linkedin:safeUrl(item.linkedin)})),
      links:Object.fromEntries(Object.entries(object(raw.links)).map(([key,value]) => [key,safeUrl(value)])),
      settings:object(raw.settings),ui:object(raw.ui)};
  };
  const source = window.LAB_CONTENT || (typeof LAB_CONTENT !== 'undefined' ? LAB_CONTENT : {});
  const content = normalize(source);
  const byId = id => document.getElementById(id) || document.createElement('div');
  const setText = (id,value) => { const node=byId(id); node.textContent=text(value); node.hidden=!text(value).trim(); };
  const configureLink = (node,value) => {
    const url = safeUrl(value);
    node.removeAttribute('href');node.removeAttribute('target');node.removeAttribute('rel');
    if (url) node.href=url;
    if (/^https?:\/\//i.test(url)) {node.target='_blank';node.rel='noopener noreferrer';}
  };
  const section = (id,visible) => {
    const node=document.getElementById(id); if(node) node.hidden=!visible;
    document.querySelectorAll('a[href="#'+id+'"]').forEach(link => {link.hidden=!visible;});
  };
  const finish = page => {
    const switches=object(object(content.settings.sections)[page]);
    const show=(id,hasData=true) => section(id,switches[id]!==false && Boolean(hasData));
    document.querySelectorAll('[data-ui]').forEach(node => {
      const [group,key]=node.dataset.ui.split('.');
      const value=object(content.ui[group])[key];
      if (value!==undefined) node.textContent=text(value);
    });
    if(page==='lab') {
      show('top',content.lab.heroTitle||content.lab.heroLead||content.lab.heroSummary||content.lab.heroEyebrow);
      show('about',content.lab.aboutTitle||content.lab.aboutLead||content.lab.aboutBody);
      show('research',content.research.length);show('publications',content.publications.length);
      show('people',content.students.length||content.alumni.length);
      show('join',content.opportunities.welcome||content.opportunities.process||content.opportunities.steps.length);
      show('profile',content.professor.name||content.professor.bio);
      show('contact',content.lab.contactText||content.lab.email||content.lab.address);
      ['studentList','alumniList'].forEach(id => {const group=byId(id).closest('.people-group');if(group)group.hidden=!byId(id).children.length;});
      ['emailLink','addressText'].forEach(id => {const row=byId(id).closest('dl > div');if(row)row.hidden=!byId(id).textContent;});
      byId('allPublicationsLink').hidden=!content.links.fullPublications;
      let number=0;
      document.querySelectorAll('.main-column > section').forEach(node => {if(!node.hidden){const label=node.querySelector('.section-heading span');if(label)label.textContent=String(++number).padStart(2,'0');}});
      const sidebar=document.querySelector('.sidebar');if(sidebar)sidebar.hidden=![...sidebar.children].some(node=>!node.hidden);
      const grid=document.querySelector('.page-grid');if(grid)grid.classList.toggle('no-sidebar',Boolean(sidebar?.hidden));
    }
    if(page==='professor') {
      show('about',content.professor.headline||content.professor.bio||content.professor.biography.length||content.research.length);
      show('research',content.research.length||content.professor.availability);show('publications',content.publications.length);
      show('teaching',content.courses.length);show('supervision',content.students.length);
      const notice=document.querySelector('.notice');if(notice)notice.hidden=!content.professor.availability;
      const personal=document.querySelector('.personal-page-note');if(personal)personal.hidden=switches.personal===false||!content.professor.personalLinkText;
      const keywords=document.querySelector('.keywords');if(keywords)keywords.hidden=!content.research.length;
      byId('fullPublicationsLink').hidden=!content.links.fullPublications;
      document.querySelectorAll('.author-contact > span[aria-hidden]').forEach(node=>{node.hidden=true;});
      let number=0;
      document.querySelectorAll('.document-section').forEach(node=>{
        if(node.hidden)return;
        const heading=node.querySelector('h2');const link=document.querySelector('.contents a[href="#'+node.id+'"]');
        number++;
        if(heading)heading.textContent=number+'. '+heading.textContent.replace(/^\d+\.?\s*/, '');
        if(link)link.textContent=number+' '+link.textContent.replace(/^\d+\.?\s*/, '');
      });
      const nav=document.querySelector('.contents');if(nav)nav.hidden=![...nav.querySelectorAll('a')].some(node=>!node.hidden);
    }
    document.querySelectorAll('a').forEach(node=>configureLink(node,node.getAttribute('href')));
  };
  window.LabSite={content,normalize,byId,setText,configureLink,safeUrl,section,finish};
})();
