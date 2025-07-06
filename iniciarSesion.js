document.getElementById('formulario').addEventListener('submit',function(e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    fetch('http://localhost:8000/api/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usuario,clave})
    })

    .then(Response => Response.json())
    .then(datos => {
        if (datos.ok) {
            if (datos.tipo === 'administrador') {
                window.location.href = '/FULL STAC\PROYECT\Backoffice\index.html';
            } else if (datos.tipo === 'residente') {
                window.location.href = '/FULL STAC\PROYECT\frontendUsuario\index.html';
            } else {
                alert('Ese usuario no existe');
            }
        } else {
            alert('El usuario o la contraseña son incorrectos');
        }
    })

    .catch(error => {
        console.error('Error', error);
        alert('Error en la conexion con la  API');
    });
});