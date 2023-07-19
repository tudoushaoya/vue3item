import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore(
  'areaListData',
  () => {
    const setAreaList = ref([])
    const setSubjectList = ref([])
    return {
      setAreaList,
      setSubjectList
    }
  },
  {
    persist: true
  }
)
