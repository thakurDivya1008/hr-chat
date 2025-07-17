// Function to format date and time
function formatDateTime(dateString) {
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("en-IN", options);
  return formatter.format(new Date(dateString));
}
function formatTime(dateString) {
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(new Date(dateString));
  }
  function formatDate(dateString) {
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(new Date(dateString));
  }
    

  function getDayLabel(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
export {formatDateTime,formatTime,formatDate,getDayLabel};