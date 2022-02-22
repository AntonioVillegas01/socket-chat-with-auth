const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://secure-oasis-63024.herokuapp.com/api/auth'

let usuario = null
let socket = null


// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'x-token': token
        }
    })

    const {usuario: userDB, token: tokenDB} = await resp.json()
    // console.log(userDB, tokenDB)
    localStorage.setItem('token', tokenDB)
    usuario = userDB
    document.title = usuario.nombre

    await conectarSocket();

}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    socket.on('recibir-mensajes', dibujarMensajes)

    socket.on('usuarios-activos', dibujarUsuario)


    socket.on('mensaje-privado', (payload) => {

        console.log(`Privado:`, {payload})
    })

}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const uid = txtUid.value
    const mensaje = txtMensaje.value

    if(keyCode !==13)return
    if(mensaje.length === 0) return;

    socket.emit('enviar-mensaje', {uid, mensaje})

    txtMensaje.value = ''

})


const main = async () => {

    await validarJWT()
}

const dibujarUsuario = (usuarios = []) => {

    let usersHTML = '';
    usuarios.forEach(({nombre, uid}) => {
        usersHTML += `
            <li>
            <p>
            <h5 class="text-success">${nombre}</h5>
            <span class="text-muted">${uid}</span>
            </p>
            </li>`
    });

    ulUsuarios.innerHTML = usersHTML
}

const dibujarMensajes = (mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach(({nombre, mensaje}) => {
        mensajesHTML += `
            <li>
            <p>
            <span class="text-primary">${nombre}:</span>
            <span>${mensaje}</span>
            </p>
            </li>`
    });

    ulMensajes.innerHTML = mensajesHTML
}

// const socket = io();

main();