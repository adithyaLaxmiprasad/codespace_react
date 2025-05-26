import React from 'react';

function Ques_2() {
  let year;
  try {
    year = new Date().getFullYear();
  } catch (error) {
    year = 'Unavailable';
    // Optionally, you could log the error or display a warning
    // console.warn('Failed to get current year:', error);
  }

  return (
    <div>
      The current year is {year}.
    </div>
  );
}

export default Ques_2;