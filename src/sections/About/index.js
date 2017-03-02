import React from 'react';

class About extends React.Component {
  constructor(){
    super();
    console.log('about');
  }

  render() {
    console.log('render about');
    return (
      <div>
        About this
      </div>
    );
  }
}
export default About;
