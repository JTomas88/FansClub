import React, { useState } from "react"; // Importamos useContext
import getState from "./flux.js";  // Importamos el archivo flux.js

// Creamos el contexto de la aplicación
export const Context = React.createContext(null);

// Función que inyecta el contexto en los componentes
const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        // Usamos useState para almacenar el estado y las acciones de Flux
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: (updatedStore) =>
                    setState({
                        store: { ...state.store, ...updatedStore },  // Actualizamos el estado
                        actions: { ...state.actions },  // Conservamos las acciones
                    }),
            })
        );

        // Extraemos store y actions desde el contexto
        const { store, actions } = state;



        return (
            <Context.Provider value={state}>  {/* Proveemos el contexto a los componentes */}
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    return StoreWrapper;
};

export default injectContext;  // Exportamos la función para inyectar el contexto