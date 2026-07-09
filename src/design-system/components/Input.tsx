import {forwardRef} from 'react';
import {TextInput} from 'react-native';
import type {TextInputProps} from 'react-native';
import {BG_SURFACE, TEXT_PRIMARY, PLACEHOLDER} from '../../styles/Color';
import {RADIUS_INPUT} from '../../styles/Sizing';
import {SIZE_BASE} from '../../styles/Fonts';
import {P_INPUT, PY_3} from '../../styles/Spacing';

interface Props extends TextInputProps {
  className?: string;
}

const Input = forwardRef<TextInput, Props>(function (
  {className = '', ...rest},
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={PLACEHOLDER}
      className={`${BG_SURFACE} ${RADIUS_INPUT} ${P_INPUT} ${PY_3} ${TEXT_PRIMARY} ${SIZE_BASE} flex-1 ${className}`.trim()}
      {...rest}
    />
  );
});

export default Input;
