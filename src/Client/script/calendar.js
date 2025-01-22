document.addEventListener('DOMContentLoaded', () => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const calendarContainer = document.getElementById('calendar-dates');
    const monthTitle = document.getElementById('month-title');
    const yearTitle = document.getElementById('year-title');

    const renderCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
  
        calendarContainer.innerHTML = '';
        monthTitle.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });
        yearTitle.textContent = year;  
        for (let i = 0; i < firstDay; i++) {
            calendarContainer.innerHTML += '<div class="py-2"></div>';
    }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarContainer.innerHTML += `
            <div class="py-2 relative border h-32">
                <span class="absolute top-1 left-1 text-xs font-bold">${day}</span>
                <div id="event-${day}" class="mt-6 text-xs rounded-lg"></div>
            </div>`;
        }

        const events = [
            { day: 1, title: 'Event Title 1' },
            { day: 17, title: 'Event Title 2' }
        ];

        events.forEach(event => {
            const eventElement = document.getElementById(`event-${event.day}`);
            if (eventElement) {
            eventElement.innerHTML = `<div class="bg-red-500 text-white p-1 rounded">${event.title}</div>`;
            }
        });
        };

    renderCalendar(currentMonth, currentYear);

    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar(currentMonth, currentYear);
    });
  });