// messageProcessing.ts
import moment from 'moment';

export const processMessagesWithDates = (messages: any[]) => {
  const messagesWithDates: any[] = [];
  let lastDate: moment.Moment | null = null as any;
  let dateHeaderIndex = 0; // Add a counter for date headers
  const todayInserted = false as boolean;

  messages.forEach((message: any, index: number) => {
    const messageDate = moment(message.timestamp).startOf('day');
    const isToday = messageDate.isSame(moment().startOf('day'));

    // Insert date labels for previous days
    if (!isToday && lastDate && !messageDate.isSame(lastDate)) {
      messagesWithDates.push({
        type: 'date',
        date: lastDate,
        id: `date-${lastDate.format('YYYY-MM-DD')}-${index}`,
      });
      dateHeaderIndex++; 
    }

    // Add the actual message to the array
    messagesWithDates.push({ ...message, type: 'message', id: `msg-${message.id}` });

    // Update lastDate
    lastDate = messageDate;
  });

  // Handle the case where the last message is from today or all messages are from today
  if (lastDate && lastDate.isSame(moment().startOf('day'))) {
    if (!todayInserted) {
      messagesWithDates.push({
        type: 'date',
        date: lastDate,
        id: `date-${lastDate.format('YYYY-MM-DD')}-${dateHeaderIndex}}`,
        isToday: true,
      });
      dateHeaderIndex++; 
    }
  } else if (lastDate) {
    messagesWithDates.push({
      type: 'date',
      date: lastDate,
      id: `date-${lastDate.format('YYYY-MM-DD')}-${dateHeaderIndex}`,
    });
    dateHeaderIndex++; 
  }

  return messagesWithDates;
};
