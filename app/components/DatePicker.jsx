import DayPicker from "react-day-picker";

import "react-day-picker/lib/style.css";

const DatePicker = ({ dayClickFunc, currentDate }) => {
  const beforeCovid = {
    // February, 29, 2020
    before: new Date(2020, 1, 29),
  };

  return (
    <DayPicker
      onDayClick={dayClickFunc}
      selectedDays={currentDate}
      disabledDays={beforeCovid}
      todayButton="Go to today"
    />
  );
};

export default DatePicker;
