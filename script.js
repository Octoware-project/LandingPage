    const contents = {
      mision: { title: "Misión", body: "Desarrollar un sistema de información accesible, eficiente y seguro que facilite la gestión integral de una cooperativa de viviendas de ayuda mutua..." },
      vision: { title: "Visión", body: "Ser una solución tecnológica de referencia para cooperativas de vivienda, contribuyendo al desarrollo social mediante herramientas digitales..." },
      valores: { title: "Valores", body: "Nuestros valores se fundamentan en la solidaridad, promoviendo la ayuda mutua como base del modelo cooperativo; la transparencia..." },
      proyecto: { title: "Proyecto", body: "Aquí puedes describir el proyecto: objetivos, alcance, plazos y actores involucrados." },
      avances: { title: "Avances", body: "Listado de hitos y avances: versiones realizadas, tareas completadas y próximos pasos." },
      unidos: { title: "Unidos", body: "Espacio para mensajes de unidad, testimonios, o llamados a la acción comunitaria." }
    };

    document.addEventListener('DOMContentLoaded', () => {
      const buttons = Array.from(document.querySelectorAll('.side-btn'));
      const panel = document.getElementById('panel');

      function setActive(btn){
        buttons.forEach(b=>{ b.classList.toggle('active', b===btn); b.setAttribute('aria-selected', b===btn?'true':'false'); });
      }

      function render(key){
        const data = contents[key]; if(!data) return;
        panel.innerHTML = '';
        const wrap = document.createElement('div'); wrap.className='fade';
        const title = document.createElement('h2'); title.textContent=data.title;
        const p = document.createElement('p'); p.textContent=data.body;
        wrap.appendChild(title); wrap.appendChild(p); panel.appendChild(wrap); panel.focus();
      }

      buttons.forEach(btn=>{
        btn.addEventListener('click', ()=>{ setActive(btn); render(btn.dataset.key); });
      });

      // inicial
      const first = buttons[0]; setActive(first); render(first.dataset.key);

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
        if(lastFocus) lastFocus.focus();
      }

      openBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      modalBg.addEventListener('click', (e) => { if(e.target === modalBg) closeModal(); });
      document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modalBg.classList.contains('show')) closeModal(); });

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        if(!form.checkValidity()){ form.reportValidity(); return; }

        const payload = {
          nombre: form.nombre.value.trim(),
          apellido: form.apellido.value.trim(),
          email: form.email.value.trim(),
          password: form.password.value,
          CI: String(form.CI.value).trim(),
          Telefono: form.Telefono.value.trim(),
          Direccion: form.Direccion.value.trim(),
          Estado_Registro: "Pendiente",
          Tipo_Persona: "Residente"
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
            alert('Registro enviado correctamente. ¡Gracias!');
            form.reset();
            closeModal();
          } else {
            let txt = 'Hubo un error al enviar el registro.';
            try { const j = await res.json(); if(j && j.message) txt = j.message; } catch{}
            alert(txt);
          }
        }catch(err){
          console.error(err);
          alert('Error de conexión, intente nuevamente.');
        }finally{
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Registro';
        }
      });
    })();
