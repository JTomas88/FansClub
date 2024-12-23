import React, { useContext, useEffect } from "react";

export const ModalProteccionDatos = () => {
    return (
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 text-dark" id="modalProteccionDatosLabel">Información sobre la empresa y datos de contacto</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p className="text-dark" style={{ textAlign: 'justify', fontSize: '13px' }}>

                        Esta política de privacidad se aplica al sitio web de "Sienna Fans Club", en
                        adelante "Sienna FC". Nos comprometemos a proteger su privacidad y
                        los datos personales que nos proporcione. Para cualquier pregunta o solicitud
                        relacionada con sus datos, puede contactarnos a través de: <br></br><br></br>

                        Correo electrónico: sienna.fansmusic@gmail.com <br></br><br></br>


                        La presente Política de Privacidad establece los términos en que usa y protege la
                        información que es proporcionada por sus usuarios al momento de utilizar su sitio
                        web. Esta compañía está comprometida con la seguridad de los datos de sus
                        usuarios. Cuando le pedimos llenar los campos de información personal con la cual
                        usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de
                        acuerdo con los términos de este documento. Sin embargo esta Política de
                        Privacidad puede cambiar con el tiempo o ser actualizada por lo que le
                        recomendamos y enfatizamos revisar continuamente esta página para asegurarse
                        que está de acuerdo con dichos cambios.
                        Información que es recogida
                        Nuestro sitio web podrá recoger información personal por ejemplo: Nombre,
                        información de contacto como su dirección de correo electrónica e información
                        demográfica. Así mismo cuando sea necesario podrá ser requerida información
                        específica para procesar algún pedido o realizar una entrega o facturación.
                        Uso de la información recogida
                        Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio
                        posible, particularmente para mantener un registro de usuarios, de pedidos en caso
                        que aplique, y mejorar nuestros productos y servicios. Es posible que sean
                        enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas
                        especiales, nuevos productos y otra información publicitaria que consideremos
                        relevante para usted o que pueda brindarle algún beneficio, estos correos
                        electrónicos serán enviados a la dirección que usted proporcione y puede
                        cancelarlos en cualquier momento mediante…podrán ser cancelados en cualquier
                        momento.
                        Estamos altamente comprometidos para cumplir con el compromiso de mantener su
                        información segura. Usamos los sistemas más avanzados y los actualizamos
                        constantemente para asegurarnos que no exista ningún acceso no autorizado.
                        Conservaremos sus datos personales durante el tiempo necesario para cumplir con
                        los fines para los que fueron recopilados y para cumplir con nuestras obligaciones
                        legales. Una vez que ya no necesitemos sus datos, los eliminaremos de forma
                        segura.
                    </p>


                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>

    )
}