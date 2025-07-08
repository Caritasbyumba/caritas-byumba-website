import React, { useState } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { CardBody } from '../../text';
import { useSelector } from 'react-redux';

const Faq = (props) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  return (
    <div className="border-b-2 border-gray-200 py-3">
      <div
        className="flex justify-between items-center py-3 cursor-pointer"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <CardBody
          name={props.question[selectedLanguage]}
          color="red font-semibold"
        />
        <MdOutlineArrowDropDownCircle />
      </div>
      {showAnswer && <CardBody name={props.answer[selectedLanguage]} />}
    </div>
  );
};

export default Faq;
