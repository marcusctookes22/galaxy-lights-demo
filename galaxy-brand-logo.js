window.GALAXY_REFERENCE_LOGO='galaxy-logo.webp?v=1';
(()=>{
  const finalLogo=window.GALAXY_REFERENCE_LOGO;
  const apply=()=>document.querySelectorAll('.js-logo').forEach(img=>{img.src=finalLogo;});
  apply();
  const s=document.createElement('script');
  s.src='hero-polish.js?v=1';
  s.onload=()=>{window.GALAXY_REFERENCE_LOGO=finalLogo;apply();};
  s.onerror=()=>{window.GALAXY_REFERENCE_LOGO=finalLogo;apply();};
  document.head.appendChild(s);
})();
