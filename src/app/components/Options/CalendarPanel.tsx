import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  MonthView,
  Resources,
  ResourcesProps,
  Scheduler,
  Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import { AssessmentOutlined, LocalFireDepartment, Subject } from '@mui/icons-material';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { IUserStats } from '../../../interfaces';
import { loadAppLocales } from '../../../utils/locales';

interface ChartProps {
  data: IUserStats[];
}

const AppointmentComponent = ({ children, ...restProps }: Appointments.AppointmentProps) => (
  <Appointments.Appointment {...restProps} style={{ backgroundColor: '#F89F1B' }}>
    {children}
  </Appointments.Appointment>
);

const AppointmentContent = ({ ...restProps }: Appointments.AppointmentContentProps) => (
  <Appointments.AppointmentContent {...restProps} style={{ whiteSpace: 'normal', lineHeight: 1.2 }} />
);

const TooltipComponent = ({ children, appointmentData, ...restProps }: AppointmentTooltip.ContentProps) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems='center'>
      <Grid item xs={2} sx={{ textAlign: 'center' }}>
        <Subject sx={{ color: '#808080' }} />
      </Grid>
      <Grid item xs={10}>
        {(appointmentData?.description as string).split(' ').map((v) => (
          <Typography component='a' key={v} href={v} sx={{ display: 'block' }}>
            {v}
          </Typography>
        ))}
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
);

const CalendarPanel: FC<ChartProps> = (props) => {
  const { data } = props;

  const langBasedAppStrings = loadAppLocales();

  const resources: ResourcesProps = {
    data: [
      {
        fieldName: 'resourcesId',
        title: langBasedAppStrings.appStreakQuestions,
        instances: [{ id: 1, color: '#F89F1B' }],
      },
    ],
    mainResourceName: 'resourcesId',
  };

  const FlexibleSpace = ({ ...restProps }) => (
    <Toolbar.FlexibleSpace {...restProps} style={{ flex: 'none' }}>
      <Stack direction='row'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalFireDepartment fontSize='medium' htmlColor='#F89F1B' />
          <Typography variant='h6' style={{ marginLeft: '10px' }}>
            {data.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
          <AssessmentOutlined fontSize='medium' />
          <Typography variant='h6' style={{ marginLeft: '10px' }}>
            Stats
          </Typography>
        </Box>
      </Stack>
    </Toolbar.FlexibleSpace>
  );

  return (
    <Paper
      sx={{
        boxShadow: 'rgba(0, 0, 0, 0.14) 0px 1px 1px 0px',
        border: '.2px solid rgba(0, 0, 0, 0.14)',
      }}>
      <Scheduler data={data}>
        <ViewState defaultCurrentDate={new Date()} />
        <MonthView />
        <Appointments appointmentComponent={AppointmentComponent} appointmentContentComponent={AppointmentContent} />
        <Toolbar flexibleSpaceComponent={FlexibleSpace} />
        <DateNavigator />
        <AppointmentTooltip contentComponent={TooltipComponent} showCloseButton />
        <Resources {...resources} />
      </Scheduler>
    </Paper>
  );
};

export default CalendarPanel;
