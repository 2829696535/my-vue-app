import { defineStore } from "pinia";
import { ref } from "vue";
function initState(){
   return{
    isCollapse: true,
   }
}
export const useAllDataStore = defineStore("allDate",()=> {
/* const count = ref(0)
const doubleCount = computed(()=>count.value*2)
function increment(){
  count.value++
} */

/* return {count,doubleCount,increment} */
  const state = ref(initState())
  return {
    state,

  }
});