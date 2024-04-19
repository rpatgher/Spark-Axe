import React, { useState } from 'react';
import './VerticalTabs.css';
// **************** Images ****************
import TiendaM from '../../assets/img/TiendaM.png';

function VerticalTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="vertical-tabs">
      <div className="tab-menu">
        <button
          id='tab'
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => handleTabClick(0)}
        >
          Perfil Tienda
        </button>
        <button
          id='tab'
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => handleTabClick(1)}
        >
          Especificaciones
        </button>
      </div>
      <div className='hello'>
  <div className='hello2'>
    </div>
    <div className='hello3'>
    </div>
      </div>
      <div className="tab-content">
        {activeTab === 0 && <div>Content for Tab 1</div>}
        {activeTab === 1 && (
          <div>
          <p><strong>Nombre de tienda</strong></p>
          <p>Elibaba</p>
          <p><strong>Tipo de Sitio Web</strong></p>
          <p>E-commerce</p>
          <p><strong>Administrador</strong></p>
          <p>Eli Knanni</p>
          <p><strong>Descripcion de la tienda</strong></p>
          <p>Tienda de vapes</p>

          <h3>Avatar</h3>
          <div className="image-grid">
            <div className="image-item">
              <img
                className='StoreAvatar'
                src={TiendaM}
                alt="Image 1"
                onClick={() => replaceWithInput(this)}
              />
            </div>
           
              <button className={activeTab === 2 ? 'active' : ''}
        onClick={() => handleTabClick(2)}>Edit</button>
            </div>
          </div>
          
        )}
        {activeTab === 2 && (
         <div>
         <p>Nombre de tienda</p>
         <input type="text" />
         <p>Tipo de Sitio Web</p>
         <select >
           <option value="option1">Option 1</option>
           <option value="option2">Option 2</option>
           <option value="option3">Option 3</option>
         </select>
         <p>Administrador</p>
         <select >
           <option value="option1">Option 1</option>
           <option value="option2">Option 2</option>
           <option value="option3">Option 3</option>
         </select>
         <p>Descripcion de la tienda</p>
         <textarea ></textarea>

         <h3>Avatar</h3>
         <hr />
         <div className="image-grid">
           <div className="image-item">
             <img
               className='StoreAvatar'
               src={TiendaM}
               alt="Image 1"
               onClick={() => replaceWithInput(this)}
             />
           </div>
           <div className="image-item">
             <img
               className='StoreAvatar'
               src={TiendaM}
               alt="Image 2"
               onClick={() => replaceWithInput(this)}
             />
           </div>
           <div className="image-item">
             <img
               className='StoreAvatar'
               src={TiendaM}
               alt="Image 3"
               onClick={() => replaceWithInput(this)}
             />
           </div>
           <div className="image-item">
             <img
               className='StoreAvatar'
               src={TiendaM}
               alt="Image 4"
               onClick={() => replaceWithInput(this)}
             />
           </div>
           <div className="image-item">
             <img
               className='StoreAvatar'
               src={TiendaM}
               alt="Image 5"
               onClick={() => replaceWithInput(this)}
             />
             </div>
          
         </div>
         <button className={activeTab === 1 ? 'active' : ''}
       onClick={() => handleTabClick(1)}>Save changes</button>
       </div> 
          
        )}
        
        
      </div>
    </div>
  );
}

export default VerticalTabs;

