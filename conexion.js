const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const datos = {};
    const formularioDatos = new FormData(formulario);
    formularioDatos.forEach(function(valor, clave) {
    datos[clave] = valor;
    });

    fetch('https://tu-url-aqui.com/api', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(datos)
    })

    .then(function(respuesta) {
    if (respuesta.ok) {
        alert('Formulario enviado correctamente');
        formulario.reset();
    } else {
        alert('Hubo un error al enviar el formulario');
    }
    })
    .catch(function() {
        alert('Error de conexión al enviar el formulario');
    });
});
