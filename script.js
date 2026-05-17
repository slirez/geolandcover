function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function selectService(serviceName) {
    // Guardamo nombre del servicio usarlo en el comprobante
    localStorage.setItem('servicioActual', serviceName);
    document.getElementById('service-name-display').innerText = serviceName;
    navigateTo('agendar-screen');
}

function confirmarCita() {
    //  Obtener datos de los inputs (los que el cliente agrega)
    const fecha = document.getElementById('cita-fecha').value;
    const direccion = document.getElementById('cita-direccion').value;
    const hora = document.querySelector('input[name="hora"]:checked')?.value || "No seleccionada";
    const servicio = localStorage.getItem('servicioActual');

    // Pasarlos a la pantalla de comprobante
    document.getElementById('res-servicio').innerText = servicio;
    document.getElementById('res-fecha').innerText = fecha;
    document.getElementById('res-hora').innerText = hora;
    document.getElementById('res-direccion').innerText = direccion;

    //  Cambiar de pantalla
    navigateTo('comprobante-screen');
}

// BASE DE DATOS 
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        try {
            // Aquí la URL real de tu servidor  Backend
            const urlBackend = 'http://localhost:3000/api/login'; 

            const respuesta = await fetch(urlBackend, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pass })
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                
                window.location.href = 'servicios.html';
            } else {
                // Si la contraseña o correo están mal:
                alert(resultado.message || 'Correo o contraseña incorrectos.');
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            
            alert('Aviso: Ejecutando en modo de prueba sin base de datos activa.');
            window.location.href = 'servicios.html';
        }
    });
}