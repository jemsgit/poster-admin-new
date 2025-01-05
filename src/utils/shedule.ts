export function formatSchedule(schedule: string[]): string {
  if (!schedule || schedule.length === 0) {
    return "No scheduled times";
  }

  const sortedTimes = [...schedule].sort((a, b) => {
    const [aHours, aMinutes] = a.split(":").map(Number);
    const [bHours, bMinutes] = b.split(":").map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  const formattedTimes = sortedTimes.map((time) => {
    const [hours, minutes] = time.split(":");
    const period = Number(hours) >= 12 ? "PM" : "AM";
    const formattedHours = Number(hours) % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  });

  if (formattedTimes.length === 1) {
    return `Every day at ${formattedTimes[0]}`;
  } else {
    const lastTime = formattedTimes.pop();
    return `Every day at ${formattedTimes.join(", ")} and ${lastTime}`;
  }
}
