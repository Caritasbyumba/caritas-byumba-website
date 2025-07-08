import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';

const FileUpload = (props) => {
  const { t } = useTranslation();
  const handleChange = (event) => {
    props.setSelectedFiles(event.target.files);
  };
  const [input, setInput] = useState(null);

  return (
    <div className="py-2">
      <input
        className="hidden"
        {...props.elementConfig}
        type="file"
        onChange={handleChange}
        ref={(fileInput) => setInput(fileInput)}
      />
      <div className="flex items-center space-x-5">
        <Button
          name={t(props.btnName)}
          isSquare
          outline="false"
          color="red"
          clicked={() => input.click()}
        />
        {props.showProgressBar && (
          <div className="w-full h-4 rounded border">
            <div style={{width: props.uploadProgress}} className="h-full bg-red rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
