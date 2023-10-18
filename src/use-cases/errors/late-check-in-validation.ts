export class LateCheckInValidationError extends Error{
  constructor(){
    super('⏳ The check-in can not be validated anymore!')
  }
}