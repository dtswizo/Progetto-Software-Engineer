const DATE_IS_AFTER_TODAY = "The selected date is after today"
const DATE_IS_BEFORE_ARRIVAL = "The selected date is before the arrival date of the product"


class DateAfterToday extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = DATE_IS_AFTER_TODAY
        this.customCode = 400
    }
}

class DateBeforeArrival extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = DATE_IS_BEFORE_ARRIVAL
        this.customCode = 400
    }
}