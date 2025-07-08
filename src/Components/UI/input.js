import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { MdWarning } from 'react-icons/md';
import { CardSubText } from '../text';
import { useState } from 'react';
import { checkValidity } from '../../utils/checkValidity';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Input = (props) => {
  const [valid, setValid] = useState(true);
  const [touched, setTouched] = useState(false);
  let inputElement = null;
  let inputClasses =
    'w-full outline-none border-px border-solid border-blue rounded focus:border-blue focus:ring-transparent focus:outline-0 focus:outline-transparent ' +
    props.additional;
  let errorClasses = 'hidden';
  if (!valid && props.shouldValidate && touched) {
    inputClasses =
      'w-full outline-none border-px border-solid border-red rounded focus:border-red focus:ring-transparent focus:outline-0 focus:outline-transparent ';
    errorClasses = 'flex items-center text-red';
  }

  inputClasses.concat(
    'elementConfig' in props ? props?.elementConfig?.classes : ''
  );

  const onChangeHandler = (event) => {
    let value;
    if (event.target) {
      value = event.target.value;
    } else {
      value = event;
    }
    props.changed(value);
    if (props.shouldValidate) {
      setValid(checkValidity(value, props.validation));
      setTouched(true);
      if (props.isSubmitted === true && value === '') {
        setValid(checkValidity(value, { notEmpty: true }));
        setTouched(true);
      }
    }
  };
  switch (props.elementType) {
    case 'input':
      if (props.withIcon) {
        inputElement = (
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {props.children}
            </div>
            <input
              className={inputClasses}
              {...props.elementConfig}
              value={props.value}
              onChange={onChangeHandler}
              onClick={props.inputClicked}
            />
          </div>
        );
      } else {
        inputElement = (
          <input
            className={inputClasses}
            {...props.elementConfig}
            value={props.value}
            onChange={onChangeHandler}
            onClick={props.inputClicked}
          />
        );
      }
      break;

    case 'textarea':
      inputElement = (
        <textarea
          className={inputClasses}
          {...props.elementConfig}
          value={props.value}
          onChange={onChangeHandler}
        />
      );
      break;
    case 'checkbox':
      inputElement = (
        <input
          className={`${inputClasses} w-24px`}
          {...props.elementConfig}
          type="checkbox"
          checked={props.value}
          onChange={onChangeHandler}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses}
          value={props.value}
          onChange={onChangeHandler}
          disabled={props?.elementConfig?.disabled}
        >
          <option>{props?.elementConfig?.startingValue}</option>
          {(
            props?.elementConfig?.hasOwnProperty('optionsType')
              ? props?.elementConfig?.optionsType === 'minimal'
              : false
          )
            ? props?.elementConfig?.options.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))
            : props?.elementConfig?.options.map((option, index) => (
                <option value={option.value} key={index}>
                  {option.displayValue}
                </option>
              ))}
        </select>
      );
      break;
    case 'phone':
      inputElement = (
        <PhoneInput
          className={inputClasses}
          placeholder="Enter phone number"
          international
          countryCallingCodeEditable={false}
          defaultCountry="RW"
          value={props.value}
          onChange={(value = '') => onChangeHandler(value)}
          error={
            props.value
              ? isValidPhoneNumber(props.value)
                ? undefined
                : 'Invalid phone number'
              : 'Phone number required'
          }
        />
      );
      break;
    case 'multiselect':
      inputElement = (
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          isSearchable 
          placeholder={props?.elementConfig?.placeholder}
          isDisabled={props?.elementConfig?.disabled}
          className={inputClasses}
          value={props.value}
          onChange={onChangeHandler}
          options={props?.elementConfig?.options || []}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses}
          {...props.elementConfig}
          value={props.value}
          onChange={onChangeHandler}
        />
      );
  }
  return (
    <div
      className={`w-full box-border mt-2 flex flex-col justify-center align-start`}
    >
      <CardSubText
        name={props.label}
        color="black"
        additional="font-semibold"
      />
      {inputElement}
      <span className={errorClasses}>
        <MdWarning size="14" color="#BE1E2D" />
        <CardSubText name={props.error} color="red" alignment="center" />
      </span>
    </div>
  );
};

export default Input;
