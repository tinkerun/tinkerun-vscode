import 'alpinejs'
import {PHPFormInput} from 'php-form'

import './form.css'

declare var fields: PHPFormInput[]

interface FormData {
  fields: PHPFormInput[],
}

declare global {
  function formData(): FormData
}

function formData(): FormData {
  return {
    fields,
  }
}

window.formData = formData