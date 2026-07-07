import {forwardRef} from 'react';
import {TextInput} from 'react-native';
import type {TextInputProps} from 'react-native';
import {colors, radius} from '../tokens';

interface Props extends TextInputProps {
  className?: string;
}

const Input = forwardRef<TextInput, Props>(function Input(
  {className = '', ...rest},
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor="rgba(255,255,255,0.6)"
      className={`${colors.surface} ${radius.input} px-4 py-3 text-white text-base flex-1 ${className}`.trim()}
      {...rest}
    />
  );
});

export default Input;
