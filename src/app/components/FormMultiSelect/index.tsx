import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  SelectProps,
  Theme,
} from '@mui/material';
import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CssSelectField, getStyles } from '../../styles/controls/cssSelectField';

type FormSelectProps = {
  name: string;
  label: string;
  data: string[];
  theme: Theme;
  width: string;
  selectedDays?: number;
} & SelectProps;

const getSelectList = (selected: unknown): string[] => selected as string[];

const FormMultiSelect: FC<FormSelectProps> = (props) => {
  // Utilizing useFormContext to have access to the form Context
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { name, label, theme, data, width, selectedDays, ...otherProps } = props;

  return (
    <Fragment>
      <Controller
        control={control}
        name={name}
        defaultValue=''
        render={({ field }) => {
          return (
            <FormControl sx={{ width: width }} error={!!errors[name]}>
              <InputLabel htmlFor={name} id={label}>
                {' '}
                {label}{' '}
              </InputLabel>
              <CssSelectField
                labelId={label}
                id={name}
                input={<OutlinedInput label={label} />}
                sx={{
                  '& .MuiOutlinedInput-input': {
                    paddingBottom: selectedDays && selectedDays > 0 ? '8px' : '16px',
                  },
                }}
                renderValue={(selected: unknown) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getSelectList(selected).map((item) => (
                      <Chip key={item} label={item} />
                    ))}
                  </Box>
                )}
                multiple
                {...field}
                {...otherProps}>
                {data.map((item) => (
                  <MenuItem key={item} value={item} style={getStyles(item, data, theme)}>
                    {item}
                  </MenuItem>
                ))}
              </CssSelectField>
              <FormHelperText> {errors[name] ? (errors[name]?.message as unknown as string) : ''} </FormHelperText>
            </FormControl>
          );
        }}
      />
    </Fragment>
  );
};

export default FormMultiSelect;
