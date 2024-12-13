import React, { useContext, useEffect } from "react";

export const ModalUsoCookies = () => {
    return (
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 text-dark" id="modalUsoCookiesLabel">Cookies</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p className="text-dark" style={{ textAlign: 'justify', fontSize: '13px' }}>
                        Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar
                        permiso para almacenarse en su ordenador para procesar los datos, al aceptar
                        dicho fichero se crea y la cookie sirve entonces para tener información respecto al
                        tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función
                        que tienen las cookies es que con ellas las web pueden reconocerte individualmente
                        y por tanto brindarte el mejor servicio personalizado de su web.
                        Nuestro sitio web emplea las cookies para poder identificar las páginas que son
                        visitadas y su frecuencia. Esta información es empleada únicamente para análisis
                        estadístico y después la información se elimina de forma permanente. Usted puede
                        eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las
                        cookies ayudan a proporcionar un mejor servicio de los sitios web, estás no dan
                        acceso a información de su ordenador ni de usted, a menos de que usted así lo
                        quiera y la proporcione directamente. Usted puede aceptar o negar el uso de
                        cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente
                        pues sirve para tener un mejor servicio web. También usted puede cambiar la
                        configuración de su ordenador para declinar las cookies. Si se declinan es posible
                        que no pueda utilizar algunos de nuestros servicios. <br></br><br></br>
                        <strong> Enlaces a Terceros </strong> <br></br>
                        Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su
                        interés. Una vez que usted dé clic en estos enlaces y abandone nuestra página, ya
                        no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos
                        responsables de los términos o privacidad ni de la protección de sus datos en esos
                        otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad
                        por lo cual es recomendable que los consulte para confirmar que usted está de
                        acuerdo con estas. <br></br><br></br>
                        <strong> Servicios de Terceros </strong> <br></br>
                        Utilizamos servicios de terceros para mejorar la funcionalidad de nuestro sitio web y
                        analizar su uso. Estos servicios pueden recopilar información sobre su actividad en
                        línea. A continuación se detallan los servicios que utilizamos y sus respectivas
                        políticas de privacidad: </p>

                    <ul>
                        <li>
                            ● Google Analytics: Se utiliza para analizar el tráfico y el comportamiento de
                            los usuarios en nuestro sitio web. Consulte la política de privacidad de
                            Google Analytics para obtener más información.
                        </li>
                    </ul>




                    <br></br>
                    <strong>Otros</strong><br></br>
                    Control de su información personal <br></br>
                    Usted tiene los siguientes derechos en relación con sus datos personales:
                    <ul >
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho de acceso: Puede solicitar una copia de los datos personales que
                            tenemos sobre usted.
                        </li>
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho de rectificación: Puede solicitar que corrijamos cualquier dato
                            personal inexacto.
                        </li>
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho de supresión (derecho al olvido): Puede solicitar que eliminemos
                            sus datos personales en determinadas circunstancias.
                        </li>
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho de oposición: Puede oponerse al procesamiento de sus datos
                            personales en determinadas circunstancias.
                        </li>
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho a la portabilidad de los datos: Puede solicitar que le
                            proporcionemos sus datos personales en un formato estructurado, de uso
                            común y lectura mecánica.
                        </li>
                        <li style={{ fontSize: '13px' }}>
                            ● Derecho a la limitación del tratamiento: Puede solicitar que limitemos el
                            procesamiento de sus datos personales en determinadas circunstancias.
                        </li>
                    </ul>
                    <p>
                        Para ejercer sus derechos, póngase en contacto con nosotros utilizando los datos
                        de contacto proporcionados anteriormente.
                        En cualquier momento usted puede restringir la recopilación o el uso de la
                        información personal que es proporcionada a nuestro sitio web. Cada vez que se le
                        solicite rellenar un formulario, como el de alta de usuario, puede marcar o
                        desmarcar la opción de recibir información por correo electrónico. En caso de que
                        haya marcado la opción de recibir nuestro boletín o publicidad usted puede
                        cancelarla en cualquier momento, enviando un correo a sienna.fansclub@gmail.com
                        Esta compañía no venderá, cederá ni distribuirá la información personal que es
                        recopilada sin su consentimiento, salvo que sea requerido por un juez con una
                        orden judicial.
                    </p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>

    )
}