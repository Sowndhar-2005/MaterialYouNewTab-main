/*
 * Material You NewTab
 * Copyright (c) 2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

document.addEventListener("DOMContentLoaded", function () {
    const calDayName = document.getElementById("calDayName");
    const calFullDate = document.getElementById("calFullDate");
    const calDayNum = document.getElementById("calDayNum");
    const calMonthLabel = document.getElementById("calMonthLabel");

    function updateCalendarWidget() {
        const today = new Date();
        const locale = localStorage.getItem("selectedLanguage") || "en";

        if (calDayName) {
            calDayName.textContent = today.toLocaleString(locale, { weekday: "short" }).toUpperCase();
        }
        if (calDayNum) {
            calDayNum.textContent = today.getDate();
        }
        if (calMonthLabel) {
            calMonthLabel.textContent = today.toLocaleString(locale, { month: "short" }).toUpperCase();
        }
    }

    updateCalendarWidget();
    // Refresh periodically
    setInterval(updateCalendarWidget, 60000);
});
