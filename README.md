# Islamic World Clock ⏰

A beautiful, feature-rich Islamic world clock application that displays both Gregorian and Islamic (Hijri) dates along with an analog clock interface.

## Features

✨ **Real-time Analog Clock** - Beautiful animated clock face with hour, minute, and second hands

📅 **Dual Calendar Display**
- Gregorian (Western) calendar with day name
- Islamic (Hijri) calendar with Islamic month names

🕌 **Prayer Times** - Displays approximate prayer times for the five daily prayers:
- Fajr (Dawn)
- Dhuhr (Noon)
- Asr (Afternoon)
- Maghrib (Sunset)
- Isha (Night)

📖 **Islamic Calendar Information** - Shows significance of current Islamic month

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript** - Vanilla JS for clock logic and calendar conversions

## How It Works

### Islamic Date Conversion

The application includes a sophisticated Islamic calendar conversion algorithm that accurately converts Gregorian dates to Hijri dates using the standard astronomical calculations.

### Analog Clock

The clock uses CSS transforms to rotate the hour, minute, and second hands based on the current time.

### Prayer Times

Prayer times are approximate and displayed for informational purposes. For accurate prayer times based on location, additional astronomical calculations would be needed.

## File Structure

```
islamic-world-clock/
├── index.html       - Main HTML structure
├── styles.css       - CSS styling and animations
├── script.js        - JavaScript clock and calendar logic
└── README.md        - This file
```

## Features in Detail

### Clock Display
- Real-time updates every second
- Smooth hand animations
- Glow effects for better visibility

### Date Display
- Current day name and date in Gregorian calendar
- Equivalent Islamic (Hijri) date
- Automatic updates at midnight

### Calendar Information
- Shows the name of the current Islamic month
- Displays historical or religious significance of the month
- Updates in real-time

## Responsive Design

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile devices

## Usage

Simply open `index.html` in your web browser. The clock will automatically start displaying:
1. Current time with seconds
2. Gregorian date with day name
3. Islamic Hijri date with month name
4. Approximate prayer times
5. Information about the current Islamic month

## Islamic Calendar Information

The Islamic calendar (Hijri calendar) is:
- Lunar-based with 12 months
- Each month has either 29 or 30 days
- A year is approximately 11-12 days shorter than a Gregorian year
- Used throughout the Muslim world for religious observances

### Islamic Months

1. **Muharram** - First month, includes Ashura
2. **Safar** - Month of campaigns
3. **Rabi' al-awwal** - Birth month of Prophet Muhammad
4. **Rabi' al-thani** - Second month of spring
5. **Jumada al-awwal** - First month of summer
6. **Jumada al-thani** - Second month of summer
7. **Rajab** - Sacred month
8. **Sha'ban** - Preparation for Ramadan
9. **Ramadan** - Holy month of fasting
10. **Shawwal** - Post-Ramadan, includes Eid al-Fitr
11. **Dhu al-Qi'dah** - Pilgrimage preparation
12. **Dhu al-Hijjah** - Month of Hajj pilgrimage

## Customization

You can customize:
- Colors in `styles.css`
- Prayer times in `script.js` (function `updatePrayerTimes()`)
- Month significance information in `script.js` (function `getMonthSignificance()`)

## Browser Support

Works on all modern browsers:
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers

## License

Open source - Feel free to use and modify

## Author

Created with ❤️ for the Islamic community

---

**Assalamu Alaikum wa Rahmatullahi wa Barakatuh** 🌙