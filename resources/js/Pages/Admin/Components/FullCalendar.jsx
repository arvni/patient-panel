import React from "react";
import PropTypes from 'prop-types'
import moment from 'moment'
import {
    Views,
    momentLocalizer,
    Calendar
} from 'react-big-calendar'
import {Container} from "@mui/material";

import 'react-big-calendar/lib/sass/styles.scss';
import '@/../css/calendarStyle.scss'

const mLocalizer = momentLocalizer(moment)

export function Event({event, children}) {
    return (
        <div className={event.className}>
            {children}
        </div>
    )
}

Event.propTypes = {
    event: PropTypes.object,
}

const FullCalendar = ({onNavigate, defaultDate, defaultView, events = [], onView = null, onSelectEvent = null}) => {
    return <Container sx={{minHeight: "800px"}}>
        <Calendar onNavigate={onNavigate}
                  defaultDate={defaultDate ? new Date(defaultDate) : new Date()}
                  defaultView={defaultView}
                  style={{minHeight: "800px"}}
                  localizer={mLocalizer}
                  events={events}
                  onDrillDown={onNavigate}
                  startAccessor="started"
                  endAccessor="ended"
                  onSelectEvent={onSelectEvent}
                  onView={onView}
                  components={{eventWrapper: Event}}
        />
    </Container>;
}

export default FullCalendar;
