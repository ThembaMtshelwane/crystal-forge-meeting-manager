export function getToday() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export function getDefaultStartTime() {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);

  // round to NEXT hour
  now.setHours(now.getHours() + 1);

  return now.toTimeString().slice(0, 5); // HH:MM
}

export function getDefaultEndTime(start: string) {
  const [h, m] = start.split(":").map(Number);
  const end = new Date();
  end.setHours(h + 1);
  end.setMinutes(m);

  return end.toTimeString().slice(0, 5);
}
