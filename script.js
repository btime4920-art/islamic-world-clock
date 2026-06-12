// User Settings Management
class UserSettings {
    constructor() {
        this.country = localStorage.getItem('selected_country') || '';
        this.timezone = localStorage.getItem('selected_timezone') || '';
        this.city = localStorage.getItem('selected_city') || '';
        this.latitude = localStorage.getItem('user_latitude');
        this.longitude = localStorage.getItem('user_longitude');
    }

    save() {
        localStorage.setItem('selected_country', this.country);
        localStorage.setItem('selected_timezone', this.timezone);
        localStorage.setItem('selected_city', this.city);
    }

    setLocation(lat, lon) {
        this.latitude = lat;
        this.longitude = lon;
        localStorage.setItem('user_latitude', lat);
        localStorage.setItem('user_longitude', lon);
    }

    getLocation() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            country: this.country,
            city: this.city,
            timezone: this.timezone
        };
    }
}

// Islamic Calendar API Integration - Aladhan API
class HijriCalendar {
    static async getHijriDate(date = new Date()) {
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            const response = await fetch(`https://api.aladhan.com/v1/convert?date=${day}-${month}-${year}&calendar=gregorian`);
            const data = await response.json();
            
            if (data.code === 200) {
                const hijri = data.data.hijri;
                return {
                    day: hijri.day,
                    month: hijri.month.number,
                    monthName: hijri.month.en,
                    year: hijri.year,
                    designation: hijri.designation.abbreviated
                };
            }
        } catch (error) {
            console.error('Error fetching Hijri date:', error);
        }
        return null;
    }

    static getIslamicMonthName(monthNumber) {
        const months = [
            'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
            'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
            'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
        ];
        return months[monthNumber - 1] || 'Unknown';
    }

    static getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    static getGregorianMonthName(monthNumber) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    }
}

// Prayer Times API Integration - Aladhan API
class PrayerTimes {
    static async getPrayerTimes(latitude, longitude, timezone = null) {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            
            // Using Aladhan API for accurate prayer times (method 2 = ISNA)
            const response = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`);
            const data = await response.json();
            
            if (data.code === 200) {
                const timings = data.data.timings;
                return {
                    fajr: timings.Fajr.substring(0, 5),
                    dhuhr: timings.Dhuhr.substring(0, 5),
                    asr: timings.Asr.substring(0, 5),
                    maghrib: timings.Maghrib.substring(0, 5),
                    isha: timings.Isha.substring(0, 5)
                };
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
        }
        return null;
    }

    static async getPrayerTimesByCity(city, country) {
        try {
            // Get coordinates from city name using Open Street Map Nominatim API
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`);
            const geoData = await geoResponse.json();
            
            if (geoData && geoData.length > 0) {
                const { lat, lon } = geoData[0];
                return await this.getPrayerTimes(parseFloat(lat), parseFloat(lon));
            }
        } catch (error) {
            console.error('Error fetching prayer times by city:', error);
        }
        return null;
    }
}

// Geolocation Service
class GeoLocation {
    static async getUserLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.getCountryFromCoordinates(latitude, longitude).then((countryData) => {
                            resolve({ latitude, longitude, ...countryData });
                        });
                    },
                    (error) => {
                        console.log('Geolocation permission denied or unavailable:', error);
                        resolve(null);
                    },
                    { timeout: 10000 }
                );
            } else {
                resolve(null);
            }
        });
    }

    static async getCountryFromCoordinates(latitude, longitude) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            return {
                country: data.address?.country || 'Unknown',
                city: data.address?.city || data.address?.town || 'Unknown'
            };
        } catch (error) {
            console.error('Error getting country:', error);
            return { country: 'Unknown', city: 'Unknown' };
        }
    }
}

