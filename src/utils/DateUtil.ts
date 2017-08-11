import {Moment} from 'moment';

export const isWeekDay = (date: Moment): boolean => date.day() > 0 && date.day() < 6;
export const isMonDay = (date: Moment): boolean => date.day() === 1;
export const isTuesDay = (date: Moment): boolean => date.day() === 2;
export const isWednesDay = (date: Moment): boolean => date.day() === 3;
export const isThursDay = (date: Moment): boolean => date.day() === 4;
export const isFriDay = (date: Moment): boolean => date.day() === 5;
