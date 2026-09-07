import { defineStore, acceptHMRUpdate } from "pinia";
import { i18n } from "@/boot/i18n";

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: i18n.global.locale.value
  }),
  actions: {
    setLocale(newLocale: string) {
      if (newLocale == 'en-US' || newLocale == 'ru-RU') {
        this.currentLocale = newLocale
        i18n.global.locale.value = newLocale
      }
    }
  },
  persist: true
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}