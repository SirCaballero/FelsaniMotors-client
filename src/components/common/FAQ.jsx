const FAQ = () => {

    const preguntas = [
        {
            pregunta: "¿Cómo puedo comprar un vehículo en Felsani Motors?",
            respuesta: "Para comprar un vehículo, primero debes registrarte en nuestra plataforma. Luego, navega por nuestro catálogo, selecciona el auto que te interese y haz clic en 'Comprar'. Podrás agregarlo al carrito y proceder con el pago. Nuestro equipo se contactará contigo para coordinar la entrega y documentación."
        },
        {
            pregunta: "¿Qué métodos de pago aceptan?",
            respuesta: "Aceptamos múltiples métodos de pago para tu comodidad: efectivo, transferencias bancarias, cheques certificados y financiación a través de nuestros socios bancarios. También ofrecemos planes de financiación personalizados según tu situación crediticia. Para más detalles sobre financiación, consulta con nuestro equipo de ventas."
        },
        {
            pregunta: "¿Todos los vehículos incluyen inspección técnica?",
            respuesta: "Sí, todos nuestros vehículos pasan por una rigurosa inspección técnica de 50 puntos antes de ser publicados. Esto incluye revisión de motor, frenos, transmisión, sistema eléctrico, neumáticos y carrocería. Cada auto viene con un certificado de inspección y garantía de funcionamiento por 30 días."
        },
        {
            pregunta: "¿Puedo vender mi auto a través de Felsani Motors?",
            respuesta: "¡Por supuesto! Ofrecemos un servicio completo de venta de vehículos. Puedes publicar tu auto en nuestra plataforma de forma gratuita. Nuestro equipo te ayudará con la tasación, fotografías profesionales, redacción de la descripción y gestión de la venta. También manejamos toda la documentación y trámites legales."
        },
        {
            pregunta: "¿Qué garantías ofrecen en los vehículos usados?",
            respuesta: "Todos nuestros vehículos usados incluyen una garantía básica de 30 días que cubre fallas mecánicas mayores. Adicionalmente, ofrecemos garantías extendidas opcionales de 6 meses o 1 año que cubren motor, transmisión y sistema eléctrico. También incluimos asistencia en ruta las 24 horas durante el período de garantía."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-16">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-paleta1-blue mb-4">
                        Preguntas Frecuentes
                    </h1>
                </div>

                {/* FAQ Items */}
                <div className="space-y-6">
                    {preguntas.map((item, index) => (
                        <div 
                            key={index}
                            className="p-6"
                        >
                            {/* Pregunta */}
                            <h3 className="text-lg font-semibold text-paleta1-blue mb-4">
                                {item.pregunta}
                            </h3>
                            
                            {/* Respuesta */}
                            <p className="text-gray-700 leading-relaxed">
                                {item.respuesta}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;