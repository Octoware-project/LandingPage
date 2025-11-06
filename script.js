const contents = {
      mision: {
        title: "Misión",
        body: "Nuestra misión es impulsar el desarrollo social y comunitario a través de la cooperación y la solidaridad.",
        img: "img/mision.jpg"
      },
      vision: {
        title: "Visión",
        body: "Ser una cooperativa referente en innovación social, inclusión y participación activa de sus miembros.",
        img: "img/vision.jpg"
      },
      objetivos: {
        title: "Objetivos",
        body: "1. Fomentar la participación de los socios.\n2. Desarrollar proyectos sostenibles.\n3. Promover la educación cooperativa.",
        img: "img/objetivos.jpg"
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      // --- NUEVO BLOQUE PARA LA SECCIÓN PRINCIPAL ---
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
  const first = buttons[0];
  setActive(first);
  render(first.dataset.key);

      // Modal
      const modalBg = document.getElementById('modalBg');
      const btnOpenForm = document.getElementById('btnOpenForm');
      const btnCloseModal = document.getElementById('btnCloseModal');

      function openModal(){ modalBg.classList.add('show'); modalBg.setAttribute('aria-hidden','false'); setTimeout(()=>{ const firstInput=modalBg.querySelector('input'); if(firstInput) firstInput.focus(); },120);}
      function closeModal(){ modalBg.classList.remove('show'); modalBg.setAttribute('aria-hidden','true'); btnOpenForm.focus(); }

      btnOpenForm.addEventListener('click', openModal);
      btnCloseModal.addEventListener('click', closeModal);
      modalBg.addEventListener('click', (e)=>{ if(e.target===modalBg) closeModal(); });
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modalBg.classList.contains('show')) closeModal(); });

      // Navbar animación con scroll
      const nav = document.getElementById('siteNav');
      let lastScroll=window.scrollY;

      window.addEventListener('scroll', ()=>{
        const current=window.scrollY;
        if(current>lastScroll && current>60){ nav.classList.add('oculto'); }
        else{ nav.classList.remove('oculto'); }
        lastScroll=current;
      });
    });
    /* Modal y formulario */

(function(){
  const openBtn = document.getElementById('btnOpenForm');
  const modalBg = document.getElementById('modalBg');
  const closeBtn = document.getElementById('btnCloseModal');
  const form = document.getElementById('registerForm');
  const firstInput = document.getElementById('nombre');
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
    setTimeout(()=> firstInput.focus(), 100);
  }
  function closeModal(){
    modalBg.classList.remove('show');
    modalBg.setAttribute('aria-hidden','true');
    if(successMsg) successMsg.style.display = 'none';
    if(lastFocus) lastFocus.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modalBg.addEventListener('click', (e) => { if(e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modalBg.classList.contains('show')) closeModal(); });

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
        setTimeout(() => { if(successMsg) successMsg.style.display = 'none'; closeModal(); }, 1800);
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


  const btnNavNosotros = document.getElementById('btnNavNosotros');
  const seccionSobreNosotros = document.getElementById('sobreNosotros');
  const mainNosotros = document.getElementById('nosotros');
  const introContainer = document.getElementById('inicio');
  const btnNavContacto = document.getElementById('btnNavContacto');
  const seccionContacto = document.getElementById('seccionContacto');

  function scrollToSection(section) {
    if (!section) return;
    const nav = document.getElementById('siteNav');
    const navHeight = nav ? nav.offsetHeight : 70;
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - navHeight - 12; // 12px extra margen opcional
    window.scrollTo({ top, behavior: 'smooth' });
  }

  btnNavNosotros.addEventListener('click', (e) => {
    e.preventDefault();
    if (mainNosotros) mainNosotros.style.display = 'none';
    if (introContainer) introContainer.style.display = 'none';
    if (seccionSobreNosotros) seccionSobreNosotros.style.display = '';
    if (seccionContacto) seccionContacto.style.display = 'none';
    scrollToSection(seccionSobreNosotros);
  });

  if (btnNavContacto) {
    btnNavContacto.addEventListener('click', (e) => {
      e.preventDefault();
      if (mainNosotros) mainNosotros.style.display = 'none';
      if (introContainer) introContainer.style.display = 'none';
      if (seccionSobreNosotros) seccionSobreNosotros.style.display = 'none';
      if (seccionContacto) seccionContacto.style.display = '';
      scrollToSection(seccionContacto);
    });
  }

  const btnNavInicio = document.querySelector('a[href="#inicio"]');
  if (btnNavInicio) {
    btnNavInicio.addEventListener('click', (e) => {
      if (mainNosotros) mainNosotros.style.display = '';
      if (introContainer) introContainer.style.display = '';
      if (seccionSobreNosotros) seccionSobreNosotros.style.display = 'none';
      if (seccionContacto) seccionContacto.style.display = 'none';
      scrollToSection(introContainer); // asegura scroll compensado
    });
  }
})();
