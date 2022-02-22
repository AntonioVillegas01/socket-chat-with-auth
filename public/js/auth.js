
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://secure-oasis-63024.herokuapp.com/api/auth'

const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', e => {
    e.preventDefault()
    const formData = {};

    for(let el of miFormulario.elements){
        if(el.name.length > 0)
            formData[el.name] = el.value
    }


    fetch(url+'login', {
        method:'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type':'application/json'}
    })
        .then(resp => resp.json())
        .then(({msg, token}) => {
            if(msg){
                return console.error(msg)
            }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(e=> {
            console.log(e.value)
        })


})



function handleCredentialResponse(response) {
    const body = { id_token: response.credential }
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( r=> r.json() )
        .then( ({token}) =>{
            // console.log(resp )
            // localStorage.setItem('email', resp.usuario.correo )
            localStorage.setItem('token', token)

            window.location = 'chat.html'
        })
        .catch( console.warn )
}


const signOutButton = document.getElementById('googleSignOut')

signOutButton.onclick = () => {
    const email = localStorage.getItem('email')
    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(email, ()=> {
        localStorage.clear()
        location.reload()
    })
}