import uk from "@/localization/dictionaries/uk.json";
import { WhatStoredInLocalStorage } from "@/types/forms/multi-step-apply-application";

type Messages = typeof uk;

declare global {
  interface IntlMessages extends Messages {}
}
