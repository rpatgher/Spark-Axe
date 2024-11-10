import React, { useState } from 'react';
import styles from './Questions.module.css';
import { Link } from 'react-router-dom';

function Questions() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const answers = [
    "El dashboard es una plataforma centralizada desde la cual puedes gestionar todo lo relacionado con tu tienda en línea, como inventario, clientes, productos y pedidos, de manera sencilla y eficiente.",
    "Puedes gestionar inventario, añadir o editar productos, monitorear pedidos, administrar información de clientes y generar reportes de ventas.",
    "En la sección de 'Inventario' puedes ver, agregar, modificar o eliminar productos, así como ajustar cantidades de stock.",
    "Sí, en la sección 'Pedidos' puedes ver el estado de cada pedido y gestionar procesos como envíos, devoluciones o cancelaciones.",
    "Sí, el dashboard te permite generar reportes detallados de ventas, analizar el rendimiento de productos y revisar las tendencias de compra de tus clientes.",
    "Claro, en la sección de 'Anuncios' puedes crear y gestionar promociones, configurar descuentos y enviarlos a tus clientes o publicarlos en tu tienda.",
    "No es necesario tener experiencia técnica. El dashboard está diseñado para ser intuitivo y fácil de usar, con una interfaz amigable para cualquier usuario.",
    "Si necesitas ayuda, puedes acceder a la sección de 'Soporte' dentro de la pagina de inicio y contactar a nuestro equipo por chat o correo electrónico."
  ];

  return (
    <div>
      <div className={styles.States}>
        <Link to='/contact'>
          <button className={styles.goback}><i className="fa-solid fa-arrow-left"></i> Regresar</button>
        </Link>
        <h2>Preguntas Frequentes</h2>

        {['¿Cómo funciona el dashboard de administración?', 
          '¿Qué puedo hacer desde el dashboard?', 
          '¿Cómo actualizo mi inventario?', 
          '¿Puedo gestionar mis pedidos desde el dashboard?', 
          '¿Puedo ver reportes de ventas?', 
          '¿Es posible crear promociones o anuncios desde el dashboard?', 
          '¿Necesito experiencia técnica para usar el dashboard?', 
          '¿Qué hago si tengo problemas con la plataforma?']
          .map((question, index) => (
            <div key={index}>
              <button
                className={`${styles.accordion} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                {question}
                <i className={`fa-solid fa-caret-down ${activeIndex === index ? styles.rotate : ''}`}></i>
              </button>
              <div className={styles.panel} style={{ display: activeIndex === index ? 'block' : 'none' }}>
                <p>{answers[index]}</p>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default Questions;
