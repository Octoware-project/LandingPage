const contents = {
  mision: {
    title: "Misión",
    body: "Nuestra misión es impulsar el desarrollo social y comunitario a través de la cooperación y la solidaridad.",
    img: "img/Personas.jpeg"
  },
  vision: {
    title: "Visión",
    body: "Ser una cooperativa referente en innovación social, inclusión y participación activa de sus miembros.",
    img: "img/ManosUnidas.jpg"
  },
  objetivos: {
    title: "Objetivos",
    body: "1. Fomentar la participación de los socios.\n2. Desarrollar proyectos sostenibles.\n3. Promover la educación cooperativa.",
    img: "img/CooperativaEnConstruccion.jpg"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // --- SECCIÓN PRINCIPAL CON BOTONES ---
  const buttons = Array.from(document.querySelectorAll('.side-btn'));
  const panel = document.getElementById('panel');

  function setActive(btn) {
    buttons.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
  }

  function render(key) {
    const data = contents[key];
    if (!data) return;
    panel.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'fade';
    const title = document.createElement('h2');
    title.textContent = data.title;
    const p = document.createElement('p');
    p.textContent = data.body;
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.title;
    wrap.appendChild(title);
    wrap.appendChild(p);
    wrap.appendChild(img);
    panel.appendChild(wrap);
    panel.focus();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      render(btn.dataset.key);
    });
  });

  // inicial
  if(buttons.length > 0){
    const first = buttons[0];
    setActive(first);
    render(first.dataset.key);
  }

  // --- HAMBURGER MENU MOBILE ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const nav = document.getElementById('siteNav');
  const navLinkItems = document.querySelectorAll('.nav-link');
  
  if(hamburger && navLinks){
    hamburger.addEventListener('click', (e)=>{
      e.stopPropagation();
      const isActive = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
    });
    
    navLinkItems.forEach(link => {
      link.addEventListener('click', ()=>{
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    
    document.addEventListener('click', (e)=>{
      if(!nav.contains(e.target) && navLinks.classList.contains('active')){
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- MODAL Y FORMULARIO ---
  const modalBg = document.getElementById('modalBg');
  const btnOpenForm = document.getElementById('btnOpenForm');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const passwordInput = document.getElementById('password');
  const password2Input = document.getElementById('password2');
  const passwordError = document.getElementById('passwordError');
  const successMsg = document.getElementById('successMsg');
  let lastFocus = null;

  function openModal(){ 
    lastFocus = document.activeElement;
    modalBg.classList.add('show'); 
    modalBg.setAttribute('aria-hidden','false'); 
    if(hamburger){
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    setTimeout(()=>{ 
      const firstInput = modalBg.querySelector('input'); 
      if(firstInput) firstInput.focus(); 
    }, 120);
  }
  
  function closeModal(){ 
    // Remover focus de cualquier elemento dentro del modal primero
    if(document.activeElement && modalBg.contains(document.activeElement)){
      document.activeElement.blur();
    }
    
    modalBg.classList.remove('show'); 
    modalBg.setAttribute('aria-hidden','true'); 
    
    // Recargar la página
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  btnOpenForm.addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);
  modalBg.addEventListener('click', (e) => { if(e.target === modalBg) closeModal(); });
  
  // --- GESTIÓN CENTRALIZADA DE TECLA ESCAPE ---
  document.addEventListener('keydown', (e) => { 
    if(e.key === 'Escape'){
      // Prioridad 1: Cerrar modal si está abierto
      if(modalBg.classList.contains('show')){
        closeModal();
        e.preventDefault();
        return;
      }
      // Prioridad 2: Cerrar menú hamburguesa si está abierto
      if(hamburger && navLinks.classList.contains('active')){
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        e.preventDefault();
      }
    }
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    passwordError.style.display = 'none';
    passwordError.textContent = '';
    if(successMsg) { successMsg.style.display = 'none'; successMsg.textContent = ''; }
    if(!form.checkValidity()){ form.reportValidity(); return; }

    if(passwordInput.value !== password2Input.value) {
      passwordError.textContent = 'Las contraseñas no coinciden.';
      passwordError.style.display = 'block';
      password2Input.focus();
      return;
    }

    const payload = {
      name: form.nombre.value.trim(),
      apellido: form.apellido.value.trim(),
      CI: form.CI.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      estadoRegistro: "Pendiente"
    };

    try{
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      const res = await fetch('http://127.0.0.1:8000/api/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if(res.ok){
        if(successMsg) {
          successMsg.textContent = 'Registro enviado correctamente. ¡Gracias!';
          successMsg.style.display = 'block';
        }
        form.reset();
        setTimeout(() => { 
          if(successMsg) successMsg.style.display = 'none'; 
          closeModal(); 
        }, 1800);
      } else {
        let txt = 'Hubo un error al enviar el registro.';
        try { const j = await res.json(); if(j && j.message) txt = j.message; } catch{}
        alert(txt);
      }
    }catch(err){
      alert('Error de conexión, intente nuevamente.');
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Registro';
    }
  });

  // --- NAVBAR SCROLL HIDE ---
  let lastScroll = window.scrollY;

  window.addEventListener('scroll', ()=>{
    const current = window.scrollY;
    if(current > lastScroll && current > 60){ 
      nav.classList.add('nav-hidden'); 
      if(hamburger && navLinks.classList.contains('active')){
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
    else{ 
      nav.classList.remove('nav-hidden'); 
    }
    lastScroll = current;
  });

  // --- NAVEGACIÓN ENTRE SECCIONES ---
  const btnNavNosotros = document.getElementById('btnNavNosotros');
  const seccionSobreNosotros = document.getElementById('sobreNosotros');
  const mainNosotros = document.getElementById('nosotros');
  const nosotrosMobile = document.getElementById('nosotrosMobile');
  const introContainer = document.getElementById('inicio');
  const btnNavContacto = document.getElementById('btnNavContacto');
  const seccionContacto = document.getElementById('seccionContacto');
  const btnNavInicio = document.querySelector('a[href="#inicio"]');

  function ocultarTodasLasSecciones() {
    if (mainNosotros) mainNosotros.style.display = 'none';
    if (nosotrosMobile) nosotrosMobile.style.display = 'none';
    if (introContainer) introContainer.style.display = 'none';
    if (seccionSobreNosotros) seccionSobreNosotros.style.display = 'none';
    if (seccionContacto) seccionContacto.style.display = 'none';
  }

  function scrollToSection(section) {
    if (!section) return;
    const navHeight = nav ? nav.offsetHeight : 70;
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - navHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Botón "Nosotros" - Muestra "Sobre Nosotros"
  if(btnNavNosotros){
    btnNavNosotros.addEventListener('click', (e) => {
      e.preventDefault();
      ocultarTodasLasSecciones();
      if (seccionSobreNosotros) {
        seccionSobreNosotros.style.display = 'block';
        scrollToSection(seccionSobreNosotros);
      }
    });
  }

  // Botón "Contacto" - Muestra la sección de contacto
  if (btnNavContacto) {
    btnNavContacto.addEventListener('click', (e) => {
      e.preventDefault();
      ocultarTodasLasSecciones();
      if (seccionContacto) {
        seccionContacto.style.display = 'block';
        scrollToSection(seccionContacto);
      }
    });
  }

  // Botón "Inicio" - Muestra intro + secciones principales (desktop/mobile)
  if (btnNavInicio) {
    btnNavInicio.addEventListener('click', (e) => {
      e.preventDefault();
      ocultarTodasLasSecciones();
      if (introContainer) introContainer.style.display = 'block';
      if (mainNosotros) mainNosotros.style.display = 'block';
      if (nosotrosMobile) nosotrosMobile.style.display = 'block';
      scrollToSection(introContainer);
    });
  }
});
