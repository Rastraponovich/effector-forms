import { createEvent } from "effector"
import { createField } from "./field"
import { createErrorsMap } from "./utils"
import { ValidationError } from "./types"

test("createErrorsMap with field with errors", () => {
    const field = createField("email", {
        init: "value",
    })
    const addError = createEvent<ValidationError>()
    const resetErrors = createEvent<void>()
    field.$errors.on(addError, (errors, error) => [...errors, error])
    field.$errors.on(resetErrors, () => [])

    const error = {
        rule: "email",
        value: "value",
    }
    const error2 = {
        rule: "email2",
        value: "value",
    }

    const errorsMap = createErrorsMap({ email: field })
    expect(errorsMap.getState()).toEqual({ email: [] })

    addError(error)
    addError(error2)

    expect(errorsMap.getState()).toEqual({ email: [error, error2] })

    resetErrors()
    expect(errorsMap.getState()).toEqual({ email: [] })
})

test("createErrorsMap with multiple fields", () => {
    const field1 = createField("email", {
        init: "value",
    })
    const field2 = createField("password", {
        init: "value",
    })

    const addField1Error = createEvent<ValidationError>()
    const addField2Error = createEvent<ValidationError>()

    const resetErrors = createEvent<void>()
    field1.$errors.on(addField1Error, (errors, error) => [...errors, error])
    field2.$errors.on(addField2Error, (errors, error) => [...errors, error])
    field1.$errors.on(resetErrors, () => [])
    field2.$errors.on(resetErrors, () => [])

    const errorsMap = createErrorsMap({ email: field1, password: field2 })

    expect(errorsMap.getState()).toEqual({ email: [], password: [] })

    const field1Error = {
        rule: "email",
        value: "value",
    }
    const field2Error = {
        rule: "password",
        value: "value",
    }

    addField1Error(field1Error)
    addField1Error(field1Error)
    addField1Error(field1Error)
    addField1Error(field1Error)
    addField2Error(field2Error)

    expect(errorsMap.getState()).toEqual({
        email: [field1Error, field1Error, field1Error, field1Error],
        password: [field2Error],
    })

    resetErrors()
    expect(errorsMap.getState()).toEqual({ email: [], password: [] })
})
