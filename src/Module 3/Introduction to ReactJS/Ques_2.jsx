import React from 'react';

function Ques_2() {
  let year;
  try {
    year = new Date().getFullYear();
  } catch (error) {
    year = 'Error fetching year';
    // Optionally log the error
    // console.error(error);
  }

  return (
    <div>
      The current year is {year}.
    </div>
  );
}

export default Ques_2;