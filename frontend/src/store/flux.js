import { parse, format } from 'date-fns';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            backendUrl: 'http://127.0.0.1:5000', // URL del backend

            error: null,

            userData: JSON.parse(localStorage.getItem('userData')) || {
                token: null,
                id: null,
                email: null,
                password: null,
                userName: null,
                nombre: null,
                pellidos: null,
                telefono: null,
                provincia: null,
                pueblo: null,
                direccion: null,
                rol: null
            },


            usuarios: [],

            eventos: [],

        },

        actions: {

            // ------------------------------- >> USUARIOS, ACCESO Y CREACIÓN DE TOKENS << -------------------------------- //

            //Creación de un nuevo usuario
            crear_usuario: async (email, userName, password) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/registro`, {
                        method: 'POST',
                        body: JSON.stringify({
                            usEmail: email,
                            usUsername: userName,
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
                        window.location.href = '/completar-registro'; // Asumiendo que esta es la ruta de la página de "completar registro"
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


            //Editar datos desde perfil de usuario - Completar registro
            editar_usuario: async (usuarioId, token, email, nombre, apellidos, telefono, pueblo, provincia, direccion) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/usuario/editar/${usuarioId}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            usToken: token,
                            usId: usuarioId,
                            usEmail: email,
                            usNombre: nombre,
                            usApellidos: apellidos,
                            usTelefono: telefono,
                            usPueblo: pueblo,
                            usProvincia: provincia,
                            usDireccion: direccion
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json();
                    console.log('Datos de usuario: ', data)
                    const datosUsuario = {
                        id: data.usId,
                        email: data.usEmail,
                        nombre: data.usNombre,
                        apellidos: data.usApellidos,
                        telefono: data.usTelefono,
                        pueblo: data.usPueblo,
                        provincia: data.usProvincia,
                        direccion: data.usDireccion,
                        token: data.usToken
                    };
                    localStorage.setItem('userData', JSON.stringify(datosUsuario))

                    setStore({
                        ...store,
                        usuarios: store.usuarios.map(usuario => (usuario.usId === usuarioId ? data : usuario))
                    })
                    setStore({
                        userData: datosUsuario
                    })
                } catch (error) {
                    console.error("Error al actualizar el usuario:", error)
                }
            },


            // --Login a la pagina y creación de token
            login: async (email, password) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/login`, {
                        method: "POST",
                        body: JSON.stringify({ email, password }),
                        headers: { "Content-Type": "application/json" }
                    });
                    const data = await respuesta.json()

                    if (data.token) {
                        const datoUsuario = {
                            token: data.token,
                            username: data.username,
                            email: data.email,
                            id: data.id,
                            role: data.role
                        };

                        localStorage.setItem('userData', JSON.stringify(datoUsuario))

                        setStore({
                            ...store,
                            userData: datoUsuario
                        });
                        console.log("Datos:", data)
                    } else {
                        console.error("Error con token:", data)
                    }
                } catch (error) {
                    console.error("Error login:", error);
                }
            },









            // --------------------------------------- >> API GOOGLE MAPS << ----------------------------------------------- //

            //Busca una localidad según los caracteres que introduzca el usuario
            buscarlocalidad: async (query) => {
                const store = getStore()
                try {
                    const respuesta = await fetch(`${store.backendUrl}/buscar_localidad?q=${query}`, {
                        method: 'GET',
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    return respuesta;

                } catch (error) {
                    console.error("Network error:", error);
                }
            },




            // -------------------------------------- >> ADMIN : AGENDA Y CONCIERTOS << ----------------------------------- //

            //crear evento desde perfil de administrador
            admin_crearevento: async (fecha, poblacion, provincia, lugar, hora, entradas, observaciones) => {
                const store = getStore();
                try {
                    const fechaFormateada = format(new Date(fecha), 'dd/MM/yyyy')
                    const respuesta = await fetch(`${store.backendUrl}/admin/crearevento`, {
                        method: 'POST',
                        body: JSON.stringify({
                            evFecha: fechaFormateada,
                            evPoblacion: poblacion,
                            evProvincia: provincia,
                            evLugar: lugar,
                            evHora: hora,
                            evEntradas: entradas,
                            evObservaciones: observaciones
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!respuesta.ok) {
                        const error = await respuesta.json();
                        console.error("Error:", error)
                        return error;
                    }

                    const data = await respuesta.json();


                    if (data) {
                        setStore({
                            ...store,
                            eventos: data
                        });
                        console.log("Success:", data);
                    } else {
                        console.error("Datos no recibidos:", data)
                    }
                } catch (error) {
                    console.error("Error:", error)
                }
            },


            //Función para obtener todos los eventos creados
            admin_obtenereventos: async () => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/obtenereventos`, {
                        method: 'GET'
                    });
                    const data = await respuesta.json();
                    setStore({
                        ...store,
                        eventos: data
                    });

                } catch (error) {
                    console.log(error)
                }
            },


            // #Función para editar un evento de la agenda
            admin_editarevento: async (evento, eventoId) => {
                const store = getStore()
                try {
                    const fechaDate = new Date(evento.evFecha);
                    if (isNaN(fechaDate.getTime())) {
                        throw new Error("Error al parsear la fecha, formato incorrecto.");
                    }
                    const fechaFormateada = format(fechaDate, 'dd/MM/yyyy');
                    evento.evFecha = fechaFormateada;
                    const respuesta = await fetch(`${store.backendUrl}/admin/editarevento/${eventoId}`, {
                        method: 'PUT',
                        body: JSON.stringify(evento),
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const data = await respuesta.json();
                    setStore({
                        ...store,
                        eventos: store.eventos.map((evt) => (evt.id === eventoId ? { ...evt, ...evento } : evt))
                    });
                    console.log('Evento actualizado:', data);
                } catch (error) {
                    console.error('Error durante la edición del evento:', error)
                }
            },


            // #Función para eliminar un evento de la agenda
            admin_eliminarevento: async (eventoid) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/eliminarevento/${eventoid}`, {
                        method: 'DELETE',
                    });
                    if (respuesta.ok) {
                        console.log('Evento eliminado exitosamente');
                        const updateEventos = store.eventos.filter(evs => evs.id !== eventoid);
                        setStore({
                            ...store,
                            eventos: updateEventos
                        })
                    } else {
                        console.error('Error al eliminar el evento')
                    }

                } catch (error) {
                    console.error('Error en la solicitud de eliminación del evento', error)
                }
            },














        }
    };
};

export default getState;