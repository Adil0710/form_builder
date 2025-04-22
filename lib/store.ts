"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

import type { FormData, FormElement, FormTab } from "./types"

interface FormBuilderState {
  formTabs: FormTab[]
  activeTabId: string | null
  selectedElementId: string | null
  activeId: string | null

  setFormTabs: (tabs: FormTab[]) => void
  addFormTab: (title?: string) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTabTitle: (id: string, title: string) => void

  addFormElement: (type: string, tabId?: string | null) => void
  removeElement: (id: string) => void
  selectElement: (id: string) => void
  updateElementProperty: (id: string, property: string, value: any) => void
  moveElement: (tabId: string, newOrder: FormElement[]) => void
  moveElementToTab: (elementId: string, tabId: string) => void
  setActiveId: (id: string | null) => void

  saveForm: () => FormData
  loadForm: (formData: FormData) => void
  findElementById: (id: string) => { element: FormElement | null; tabId: string | null }
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formTabs: [],
  activeTabId: null,
  selectedElementId: null,
  activeId: null,

  setFormTabs: (tabs) => set({ formTabs: tabs }),

  addFormTab: (title = "New Tab") => {
    const newTab: FormTab = {
      id: uuidv4(),
      title,
      elements: [],
    }

    set((state) => {
      const updatedTabs = [...state.formTabs, newTab]
      return {
        formTabs: updatedTabs,
        activeTabId: newTab.id,
      }
    })
  },

  removeTab: (id) => {
    set((state) => {
      const updatedTabs = state.formTabs.filter((tab) => tab.id !== id)

      // If we're removing the active tab, set a new active tab
      let newActiveTabId = state.activeTabId
      if (state.activeTabId === id && updatedTabs.length > 0) {
        newActiveTabId = updatedTabs[0].id
      } else if (updatedTabs.length === 0) {
        newActiveTabId = null
      }

      return {
        formTabs: updatedTabs,
        activeTabId: newActiveTabId,
        // If the selected element was in this tab, deselect it
        selectedElementId: state.selectedElementId
          ? get().findElementById(state.selectedElementId).tabId === id
            ? null
            : state.selectedElementId
          : null,
      }
    })
  },

  setActiveTab: (id) => {
    set({ activeTabId: id })
  },

  updateTabTitle: (id, title) => {
    set((state) => ({
      formTabs: state.formTabs.map((tab) => (tab.id === id ? { ...tab, title } : tab)),
    }))
  },

  addFormElement: (type, tabId = null) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      properties: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        required: false,
      },
      tabId: tabId || get().activeTabId,
    }

    // Add default options for select, radio, and checkbox
    if (type === "select" || type === "radio" || type === "checkbox") {
      newElement.properties.options = ["Option 1", "Option 2", "Option 3"]
    }

    // Add default description property for headers
    if (type.startsWith("header")) {
      newElement.properties.description = "Add a description here"
    }

    set((state) => {
      const targetTabId = tabId || state.activeTabId

      if (!targetTabId) {
        // If no active tab, create one
        const newTab: FormTab = {
          id: uuidv4(),
          title: "New Tab",
          elements: [newElement],
        }

        return {
          formTabs: [...state.formTabs, newTab],
          activeTabId: newTab.id,
          selectedElementId: newElement.id,
        }
      }

      // Add to the specified tab
      return {
        formTabs: state.formTabs.map((tab) =>
          tab.id === targetTabId ? { ...tab, elements: [...tab.elements, newElement] } : tab,
        ),
        selectedElementId: newElement.id,
      }
    })
  },

  removeElement: (id) => {
    set((state) => {
      const updatedTabs = state.formTabs.map((tab) => ({
        ...tab,
        elements: tab.elements.filter((el) => el.id !== id),
      }))

      return {
        formTabs: updatedTabs,
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      }
    })
  },

  selectElement: (id) => {
    set({ selectedElementId: id })
  },

  updateElementProperty: (id, property, value) => {
    set((state) => {
      const updatedTabs = state.formTabs.map((tab) => ({
        ...tab,
        elements: tab.elements.map((el) =>
          el.id === id
            ? {
                ...el,
                properties: {
                  ...el.properties,
                  [property]: value,
                },
              }
            : el,
        ),
      }))

      return { formTabs: updatedTabs }
    })
  },

  moveElement: (tabId, newOrder) => {
    set((state) => ({
      formTabs: state.formTabs.map((tab) => (tab.id === tabId ? { ...tab, elements: newOrder } : tab)),
    }))
  },

  moveElementToTab: (elementId, tabId) => {
    const { element, tabId: currentTabId } = get().findElementById(elementId)
    if (!element || !currentTabId || currentTabId === tabId) return

    // First remove the element from its current tab
    set((state) => ({
      formTabs: state.formTabs.map((tab) =>
        tab.id === currentTabId ? { ...tab, elements: tab.elements.filter((el) => el.id !== elementId) } : tab,
      ),
    }))

    // Then add it to the new tab
    set((state) => ({
      formTabs: state.formTabs.map((tab) =>
        tab.id === tabId ? { ...tab, elements: [...tab.elements, { ...element, tabId }] } : tab,
      ),
    }))
  },

  setActiveId: (id) => {
    set({ activeId: id })
  },

  saveForm: () => {
    const formData: FormData = {
      id: uuidv4(),
      title: "My Form",
      tabs: get().formTabs,
    }
    return formData
  },

  loadForm: (formData) => {
    // Ensure formData and formData.tabs exist and are arrays
    const tabs = formData && formData.tabs && Array.isArray(formData.tabs) ? formData.tabs : []

    set({
      formTabs: tabs,
      activeTabId: tabs.length > 0 ? tabs[0].id : null,
      selectedElementId: null,
    })
  },

  findElementById: (id) => {
    for (const tab of get().formTabs) {
      const element = tab.elements.find((el) => el.id === id)
      if (element) {
        return { element, tabId: tab.id }
      }
    }
    return { element: null, tabId: null }
  },
}))
