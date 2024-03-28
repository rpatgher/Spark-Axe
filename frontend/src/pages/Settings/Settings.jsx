import React, { useState } from 'react';
import './VerticalTabs.css'; 

function VerticalTabs() {
    const [activeTab, setActiveTab] = useState(0);
  
    const handleTabClick = (index) => {
      setActiveTab(index);
    };
  
    return (
      <div className="vertical-tabs-container">
        <div className="vertical-tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`vertical-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className="tab-content">
          {tabs[activeTab].content}
        </div>
      </div>
    );
  }
  
  const tabs = [
    {
      title: 'Tab 1',
      content: 'Content of Tab 1'
    },
    {
      title: 'Tab 2',
      content: 'Content of Tab 2'
    },
    {
      title: 'Tab 3',
      content: 'Content of Tab 3'
    }
  ];
  
export default VerticalTabs;
