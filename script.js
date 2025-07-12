function mostrarImagen(tipo) {
    document.querySelectorAll('.imagen').forEach(img => img.style.display = 'none');
    const target = document.getElementById(`img-${tipo}`);
    if (target) target.style.display = 'block';
    }
document.addEventListener('DOMContentLoaded', () => mostrarImagen('vision'));
        

const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const datos = {};
    const formularioDatos = new FormData(formulario);
    formularioDatos.forEach(function(valor, clave) {
    datos[clave] = valor;
    });

    fetch('https://github.com/Octoware-project/Backoffice-Adminstraci-n/tree/a317d9b4b83a0581d05aa25e439f526044ba3627/app/Http/Controllers', {
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
