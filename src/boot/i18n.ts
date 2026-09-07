import { defineBoot } from "#q-app";
import { createI18n } from "vue-i18n";
import { useLocaleStore } from "@/stores/locale-store";

import messages from "@/i18n";

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)["en-US"];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "vue-i18n" {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
  locale: "en-US",
  legacy: false,
  messages
});

// Apply persisted locale after Pinia is active
const localeStore = useLocaleStore()
i18n.global.locale.value = localeStore.currentLocale

export { i18n }

export default defineBoot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});
