import React, { useState } from "react";
import getState from "./flux.js";

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
                        store: { ...state.store, ...updatedStore },
                        actions: { ...state.actions },
                    }),
            })
        );


        const { store, actions } = state;



        return (
            <Context.Provider value={state}>  {/* Proveemos el contexto a los componentes */}
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    return StoreWrapper;
};

export default injectContext;  