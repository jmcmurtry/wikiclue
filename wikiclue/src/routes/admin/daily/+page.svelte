<script lang="ts">
    import { getMonth, getYear, getDate, getDay, addDays, subMonths, getDaysInMonth, addMonths } from 'date-fns';
    import { writable } from "svelte/store";
    import AdminHeader from "../../../components/adminHeader.svelte";
    import AdminHeaderBar from "../../../components/adminheaderBar.svelte";
    import Overlay from "../../../components/overlay.svelte";

    const isEditOverlayOpen = writable(false);
    let wordOne = '';
    let wordTwo = '';
    let dateSelected: string | undefined;

    let currentDate = new Date();

    function goToPreviousMonth() {
        currentDate = subMonths(currentDate, 1);
    }

    function goToNextMonth() {
        currentDate = addMonths(currentDate, 1);
    }

    function getFormattedDay(day: number) {
        if (day >= 11 && day <= 13) {
            return day + 'th';
        }
        switch (day % 10) {
            case 1: return day + 'st';
            case 2: return day + 'nd';
            case 3: return day + 'rd';
            default: return day + 'th';
        }
    }

    /**
	 * @param {Date} date
	 */
     function selectDate(date: Date) {
        const monthString = date.toLocaleString('default', { month: 'long' });
        const dayOfMonth = getFormattedDay(date.getDate());
        
        dateSelected = monthString + " " + dayOfMonth;
        isEditOverlayOpen.set(true);
    }

    function getDaysForCalendar(year: number, month: number) {
        const firstDayOfMonth = new Date(year, month, 1);
        const startDay = getDay(firstDayOfMonth);
        const daysInMonth = getDaysInMonth(firstDayOfMonth);
        const daysFromPreviousMonth = startDay === 0 ? 6 : startDay - 1;
        
        const days = [];
        for (let i = daysFromPreviousMonth; i > 0; i--) {
            const previousDay = addDays(firstDayOfMonth, -i);
            
            days.push({
                date: previousDay,
                day: getDate(previousDay),
                fromOtherMonth: true
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(year, month, i);
            days.push({
                date: currentDay,
                day: i,
                fromOtherMonth: false
            });
        }

        const daysFromNextMonth = 7 - (daysFromPreviousMonth + daysInMonth) % 7;

        if (daysFromNextMonth !== 7) {
            for (let i = 1; i <= daysFromNextMonth; i++) {
                const nextDay = new Date(year, month + 1, i);
                days.push({
                    date: nextDay,
                    day: i,
                    fromOtherMonth: true
                });
            }
        }
        return days;
    }

</script>
  

<AdminHeaderBar />
<div class="update-daily">
    <AdminHeader header="Update Daily's" arrow={true}/>
    <div class="calendar-container">
        <div class="calendar-header">
            <button on:click={goToPreviousMonth}>&lt;</button>
            <h2>{currentDate.toLocaleString('default', { month: 'long'})} / {getYear(currentDate)}</h2>
            <button on:click={goToNextMonth}>&gt;</button>
        </div>

        <div class="legend">
            <div class="legend-item">
                <div class="text">Past:</div>
                <div class="color-box" id="past"></div>
            </div>
            <div class="legend-item">
                <div class="text">Completed:</div>
                <div class="color-box" id="filled-in"></div>
            </div>
            <div class="legend-item">
                <div class="text">Empty:</div>
                <div class="color-box" id="empty"></div>
            </div>
        </div>
    
        <div class="calendar">
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            {#each getDaysForCalendar(getYear(currentDate), getMonth(currentDate)) as { date, day, fromOtherMonth }}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if fromOtherMonth}
                <div class="day previous-month" class:selected="{date.toDateString() === new Date().toDateString()}" on:click={() => selectDate(date)}>{day}</div>
            {/if}
            {#if !fromOtherMonth}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="day" class:selected="{date.toDateString() === new Date().toDateString()}" on:click={() => selectDate(date)}>{day}</div>
            {/if}
            {/each}
        </div>
    </div>
    
    {#if $isEditOverlayOpen}
    <Overlay header="{dateSelected}" onClose={() => {isEditOverlayOpen.set(false);}}>
        <p class ="input-label">First Word</p>
        <input type="text" class="word-input" bind:value={wordOne}/>
        <p class ="input-label">Second Word</p>
        <input type="text" class="word-input" bind:value={wordTwo}/>
        <button class="save-button">Save Daily</button>
    </Overlay>   
{/if}
</div>

<style>
	@import '../../../styles/updateDailyPageStyles.css';
</style>
