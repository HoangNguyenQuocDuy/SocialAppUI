import moment from "moment/moment"

export const validateTime = (time) => {
    const now = moment()
    const createAtMoment = moment(time)

    const duration = moment.duration(now.diff(createAtMoment))

    const days = duration._data.days;
    const hours = duration._data.hours;
    const minutes = duration._data.minutes;
    const seconds = duration._data.seconds;

    if (days > 0) {
        if (days > 1) {
            return `${days} days ago`
        } else {
            return `${days} day ago`
        }
    } else if (hours > 0) {
        if (hours > 1) {
            return `${hours} hours ago`
        } else {
            return `${hours} hour ago`
        }
    } else if (minutes > 0) {
        if (minutes > 1) {
            return `${minutes} minutes ago`
        } else {
            return `${minutes} minite ago`
        }
    } else {
        if (seconds > 1) {
            return `${seconds} seconds ago`
        } else {
            return `${seconds} second ago`
        }
    }
}