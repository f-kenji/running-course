// src/types/prefCity.ts
export type PrefCityProps = {
  pref?: string;
  city?: string;
  setPref: (p: string) => void;
  setCity: (c: string) => void;
};