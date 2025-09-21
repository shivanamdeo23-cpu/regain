export function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
export function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }
export function eachDayOfInterval({ start, end }: { start: Date; end: Date }) {
const days: Date[] = []; const cur = new Date(start);
while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
return days;
}
export function format(d: Date, fmt: string) {
const yyyy = d.getFullYear();
const mm = String(d.getMonth()+1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return fmt.replace('yyyy', String(yyyy)).replace('MM', mm).replace('dd', dd);
}
export function getDay(d: Date) { return d.getDay(); }
