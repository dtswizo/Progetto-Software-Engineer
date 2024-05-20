const DATE_IS_AFTER_TODAY = "The selected date is after today"


class DateAfterToday extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = DATE_IS_AFTER_TODAY
        this.customCode = 400
    }
}