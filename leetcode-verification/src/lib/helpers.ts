export function getTimeoutDate(timestamp: Date) {
    const timeoutDate = new Date(timestamp);
    timeoutDate.setMinutes(timeoutDate.getMinutes() + 1);
    return timeoutDate;
  }