import React from 'react';
import ReactDOM from 'react-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const time = new Date().getHours();

const headingText =  time < 12 ? 'Good morning' 
                    : time < 18 ? 'Good afternoon'
                    : 'Good evening';

const headingColor = headingText === 'Good morning' ? {color: 'red'} 
                  : headingText === 'Good afternoon' ? {color: 'green'} 
                  : {color: 'blue'};

root.render(<>
  <h1 className='heading' style={headingColor}>{headingText}</h1>
</>)