// Islamic Calendar Conversion Functions
class IslamicCalendar {
    static gregorianToIslamicDate(gregorianDate) {
        const gDate = new Date(gregorianDate);
        let year = gDate.getFullYear();
        let month = gDate.getMonth() + 1;
        let day = gDate.getDate();

        // Adjustment factor
        let N = day + Math.floor(30.6001 * (month + 1)) + year + Math.floor(year / 4) + Math.floor(year / 100) - Math.floor(year / 400) - 1948440;

        let Q = Math.floor(N / 10631);
        let R = N % 10631;

        let A = Math.floor(R / 325);
        let W = (A * 325) + 325 - 1;

        if (R < W) {
            A = Math.floor((R + 1) / 325);
        }

        let Q1 = Math.floor((R - (A * 325) + 1) / 30.44);
        let Q2 = (Q1 * 30) + (R - (A * 325) + 1) % 30;

        let iYear = Math.floor(Q * 30 + A + 1);
        let iMonth = Math.floor(Q1 + 1);
        let iDay = Math.floor(Q2);

        if (iMonth > 12) {
            iMonth = 12;
        }

        if (iDay > 29) {
            iDay = 29;
        }

        return { year: iYear, month: iMonth, day: iDay };
    }

    static getIslamicMonthName(month) {
        const monthNames = [
            'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
            'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
            'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
        ];
        return monthNames[month - 1] || 'Unknown';
    }

    static getGregorianMonthName(month) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1];
    }

    static getDayName(dayIndex) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[dayIndex];
    }
}

// Update Clock
function updateClock() {
    const now = new Date();
    
    // Update analog clock
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    document.querySelector('.second-hand').style.transform = `rotate(${secondDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minuteDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = `rotate(${hourDegrees}deg)`;

    // Update digital time
    const timeString = String(hours).padStart(2, '0') + ':' + 
                       String(minutes).padStart(2, '0') + ':' + 
                       String(seconds).padStart(2, '0');
    document.getElementById('digital-time').textContent = timeString;

    // Update Gregorian date
    const dayName = IslamicCalendar.getDayName(now.getDay());
    const monthName = IslamicCalendar.getGregorianMonthName(now.getMonth() + 1);
    const gregorianDateString = `${dayName}, ${monthName} ${now.getDate()}, ${now.getFullYear()}`;
    document.getElementById('gregorian-date').textContent = gregorianDateString;

    // Update Islamic date
    const islamicDate = IslamicCalendar.gregorianToIslamicDate(now);
    const islamicMonthName = IslamicCalendar.getIslamicMonthName(islamicDate.month);
    const islamicDateString = `${islamicDate.day} ${islamicMonthName} ${islamicDate.year} AH`;
    document.getElementById('islamic-date').textContent = islamicDateString;

    // Update prayer times based on current time
    updatePrayerTimes(now);

    // Update Islamic calendar info
    updateIslamicCalendarInfo(islamicDate);
}

// Calculate and update prayer times (simplified)
function updatePrayerTimes(date) {
    // These are approximate prayer times for demonstration
    // In a real application, you would use accurate calculation methods
    const fajr = '05:30';
    const dhuhr = '12:30';
    const asr = '15:45';
    const maghrib = '18:45';
    const isha = '20:15';

    document.getElementById('fajr').textContent = fajr;
    document.getElementById('dhuhr').textContent = dhuhr;
    document.getElementById('asr').textContent = asr;
    document.getElementById('maghrib').textContent = maghrib;
    document.getElementById('isha').textContent = isha;
}

// Update Islamic Calendar Information
function updateIslamicCalendarInfo(islamicDate) {
    const islamicMonthName = IslamicCalendar.getIslamicMonthName(islamicDate.month);
    const significance = getMonthSignificance(islamicDate.month);
    
    const infoText = `
        <strong>Hijri Year ${islamicDate.year}</strong><br>
        Current Month: <strong>${islamicMonthName}</strong><br>
        ${significance}
    `;
    
    document.getElementById('months-info').innerHTML = infoText;
}

// Get month significance
function getMonthSignificance(month) {
    const monthInfo = {
        1: 'Muharram is the first month of the Islamic calendar. The 10th day (Ashura) is a significant day.',
        2: 'Safar is known historically as a month when Islamic empires would send out armies.',
        3: 'Rabi\' al-awwal is the month of the Prophet Muhammad\'s birth.',
        4: 'Rabi\' al-thani is one of the sacred months.',
        5: 'Jumada al-awwal is a time for reflection and worship.',
        6: 'Jumada al-thani follows Jumada al-awwal in the Islamic calendar.',
        7: 'Rajab is one of the sacred months. The Prophet\'s Night Journey occurred in this month.',
        8: 'Sha\'ban is the month before Ramadan, a time of preparation.',
        9: 'Ramadan is the holiest month in Islam, observed for fasting and spiritual reflection.',
        10: 'Shawwal begins with Eid al-Fitr, celebrating the end of Ramadan.',
        11: 'Dhu al-Qi\'dah is one of the sacred months for pilgrimage preparation.',
        12: 'Dhu al-Hijjah is the month of Hajj pilgrimage to Mecca.'
    };
    
    return monthInfo[month] || 'An important month in the Islamic calendar.';
}

// Initialize and start the clock
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// Start the clock when the page loads
document.addEventListener('DOMContentLoaded', initClock);