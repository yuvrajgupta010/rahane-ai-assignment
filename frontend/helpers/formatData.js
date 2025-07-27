export const utcToHumanReadableDate = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });
  // Output: "July 27, 2025 at 2:07 PM"
};
