const moment = require('moment-timezone');


        
const checkFlashState = (startDate, timeInHours, offerPercentage, startTime) => {
    const startDateMoment = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Dubai');
  
    const startTimeMoment = moment.tz(startTime, 'HH:mm', 'Asia/Dubai');
  
    const startDateTime = startDateMoment.set({
      hour: startTimeMoment.get('hour'),
      minute: startTimeMoment.get('minute'),
    });
  
    const endDateTime = startDateTime.clone().add(timeInHours, 'hours');
  
    
    const currentTimeDubai = moment().tz('Asia/Dubai');
  
    const isActive = currentTimeDubai >= startDateTime && currentTimeDubai <= endDateTime;
  
    return {
      isActive,
      offerPercentage,
      startDateTime: startDateTime.isValid() ? startDateTime.format() : 'Invalid date',
      endDateTime: endDateTime.isValid() ? endDateTime.format() : 'Invalid date',
      currentTimeDubai: currentTimeDubai.format(),
      
    };
  };

  module.exports = checkFlashState;



//   const moment = require('moment-timezone');
// const { DateTime } = require('luxon');



// const checkFlashState = (flashSaleStartDate, flashSaleStartTime, flashSaleEndTime) => {
//   // Convert flashSaleStartDate to Luxon DateTime
//   const startDate = DateTime.fromJSDate(flashSaleStartDate, { zone: 'Asia/Dubai' });

//   // Split flashSaleStartTime into hours and minutes
//   const [hours, minutes] = flashSaleStartTime.split(':').map(Number);

//   // Set the start time with Luxon
//   const startTime = startDate.set({ hour: hours, minute: minutes });

//   // Calculate the end time by adding flashSaleEndTime hours
//   const endTime = startTime.plus({ hours: flashSaleEndTime });

//   // Get the current DateTime in the same timezone
//   const now = DateTime.now().setZone('Asia/Dubai');

//   // Check if the current time is after the end time
//   const isActive = now <= endTime;

//   return isActive;
// };


//   module.exports = checkFlashState;