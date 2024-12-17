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
                username: null,
                nombre: null,
                apellidos: null,
                telefono: null,
                provincia: null,
                pueblo: null,
                direccion: null,
                rol: null
            },

            usuarios: [],

            eventos: [],

            entrevistas: [],

            carpetasFotos: [],

            sorteos: [],

            participaciones: [],

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
                        usuarios: data
                    });
                } catch (error) {
                    console.error("Error al obtener todos los usuarios")
                }
            },


            //Obtener un usuario a través de su id
            obtenerUsuarioPorId: async (idUsuario) => {
                const store = getStore();

                // if (!store.userData.id) {
                //     console.error('Id de usuario no disponible')
                //     return;
                // }
                try {
                    const respuesta = await fetch(`${store.backendUrl}/todoslosusuarios/${idUsuario}`, {
                        method: 'GET'
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json()
                    console.log('Datos del usuario recibidos: ', data)
                    if (data) {
                        const objetoUsuario = JSON.parse(localStorage.getItem('loginData'))
                        const detallesUsuario = {
                            email: data.usEmail,
                            password: data.usPssword,
                            username: data.usUsername,
                            nombre: data.usNombre || '',
                            apellidos: data.usApellidos || '',
                            telefono: data.usTelefono || '',
                            provincia: data.usProvincia || '',
                            pueblo: data.usPueblo || '',
                            direccion: data.usDireccion || '',
                            rol: data.usRol || '',
                            token: objetoUsuario.token || '',
                            id: data.usId || ''

                        }
                        // Guardar el objeto en localStorage (caché del navegador)
                        localStorage.setItem('userData', JSON.stringify(detallesUsuario));

                        setStore({
                            userData: detallesUsuario
                        });
                        console.log("Store actualizado: ", getStore());
                        return detallesUsuario;
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
                    const objetoUsuario = JSON.parse(localStorage.getItem('userData'))
                    const datosUsuario = {
                        id: data.usId,
                        email: data.usEmail,
                        nombre: data.usNombre,
                        apellidos: data.usApellidos,
                        telefono: data.usTelefono,
                        pueblo: data.usPueblo,
                        provincia: data.usProvincia,
                        direccion: data.usDireccion,
                        token: data.usToken,
                        username: objetoUsuario.username

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
                            rol: data.rol
                        };

                        localStorage.setItem('loginData', JSON.stringify(datoUsuario))


                        setStore({
                            ...store,
                            userData: datoUsuario
                        });
                        console.log("Datos:", data)
                        return (datoUsuario)
                    } else {
                        console.error("Error con token:", data)
                    }
                } catch (error) {
                    console.error("Error login:", error);
                }
            },

            //Verificación del password actual
            verificarpwactual: async (userId, password, email) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/verificarpwactual`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            usId: userId,
                            password: password,
                        })
                    })
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }

                    const data = await respuesta.json()
                    console.log("Respuesta del servidor: ", data)

                    return data.isValid;
                } catch (error) {
                    console.error('Error al verificar la contraseña:', error);
                    return false;
                }
            },



            // Función que cambia la contraseña en sí
            cambiopassword: async (usuarioId, password) => {
                const store = getStore();
                const actions = getActions();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/users/cambiopassword/${usuarioId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ usuarioId, password }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const data = await respuesta.json()
                    await actions.obtenerUsuarioPorId()

                    setStore({
                        usuarios: store.usuarios.map(usuario => (usuario.id === usuarioId ? data : usuario)),
                    })
                    if (respuesta.ok) {
                        return ('Cambio de contraseña realizado')
                    }
                } catch (error) {
                    console.error("Error al actualizar el password:", error)
                }

            },


            //Cerrar la sesión del perfil de usuario
            logOut: () => {
                const store = getStore();

                localStorage.clear();
                localStorage.removeItem("userData");
                setStore({
                    userData: null
                })
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
                            eventos: updateEventos
                        })
                    } else {
                        console.error('Error al eliminar el evento')
                    }

                } catch (error) {
                    console.error('Error en la solicitud de eliminación del evento', error)
                }
            },


            // -------------------------------------- >> ADMIN : GESTION USUARIOS<< ----------------------------------- //

            //Editar rol desde perfil de administrador
            admin_editar_rol: async (id, rol) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/editar/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({ rol }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json();
                    console.log("Respuesta servidor:", data)

                    //Se actualizan los datos del store. 
                    setStore({
                        usuarios: store.usuarios.map(usuario => usuario.usId === id ? { ...usuario, usRol: data.rol } : usuario)
                    });

                } catch (error) {
                    console.error('No ha sido posible actualizar:', error)
                }
            },


            //Eliminar un usuario desde perfil de administrador
            admin_eliminar_usuario_: async (usuarioId) => {
                const store = getStore();

                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/eliminarusuario/${usuarioId}`, {
                        method: 'DELETE',
                    });
                    if (respuesta.ok) {
                        console.log('Usuario eliminado con éxito');
                        const usuariosactuales = store.usuarios.filter(usuario => usuario.id !== usuarioId);
                        setStore({
                            usuarios: usuariosactuales
                        })
                    } else {
                        console.error('Error al eliminar al usuario')
                    }
                } catch (error) {
                    console.error('Error en la solicitud de eliminación:', error)
                }
            },


            // -------------------------------------- >> ADMIN : GESTION GALERIAS<< ----------------------------------- //

            //Crear nueva carpeta de imágenes desde perfil de administrador
            admin_crearCarpeta: async (formData) => {
                const store = getStore()
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/crearcarpeta`, {
                        method: 'POST',
                        body: formData
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    const carpetaCreada = await respuesta.json();
                    setStore({
                        carpetasFotos: [...store.carpetasFotos, carpetaCreada]
                    })
                    return carpetaCreada
                } catch (error) {
                    console.error("Network error:", error);
                    return null;
                }
            },


            //Recuperar las carpetas desde cloudinary y mostrarlas en elfront
            admin_mostrarCarpetas: async () => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/mostrarcarpetas`, {
                        method: 'GET'
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    const carpetas = await respuesta.json()
                    setStore({
                        carpetasFotos: carpetas
                    });

                } catch (error) {
                    console.error("Error al listar carpetas:", error)
                }
            },


            //subir foto desde perfil de administrador
            admin_subirfoto: async (formData) => {
                const store = getStore()
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/subirfoto`, {
                        method: 'POST',
                        body: formData
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    return await respuesta.json()
                } catch (error) {
                    console.error("Network error:", error);
                    return null;
                }
            },


            // -------------------------------------- >> ADMIN : GESTION ENTREVISTAS<< ----------------------------------- //

            // Función para agregar una ENTREVISTA desde el perfil de administrador
            admin_crearentrevista: async (fechaEntrevista, titularEntrevista, subtituloEntrevista, cuerpoEntrevista, fotoEntrevista) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/crearentrevista`, {
                        method: 'POST',
                        body: JSON.stringify({
                            fecha: fechaEntrevista,
                            titular: titularEntrevista,
                            subtitulo: subtituloEntrevista,
                            cuerpo: cuerpoEntrevista,
                            imagen: fotoEntrevista
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (!respuesta.ok) {
                        const error = await respuesta.json()
                        console.error("Error:", error)
                        return error;
                    }

                    const data = await respuesta.json()

                    if (data) {
                        setStore({
                            entrevistas: data
                        });
                        console.log("Success:", data);
                    } else {
                        console.error("Datos no recibidos:", data)
                    }
                } catch (error) {
                    console.error("Error:", error)
                }
            },

            //Función para editar una entrevista
            editarEntrevista: async (id, fecha, titular, subtitulo, cuerpo, imagen) => {
                const store = getStore()
                try {
                    const entrevistaCompleta = { fecha, titular, subtitulo, cuerpo, imagen }
                    const respuesta = await fetch(`${store.backendUrl}/admin/editarentrevista/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(entrevistaCompleta),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json();
                    setStore({
                        entrevistas: store.entrevistas.map((entrev) => (entrev.id === id ? entrevistaCompleta : entrev))
                    });
                    console.log('Entrevista actualizada', data)
                } catch (error) {
                    console.error('Error durante la edición de la entreivsta', error)
                }
            },

            //Para obtener todas las entrevistas
            obtenerEntrevistas: async () => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/obtenerentrevistas`, {
                        method: 'GET'
                    });
                    const data = await respuesta.json()
                    setStore({
                        entrevistas: data
                    });
                } catch (error) {
                    console.log(error)
                }
            },

            // #Función para borrar la foto de una entrevista
            elimfotoentrev: async (id) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/elimfotoentrev/${id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    const data = await respuesta.json()
                    console.log(data)

                    if (data.ok) {
                        console.log('Foto eliminada correctamente')
                    } else {
                        console.log('Error', data.error)
                    }
                } catch (error) {
                    console.error('Error al eliminar la foto', error)
                }
            },

            // Subir foto al crear una entrevista nueva
            admin_subirfoto_entrevista: async (formData) => {
                const store = getStore()
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/subirfoto_entrevista`, {
                        method: ['POST'],
                        body: formData
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    return await respuesta.json()
                } catch (error) {
                    console.error("Network error:", error);
                    return null;
                }
            },

            // Función para borrar una entrevista por id
            eliminarEntrevista: async (id) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/eliminarentrevista/${id}`, {
                        method: 'DELETE',
                    });
                    if (respuesta.ok) {
                        console.log("Entrevista eliminada con éxito");
                        const entrevistasActivas = store.entrevistas.filter(entrevista => entrevista.id !== id);
                        setStore({
                            entrevistas: entrevistasActivas
                        })
                    } else {
                        console.error('Error al eliminar la entrevista')
                    }
                } catch (error) {
                    console.error('Error en la solicitud de eliminación::', error)
                }
            },


            // -------------------------------------- >> ADMIN : GESTION SORTEOS<< ----------------------------------- //

            //Función para crear un sorteo nuevo
            crear_sorteo: async (nombre, descripcion, inicio, fin, imagen) => {
                const store = getStore()
                try {
                    const fechaInicio = format(new Date(inicio), 'dd/MM/yyyy')
                    const fechaFin = format(new Date(fin), 'dd/MM/yyyy')
                    const respuesta = await fetch(`${store.backendUrl}/admin/crearsorteo`, {
                        method: 'POST',
                        body: JSON.stringify({
                            nombreSorteo: nombre,
                            descripcionSorteo: descripcion,
                            inicioSorteo: fechaInicio,
                            finSorteo: fechaFin,
                            imagenSorteo: imagen,
                        }),
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!respuesta.ok) {
                        const error = await respuesta.json()
                        console.error("Error: ", error)
                        return error
                    }

                    const data = await respuesta.json()

                    if (data) {
                        setStore({
                            sorteos: data
                        });
                        console.log("success: ", data)
                    } else {
                        console.error("Datos no recibidos: ", data)
                    }

                } catch (error) {
                    console.error("Error: ", error)
                }
            },

            //Función para editar un sorteo
            editar_sorteo: async (id, nombre, descripcion, fechaInicio, fechaFin, imagen) => {
                const store = getStore();
                try {
                    const sorteoCompleto = { nombre, descripcion, fechaInicio, fechaFin, imagen }
                    const respuesta = await fetch(`${store.backendUrl}/admin/editarsorteo/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(sorteoCompleto),
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }

                    const data = await respuesta.json()
                    setStore({
                        sorteos: store.sorteos.map((sorteoExistente) =>
                            (sorteoExistente.id === id ? sorteoCompleto : sorteoExistente)
                        )

                    })
                    console.log('Sorteo actualizado: ', data)
                } catch (error) {
                    console.error('Error durante la edición del evento:', error)
                }

            },


            //Para obtener todos los sorteos
            obtenerSorteos: async () => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/obtenersorteos`, {
                        method: 'GET'
                    });
                    const data = await respuesta.json()
                    setStore({
                        sorteos: data
                    });
                    localStorage.setItem('sorteos', JSON.stringify(data))
                } catch (error) {
                    console.log(error)
                }
            },


            //Función para obtener un sorteo por ID
            obtenerSorteoPorId: async (idSorteo) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/sorteo/${idSorteo}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status: ${respuesta.status}`)
                    }
                    const data = await respuesta.json()
                    console.log(('Datos del sorteo: ', data));
                    if (data) {
                        const detalleSorteo = {
                            idSorteo: data.sorId,
                            nombreSorteo: data.sorNombre,
                            descripcionSorteo: data.sorDescripcion,
                            inicioSorteo: data.sorFechaInicio,
                            finSorteo: data.sorFechaFin,
                            imagen: data.sorImagen,
                            resultado: data.sorResultado
                        }
                        // setStore({ sorteos: detalleSorteo })
                        return detalleSorteo;
                    }
                } catch (error) {
                    console.error('Error al obtener los detalles del sorteo: ', error);
                }
            },


            //Función para eliminar un sorteo
            eliminarSorteo: async (id) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/eliminarsorteo/${id}`, {
                        method: 'DELETE',
                    });
                    if (respuesta.ok) {
                        console.log("Sorteo eliminado con éxito");
                        const sorteosActivos = store.sorteos.filter(sorteo => sorteo.id !== id);
                        setStore({
                            sorteos: sorteosActivos
                        })
                    } else {
                        console.error('Error al eliminar el sorteo')
                    }
                } catch (error) {
                    console.error('Error en la solicitud de eliminación: ', error)
                }
            },


            anadirResultado: async (sorteoId, userId) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(`${store.backendUrl}/resultado/${sorteoId}`,
                        {
                            method: "POST",
                            body: JSON.stringify({ id: userId }),
                            headers: { "Content-Type": "application/json" },
                        })
                    if (respuesta.ok) {
                        console.log("Resultado añadido con exito.");

                    } else {
                        console.log('Problema al añadir el resultado.');
                    }

                } catch (error) {
                    console.error('Error al crear la participación en el sorteo: ', error)

                }
            },


            // -------------------------------------- >> SORTEOS - VISTA USUARIO -<< ----------------------------------- //


            participarEnSorteo: async (sorteoID, userID) => {
                const store = getStore();
                try {
                    const respuesta = await fetch(
                        `${store.backendUrl}/participar/${sorteoID}`,
                        {
                            method: "POST",
                            body: JSON.stringify({ id: userID }),
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    if (respuesta.ok) {
                        console.log("Participación creada con éxito.");

                    } else {
                        console.log('Problema al crear la participación al sorteo.');
                    }
                } catch (error) {
                    console.error('Error al crear la participación en el sorteo: ', error)
                }
            },






            // -------------------------------------- >> VISOR DE FOTOS POR CARPETA<< ----------------------------------- //

            //Mostrar el contenido de las carpetas de cloudinary
            mostrarImagenesCarpeta: async (nombreCarpeta) => {
                const store = getStore()
                try {
                    const respuesta = await fetch(`${store.backendUrl}/admin/mostrarImagenesCarpetas/${nombreCarpeta}`, {
                        method: 'GET'
                    });
                    if (!respuesta.ok) {
                        throw new Error(`HTTP error! status ${respuesta.status}`);
                    }
                    return await respuesta.json()

                } catch (error) {
                    console.error("Network error:", error);
                    return null;
                }
            },














        }
    };
};

export default getState;