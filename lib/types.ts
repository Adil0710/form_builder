export interface FormElementProperties {
  label?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  description?: string
  [key: string]: any
}

export interface FormElement {
  id: string
  type: string
  properties: FormElementProperties
  tabId?: string | null
}

export interface FormTab {
  id: string
  title: string
  elements: FormElement[]
}

export interface FormData {
  id: string
  title: string
  tabs: FormTab[]
}
