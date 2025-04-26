import { combine, Store, StoreWritable } from "effector"
import { AnyFormValues, FormFields, ValidationError } from "./types"

type ErrorsMap<Values extends AnyFormValues> = {
    [K in keyof Values]: ValidationError<Values[K]>[]
}

export function createErrorsMap<Values extends AnyFormValues>(
    fields: FormFields<Values>
): Store<ErrorsMap<Values>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: Record<string, StoreWritable<ValidationError<any>[]>> = {}

    for (const fieldName in fields) {
        // eslint-disable-next-line no-prototype-builtins
        if (!fields.hasOwnProperty(fieldName)) continue
        shape[fieldName] = fields[fieldName].$errors
    }

    return combine(shape) as Store<ErrorsMap<Values>>
}
