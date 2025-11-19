const contents = {
  mision: {
    title: "Misión",
    body: "Desarrollar una solución de software innovadora que digitalice y optimice la gestión cooperativa, promoviendo la transparencia total en todas las operaciones. OctoCoop facilita el acceso a la información y fortalece la confianza entre los socios mediante herramientas tecnológicas intuitivas y seguras.",
    img: "img/Personas.jpeg"
  },
  vision: {
    title: "Visión",
    body: "Ser la plataforma líder en gestión cooperativa, reconocida por impulsar la transparencia organizacional y la participación democrática. Buscamos transformar digitalmente el cooperativismo, haciendo que cada socio tenga acceso inmediato a comprobantes, registros de horas, planes y decisiones de asamblea.",
    img: "img/ManosUnidas.jpg"
  },
  objetivos: {
    title: "Objetivos",
    body: "1. Garantizar transparencia mediante el acceso digital a todos los comprobantes y documentos.\n2. Facilitar el registro y consulta de horas trabajadas de forma organizada.\n3. Proporcionar información clara sobre planes cooperativos y decisiones de asamblea.\n4. Optimizar la comunicación y organización interna de las cooperativas.",
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
    
    // Scroll al inicio del panel después de renderizar
    requestAnimationFrame(() => {
      panel.scrollTop = 0;
    });
    
    // Verificar si hay contenido que scrollear y mostrar indicador
    setTimeout(() => {
      if (panel.scrollHeight > panel.clientHeight) {
        panel.classList.add('has-scroll');
      } else {
        panel.classList.remove('has-scroll');
      }
    }, 100);
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

  // --- FUNCIÓN PARA MOSTRAR ALERT MODERNO ---
  function showCustomAlert(title, message) {
    const alertOverlay = document.getElementById('alertOverlay');
    if (!alertOverlay) return;
    
    const titleElement = alertOverlay.querySelector('.alert-modal-title');
    const messageElement = alertOverlay.querySelector('.alert-modal-message');
    
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;
    
    alertOverlay.classList.add('show');
  }

  // --- BOTÓN ACEPTAR DEL ALERT ---
  const alertAcceptBtn = document.getElementById('alertAcceptBtn');
  if (alertAcceptBtn) {
    alertAcceptBtn.addEventListener('click', () => {
      location.reload();
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

  function openModal(){ 
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
  }

  btnOpenForm.addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);
  modalBg.addEventListener('click', (e) => { if(e.target === modalBg) closeModal(); });
  
  // --- GESTIÓN CENTRALIZADA DE TECLA ESCAPE ---
  document.addEventListener('keydown', (e) => { 
    if(e.key === 'Escape'){
      if(modalBg.classList.contains('show')){
        closeModal();
        e.preventDefault();
        return;
      }
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
        form.reset();
        closeModal();
        showCustomAlert('¡Registro Exitoso!', 'Serás avisado cuando sea aceptado y podrás ingresar a la aplicación con las credenciales que proporcionaste.');
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
  const btnNavInicio = document.getElementById('btnNavInicio');
  const btnNavNosotros = document.getElementById('btnNavNosotros');
  const btnNavContacto = document.getElementById('btnNavContacto');
  
  // Secciones compartidas
  const introContainer = document.getElementById('inicio');
  
  // Secciones Desktop
  const mainNosotros = document.getElementById('nosotros');
  const seccionSobreNosotros = document.getElementById('sobreNosotros');
  const seccionContacto = document.getElementById('seccionContacto');
  
  // Secciones Mobile
  const nosotrosMobile = document.getElementById('nosotrosMobile');
  const sobreNosotrosMobile = document.getElementById('sobreNosotrosMobile');
  const contactoMobile = document.getElementById('seccionContactoMobile');

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function scrollToSection(section) {
    if (!section) return;
    const navHeight = nav ? nav.offsetHeight : 70;
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - navHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Asegurar que todas las secciones mobile estén visibles al cargar en mobile
  function inicializarVistaMobile() {
    if (isMobileView()) {
      // Mostrar todas las secciones mobile
      if (introContainer) introContainer.style.display = 'block';
      if (nosotrosMobile) nosotrosMobile.style.display = 'block';
      if (sobreNosotrosMobile) sobreNosotrosMobile.style.display = 'block';
      if (contactoMobile) contactoMobile.style.display = 'block';
    }
  }

  // Inicializar al cargar
  inicializarVistaMobile();

  // Botón "Inicio"
  if(btnNavInicio){
    btnNavInicio.addEventListener('click', (e) => {
      if (!isMobileView()) {
        // Solo preventDefault en desktop
        e.preventDefault();
        // En desktop ocultar secciones secundarias y mostrar inicio
        if (seccionSobreNosotros) seccionSobreNosotros.style.display = 'none';
        if (seccionContacto) seccionContacto.style.display = 'none';
        if (introContainer) introContainer.style.display = 'block';
        if (mainNosotros) mainNosotros.style.display = 'block';
        scrollToSection(introContainer);
      }
      // En mobile, dejar que el navegador haga scroll naturalmente con el href
    });
  }

  // Botón "Nosotros"
  if(btnNavNosotros){
    btnNavNosotros.addEventListener('click', (e) => {
      if (!isMobileView()) {
        // Solo preventDefault en desktop
        e.preventDefault();
        // En desktop ocultar todo y mostrar solo "Sobre Nosotros"
        if (introContainer) introContainer.style.display = 'none';
        if (mainNosotros) mainNosotros.style.display = 'none';
        if (seccionContacto) seccionContacto.style.display = 'none';
        if (seccionSobreNosotros) {
          seccionSobreNosotros.style.display = 'block';
          scrollToSection(seccionSobreNosotros);
        }
      }
      // En mobile, dejar que el navegador haga scroll naturalmente con el href
    });
  }

  // Botón "Contacto"
  if (btnNavContacto) {
    btnNavContacto.addEventListener('click', (e) => {
      if (!isMobileView()) {
        // Solo preventDefault en desktop
        e.preventDefault();
        // En desktop ocultar todo y mostrar solo "Contacto"
        if (introContainer) introContainer.style.display = 'none';
        if (mainNosotros) mainNosotros.style.display = 'none';
        if (seccionSobreNosotros) seccionSobreNosotros.style.display = 'none';
        if (seccionContacto) {
          seccionContacto.style.display = 'block';
          scrollToSection(seccionContacto);
        }
      }
      // En mobile, dejar que el navegador haga scroll naturalmente con el href
    });
  }
});