// Main Clock Application
class ClockApp {
    constructor() {
        this.settings = new UserSettings();
        this.currentHijri = null;
        this.currentPrayerTimes = null;
        this.updateInterval = null;
        this.lastHijriUpdate = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.autoDetectLocation();
        this.updateLocationDisplay();
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), 1000);
        await this.fetchPrayerTimes();
    }

    setupEventListeners() {
        document.getElementById('settingsToggle').addEventListener('click', () => {
            const content = document.getElementById('settingsContent');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('applySettings').addEventListener('click', () => {
            this.applyUserSettings();
        });

        // Restore settings from localStorage
        if (this.settings.country) {
            document.getElementById('countrySelect').value = this.settings.country;
        }
        if (this.settings.timezone) {
            document.getElementById('timezoneSelect').value = this.settings.timezone;
        }
        if (this.settings.city) {
            document.getElementById('cityInput').value = this.settings.city;
        }
    }

    async autoDetectLocation() {
        // If user already has settings, skip auto-detect
        if (this.settings.latitude && this.settings.longitude) {
            return;
        }

        const location = await GeoLocation.getUserLocation();
        if (location) {
            this.settings.setLocation(location.latitude, location.longitude);
            if (location.country && location.country !== 'Unknown') {
                this.settings.country = location.country;
            }
            if (location.city && location.city !== 'Unknown') {
                this.settings.city = location.city;
            }
            this.settings.save();
        }
    }

    applyUserSettings() {
        const country = document.getElementById('countrySelect').value;
        const timezone = document.getElementById('timezoneSelect').value;
        const city = document.getElementById('cityInput').value.trim();

        this.settings.country = country;
        this.settings.timezone = timezone;
        this.settings.city = city;
        this.settings.save();

        this.updateLocationDisplay();
        this.fetchPrayerTimes();
        
        // Close settings panel
        document.getElementById('settingsContent').style.display = 'none';
    }

    updateLocationDisplay() {
        const location = this.settings.getLocation();
        let displayText = '📍 Location: ';

        if (this.settings.city && this.settings.city !== 'Unknown') {
            displayText += this.settings.city;
            if (this.settings.country && this.settings.country !== 'Unknown') {
                displayText += `, ${this.settings.country}`;
            }
        } else if (this.settings.country && this.settings.country !== 'Unknown') {
            displayText += this.settings.country;
        } else if (location.latitude && location.longitude) {
            displayText += `${parseFloat(location.latitude).toFixed(2)}°, ${parseFloat(location.longitude).toFixed(2)}°`;
        } else {
            displayText += 'Global';
        }

        if (this.settings.timezone) {
            displayText += ` | 🕐 ${this.settings.timezone}`;
        }

        document.getElementById('locationText').textContent = displayText;
    }

    async fetchPrayerTimes() {
        const location = this.settings.getLocation();
        
        let prayerTimes = null;

        if (this.settings.city && this.settings.city !== 'Unknown') {
            prayerTimes = await PrayerTimes.getPrayerTimesByCity(
                this.settings.city,
                this.settings.country || ''
            );
        } else if (location.latitude && location.longitude) {
            prayerTimes = await PrayerTimes.getPrayerTimes(
                parseFloat(location.latitude),
                parseFloat(location.longitude),
                this.settings.timezone
            );
        }

        if (prayerTimes) {
            this.currentPrayerTimes = prayerTimes;
            this.displayPrayerTimes(prayerTimes);
            const statusEl = document.getElementById('prayerStatus');
            if (statusEl) {
                statusEl.style.display = 'none';
            }
        } else {
            const statusEl = document.getElementById('prayerStatus');
            if (statusEl) {
                statusEl.textContent = '⚠️ Unable to fetch prayer times. Please check your location settings or try again.';
                statusEl.style.display = 'block';
            }
        }
    }

    displayPrayerTimes(times) {
        document.getElementById('fajr').textContent = times.fajr;
        document.getElementById('dhuhr').textContent = times.dhuhr;
        document.getElementById('asr').textContent = times.asr;
        document.getElementById('maghrib').textContent = times.maghrib;
        document.getElementById('isha').textContent = times.isha;
    }

    async updateClock() {
        const now = new Date();
        let hours, minutes, seconds, tzDate;

        // Apply timezone if set
        if (this.settings.timezone) {
            try {
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: this.settings.timezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                const parts = formatter.formatToParts(now);
                const timeObj = {};
                parts.forEach(p => {
                    if (p.type !== 'literal') {
                        timeObj[p.type] = p.value;
                    }
                });

                hours = parseInt(timeObj.hour);
                minutes = parseInt(timeObj.minute);
                seconds = parseInt(timeObj.second);
                tzDate = new Date(timeObj.year, parseInt(timeObj.month) - 1, parseInt(timeObj.day));
            } catch (error) {
                console.error('Timezone error:', error);
                hours = now.getHours();
                minutes = now.getMinutes();
                seconds = now.getSeconds();
                tzDate = now;
            }
        } else {
            hours = now.getHours();
            minutes = now.getMinutes();
            seconds = now.getSeconds();
            tzDate = now;
        }

        // Update analog clock
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
        const dayName = HijriCalendar.getDayName(tzDate.getDay());
        const monthName = HijriCalendar.getGregorianMonthName(tzDate.getMonth() + 1);
        const gregorianDateString = `${dayName}, ${monthName} ${tzDate.getDate()}, ${tzDate.getFullYear()}`;
        document.getElementById('gregorian-date').textContent = gregorianDateString;

        // Fetch and update Hijri date (once per day to save API calls)
        if (!this.currentHijri || this.lastHijriUpdate !== tzDate.toDateString()) {
            const hijriData = await HijriCalendar.getHijriDate(tzDate);
            if (hijriData) {
                this.currentHijri = hijriData;
                this.lastHijriUpdate = tzDate.toDateString();
                this.displayHijriDate(hijriData);
                this.updateIslamicInfo(hijriData);
            }
        }
    }

    displayHijriDate(hijri) {
        const hijriDateString = `${hijri.day} ${hijri.monthName} ${hijri.year} ${hijri.designation}`;
        document.getElementById('islamic-date').textContent = hijriDateString;
    }

    updateIslamicInfo(hijri) {
        const significance = this.getMonthSignificance(hijri.month);
        const infoText = `
            <strong>Hijri Year ${hijri.year}</strong><br>
            Current Month: <strong>${hijri.monthName}</strong><br>
            ${significance}
        `;
        document.getElementById('months-info').innerHTML = infoText;
    }

    getMonthSignificance(month) {
        const monthInfo = {
            1: 'Muharram is the first month of the Islamic calendar. The 10th day (Ashura) commemorates important historical events.',
            2: 'Safar is known historically as a month of significance in Islamic history.',
            3: 'Rabi\' al-awwal is the month of the birth of Prophet Muhammad (Mawlid al-Nabi).',
            4: 'Rabi\' al-thani is a month of spiritual growth and reflection.',
            5: 'Jumada al-awwal is a time for increased devotion and worship.',
            6: 'Jumada al-thani follows Jumada al-awwal in the Islamic calendar.',
            7: 'Rajab is one of the sacred months (Ashur al-Haram). The Prophet\'s Night Journey (Isra\' and Mi\'raj) occurred in this month.',
            8: 'Sha\'ban is the month of fasting preparation before Ramadan begins.',
            9: 'Ramadan is the holiest month in Islam, observed for fasting (Sawm) and spiritual reflection from dawn to sunset.',
            10: 'Shawwal begins with Eid al-Fitr, celebrating the end of Ramadan with family and community.',
            11: 'Dhu al-Qi\'dah is one of the sacred months, a time for pilgrimage preparation.',
            12: 'Dhu al-Hijjah is the month of Hajj pilgrimage to Mecca, one of the Five Pillars of Islam.'
        };

        return monthInfo[month] || 'An important month in the Islamic calendar.';
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ClockApp();
});