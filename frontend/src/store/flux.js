const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            backendUrl: 'http://127.0.0.1:5000', // URL del backend

            error: null,

            userData: JSON.parse(localStorage.getItem('userData')) || {
                token: null,
                us_id: null,
                us_email: null,
                us_password: null,
                us_userName: null,
                us_nombre: null,
                us_apellidos: null,
                us_telefono: null,
                us_provincia: null,
                us_pueblo: null,
                us_direccion: null,
                us_rol: null
            },


            usuarios: [],

        },

        actions: {

            // ---------- >> USUARIOS, ACCESO Y CREACIÓN DE TOKENS << ------------- //

            //Creación de un nuevo usuario
            crear_usuario: async (email, userName, password) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/registro`, {
                        method: 'POST',
                        body: JSON.stringify({
                            usEmail: email,
                            usUserName: userName,
                            usPassword: password
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await respuesta.json();

                    if (data.access_token) {
                        const datosRecogidos = {
                            token: data.access_token,
                            userName: data.usUsername,
                            email: data.usEmail,
                            id: data.usId
                        };
                        // Guardamos el objeto anterior en el localStorage, dentro de userData
                        localStorage.setItem('userData', JSON.stringify(datosRecogidos))

                        // Actualizamos el store con los nuevos datos 
                        setStore({
                            userData: datosRecogidos,
                            error: null
                        });
                        console.log(("Datos del usuario recogidos:", datosRecogidos));
                        // window.location.href = '/completar-datos'; // Asumiendo que esta es la ruta de la página de "completar datos"
                    } else {
                        // Si no se obtiene el access_token, entonces hubo un error
                        setStore({
                            error: data.error || 'Error desconocido al crear el usuario'
                        });
                        console.error("Error con el token:", data);
                    }
                } catch (error) {
                    console.error("Error en el registro:", error)
                }
            },

            //Obtener todos los usuarios
            obtenerTodosLosUsuarios: async () => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/todoslosusuarios`, {
                        method: 'GET'
                    });
                    const data = await respuesta.json();
                    setStore({
                        ...store,
                        usuarios: data
                    });
                } catch (error) {
                    console.error("Error al obtener todos los usuarios")
                }
            },


            //Obtener un usuario a través de su id
            obtenerUsuarioPorId: async () => {
                const store = getStore();

                if (!store.userData.us_id) {
                    console.error('Id de usuario no disponible')
                    return;
                }
                try {
                    const respuesta = await fetch(`${store.backendUrl}/todoslosusuarios/${store.userData.us_id}`, {
                        method: 'GET'
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json()
                    console.log('Datos del usuario recibidos: ', data)
                    if (data) {
                        const detallesUsuario = {
                            ...store.userData, //cogemos lo que hay en userData, y lo actualizamos con lo siguiente
                            us_email: data.email,
                            us_password: data.password,
                            us_userName: data.userName,
                            us_name: data.name || '',
                            us_apellidos: data.apellidos || '',
                            us_telefono: data.telefono || '',
                            us_provincia: data.provincia || '',
                            us_pueblo: data.pueblo || '',
                            us_direccion: data.direccion || ''
                        }
                        // Guardar el objeto en localStorage (caché del navegador)
                        localStorage.setItem('userData', JSON.stringify(detallesUsuario));

                        setStore({
                            ...store,
                            userData: detallesUsuario
                        });
                        console.log("Store actualizado: ", getStore());
                    }
                } catch (error) {
                    console.error('Error al obtener los detalles del usuario ', error)
                }
            },






        }
    };
};

export default getState;