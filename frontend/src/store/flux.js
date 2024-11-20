const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            backendUrl: 'http://127.0.0.1:5000', // URL del backend



        },

        actions: {

            // ## -------------------->>> USUARIOS, LOGIN Y CREACIÓN TOKEN <<<----------------------- ##

            //Creación de un nuevo usuario
            // crear_usuario: async (email, userName, password) => {
            //     const store = getStore();
            //     try {
            //         const respuesta = await fetch(`${store.backendUrl}/registro`, {
            //             method: 'POST',
            //             body: JSON.stringify({ email, userName, password }),
            //             headers: { 'Content-Type': 'application/json' }
            //         });
            //         const data = await respuesta.json();

            //         if (data.access_token) {
            //             const userData = {
            //                 token: data.access_token,
            //                 userName: data.us_userName,
            //                 email: data.us_email,
            //                 id: data.us_id
            //             };
            //             // Guardamos el objeto anterior en el localStorage, dentro de userData
            //             localStorage.setItem('userData', JSON.stringify(userData))

            //             // Actualizamos el store con los nuevos datos 
            //             setStore({
            //                 ...store,
            //                 userData: userData
            //             });
            //             console.log(("Datos:", data));
            //         } else {
            //             console.error("error con token: ", data)
            //         }
            //     } catch (error) {
            //         console.error("Error en el registro:", error)
            //     }
            // },

            // //Obtener todos los usuarios
            // obtenerTodosLosUsuarios: async () => {
            //     const store = getStore();
            //     try {
            //         const respuesta = await fetch(`${store.backendUrl}/todoslosusuarios`, {
            //             method: 'GET'
            //         });
            //         const data = await respuesta.json();
            //         setStore({
            //             ...store,
            //             usuarios: data
            //         });
            //     } catch (error) {
            //         console.error("Error al obtener todos los usuarios")
            //     }
            // },


            // //Obtener un usuario a través de su id
            // obtenerUsuarioPorId: async () => {
            //     const store = getStore();

            //     if (!store.userData.us_id) {
            //         console.error('Id de usuario no disponible')
            //         return;
            //     }
            //     try {
            //         const respuesta = await fetch(`${store.backendUrl}/todoslosusuarios/${store.userData.us_id}`, {
            //             method: 'GET'
            //         });
            //         if (!respuesta.ok) {
            //             throw new Error(`HTTP error! status: ${respuesta.status}`)
            //         }
            //         const data = await respuesta.json()
            //         console.log('Datos del usuario recibidos: ', data)
            //         if (data) {
            //             const detallesUsuario = {
            //                 ...store.userData, //cogemos lo que hay en userData, y lo actualizamos con lo siguiente
            //                 us_email: data.email,
            //                 us_password: data.password,
            //                 us_userName: data.userName,
            //                 us_name: data.name || '',
            //                 us_apellidos: data.apellidos || '',
            //                 us_telefono: data.telefono || '',
            //                 us_provincia: data.provincia || '',
            //                 us_pueblo: data.pueblo || '',
            //                 us_direccion: data.direccion || ''
            //             }
            //             // Guardar el objeto en localStorage (caché del navegador)
            //             localStorage.setItem('userData', JSON.stringify(detallesUsuario));

            //             setStore({
            //                 ...store,
            //                 userData, detallesUsuario
            //             });
            //             console.log("Store actualizado: ", getStore());
            //         }
            //     } catch (error) {
            //         console.error('Error al obtener los detalles del usuario ', error)
            //     }
            // },


            // //Login a la página y creación del token
            // login: async (email, password) => {
            //     const store = getStore();
            //     try {
            //         const respuesta = await fetch(`${store.backendUrl}/login`, {
            //             method: 'POST',
            //             body: JSON.stringify({ email, password }),
            //             headers: { 'Content-Type': 'application/json' }
            //         });
            //         const data = await respuesta.json()

            //         if (data.token) {
            //             const datoUsuario = {
            //                 token: data.token,
            //                 us_userName: data.userName,
            //                 us_email: data.email,
            //                 us_id: data.id,
            //                 us_rol: data.rol
            //             };
            //             localStorage.setItem('userData', JSON.stringify(datoUsuario))

            //             setStore({
            //                 ...store,
            //                 userData, datoUsuario
            //             })
            //             console.log("Datos: ", data)
            //         } else {
            //             console.error("Error con el token: ", data)
            //         }
            //     } catch (error) {
            //         console.error("Error login: ", error)
            //     }
            // },


        }
    };
};

export default getState;