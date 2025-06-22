// Takes in miliseconds and returns the date created from it as a pretty string
export function prettifyDate(miliseconds: string) {
	const milisecondsAsNumber = Number(miliseconds);

	if(Number.isNaN(milisecondsAsNumber)) return;

	const date = new Date(milisecondsAsNumber);

	let weekday: string;
	switch (date.getDay()) {
		case 0:
			weekday = "Sunday";
			break;
		case 1:
			weekday = "Monday";
			break;
		case 2:
			weekday = "Tuesday";
			break;
		case 3:
			weekday = "Wednesday";
			break;
		case 4:
			weekday = "Thursday";
			break;
		case 5:
			weekday = "Friday";
			break;
		default:
			weekday = "Saturday";
	}

	let month: string;
	switch (date.getMonth()) {
		case 0:
			month = "January";
			break;
		case 1:
			month = "February";
			break;
		case 2:
			month = "March";
			break;
		case 3:
			month = "April";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "June";
			break;
		case 6:
			month = "July";
			break;
		case 7:
			month = "August";
			break;
		case 8:
			month = "September";
			break;
		case 9:
			month = "October";
			break;
		case 10:
			month = "November";
			break;
		default:
			month = "December";
	}

	return `${addZero(date.getHours())}:${addZero(date.getMinutes())} ${weekday}, ${date.getDate()}. ${month} ${date.getFullYear()}`;
}

// If the value is one digit long, a "0" in front will be added
function addZero(value: number) {
	if (value < 10) return `0${value}`;
	return `${value}`;
}
