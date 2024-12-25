"use strict";
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatDuration = (seconds) => {
  if (!seconds)
    return "0";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const formatPace = (pace) => {
  if (!pace)
    return "0";
  const minutes = Math.floor(pace / 60);
  const seconds = Math.floor(pace % 60);
  return `${minutes}'${seconds.toString().padStart(2, "0")}"/100m`;
};
exports.formatDate = formatDate;
exports.formatDuration = formatDuration;
exports.formatPace = formatPace;
