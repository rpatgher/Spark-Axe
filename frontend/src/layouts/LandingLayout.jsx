// ParentComponent.js
import React from 'react';
import { Outlet } from 'react-router-dom';

function Landinglayout() {
  return (
    <div>
      <h2>Parent Component</h2>
      <Outlet /> {/* This will render child routes here */}
    </div>
  );
}

export default Landinglayout;
