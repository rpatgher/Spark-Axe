import React, { useState } from 'react';
import styles from './Questions.module.css';
import { Link } from 'react-router-dom';

function Questions() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
     
<div className={styles.States}>
<Link to='/contact'> <button className={styles.goback}><i className="fa-solid fa-arrow-left"  ></i>  Regresar</button></Link>
<h2>Preguntas Frequentes</h2>
<div>
</div>
      <button
        className={`${styles.accordion} ${activeIndex === 0 ? styles.active : ''}`}
        onClick={() => toggleAccordion(0)}
      >
       ¿Cómo funciona el dashboard de administración?
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 0 ? 'block' : 'none' }}>
        <p>
        El dashboard es una plataforma centralizada desde la cual puedes gestionar todo lo relacionado con tu tienda en línea, como inventario, clientes, productos y pedidos, de manera sencilla y eficiente.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 1 ? styles.active : ''}`}
        onClick={() => toggleAccordion(1)}
      >
        ¿Qué puedo hacer desde el dashboard?
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 1 ? 'block' : 'none' }}>
        <p>
        Puedes gestionar inventario, añadir o editar productos, monitorear pedidos, administrar información de clientes y generar reportes de ventas.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 2 ? styles.active : ''}`}
        onClick={() => toggleAccordion(2)}
      >
       ¿Cómo actualizo mi inventario?
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 2 ? 'block' : 'none' }}>
        <p>
        En la sección de "Inventario" puedes ver, agregar, modificar o eliminar productos, así como ajustar cantidades de stock.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 3 ? styles.active : ''}`}
        onClick={() => toggleAccordion(3)}
      >
       ¿Puedo gestionar mis pedidos desde el dashboard?
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 3 ? 'block' : 'none' }}>
        <p>
        Sí, en la sección "Pedidos" puedes ver el estado de cada pedido y gestionar procesos como envíos, devoluciones o cancelaciones.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 4 ? styles.active : ''}`}
        onClick={() => toggleAccordion(4)}
      >
       ¿Puedo ver reportes de ventas?
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 4 ? 'block' : 'none' }}>
        <p>
        Sí, el dashboard te permite generar reportes detallados de ventas, analizar el rendimiento de productos y revisar las tendencias de compra de tus clientes.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 5 ? styles.active : ''}`}
        onClick={() => toggleAccordion(5)}
      >
      ¿Es posible crear promociones o anuncios desde el dashboard?

</button>
      <div className={styles.panel} style={{ display: activeIndex === 5 ? 'block' : 'none' }}>
        <p>
        Claro, en la sección de "Anuncios" puedes crear y gestionar promociones, configurar descuentos y enviarlos a tus clientes o publicarlos en tu tienda.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 6 ? styles.active : ''}`}
        onClick={() => toggleAccordion(6)}
      >
      ¿Necesito experiencia técnica para usar el dashboard?

</button>
      <div className={styles.panel} style={{ display: activeIndex === 6 ? 'block' : 'none' }}>
        <p>
        No es necesario tener experiencia técnica. El dashboard está diseñado para ser intuitivo y fácil de usar, con una interfaz amigable para cualquier usuario.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 7 ? styles.active : ''}`}
        onClick={() => toggleAccordion(7)}
      >
      ¿Qué hago si tengo problemas con la plataforma?

</button>
      <div className={styles.panel} style={{ display: activeIndex === 7 ? 'block' : 'none' }}>
        <p>
        Si necesitas ayuda, puedes acceder a la sección de "Soporte" dentro de la pagina de inicio y contactar a nuestro equipo por chat o correo electrónico.
        </p>
      </div>

     

    </div>
    </div>
  );
}

export default Questions;
