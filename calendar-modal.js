// Calendar Modal Functions
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 365 days (no leap year)

function openCalendarModal() {
  const overlay = document.getElementById('calendarModalOverlay');
  const progressText = document.getElementById('calendarProgressText');
  const calendarGrid = document.getElementById('calendarGrid');

  // Get today's date
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Update progress text (cap at 365, exclude Feb 29)
  let count = 0;
  calendarObservedDays.forEach(day => {
    if (day !== '02-29') count++;
  });
  progressText.textContent = `${Math.min(count, 365)}/365`;

  // Render calendar
  calendarGrid.innerHTML = '';

  for (let month = 0; month < 12; month++) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'calendar-month';

    const monthName = document.createElement('div');
    monthName.className = 'calendar-month-name';
    monthName.textContent = MONTH_NAMES[month];
    monthDiv.appendChild(monthName);

    const daysDiv = document.createElement('div');
    daysDiv.className = 'calendar-days';

    const daysInMonth = DAYS_IN_MONTH[month];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';

      // Format as MM-DD to match stored format
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}`;

      if (calendarObservedDays.has(dateKey)) {
        dayDiv.classList.add('observed');
      }

      if (month === todayMonth && day === todayDay) {
        dayDiv.classList.add('today');
      }

      dayDiv.textContent = day;
      dayDiv.title = `${MONTH_NAMES[month]} ${day}`;
      daysDiv.appendChild(dayDiv);
    }

    monthDiv.appendChild(daysDiv);
    calendarGrid.appendChild(monthDiv);
  }

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCalendarModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const overlay = document.getElementById('calendarModalOverlay');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeCalendarModal();
  }
});
