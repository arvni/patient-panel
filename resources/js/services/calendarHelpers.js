import dayjs from "dayjs";

export const getDayjs = (hours, minutes = 0, seconds = 0) => dayjs(new Date(new Date(new Date().setHours(hours)).setMinutes(minutes)).setSeconds(seconds))

export const convertValue = (v) => {
    if (v) {
        let tmp = v.split(":");
        return getDayjs(tmp[0], tmp[1]);
    }
    return v;
}
