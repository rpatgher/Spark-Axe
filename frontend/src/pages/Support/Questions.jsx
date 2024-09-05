import React, { useState } from 'react';
import styles from './Questions.module.css';

function Questions() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
     
<div className={styles.States}>
<h2>Accordion</h2>
<div>
  <button>Search</button>
  <button>Filter</button>
</div>
      <button
        className={`${styles.accordion} ${activeIndex === 0 ? styles.active : ''}`}
        onClick={() => toggleAccordion(0)}
      >
        Section 1
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 0 ? 'block' : 'none' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 1 ? styles.active : ''}`}
        onClick={() => toggleAccordion(1)}
      >
        Section 2
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 1 ? 'block' : 'none' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <button
        className={`${styles.accordion} ${activeIndex === 2 ? styles.active : ''}`}
        onClick={() => toggleAccordion(2)}
      >
        Section 3
      </button>
      <div className={styles.panel} style={{ display: activeIndex === 2 ? 'block' : 'none' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
    </div>
  );
}

export default Questions;
