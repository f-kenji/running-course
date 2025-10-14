// /components/PrefCitySelect.tsx
'use client';
import { useState, useEffect } from 'react';
import prefCityData from '../data/prefCity.json';
import DialogPrefCitySelect from './DialogPrefCitySelect';

type Props = {
  pref: string;
  city: string;
  setPref: (p: string) => void;
  setCity: (c: string) => void;
};

export default function PrefCitySelect({ pref, city, setPref, setCity }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  // ----------------------------------------
  // useEffect 
  // ----------------------------------------   
  useEffect(() => {
    if (pref) {
      const match = prefCityData.find((p: any) => p.pref === pref);
      setCities(match ? match.cities : []);
    } else {
      setCities([]);
      setCity('');
    }
  }, [pref, setCity]);
  // ----------------------------------------
  // JSX 
  // ----------------------------------------   
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-m font-bold">
        {pref && city ? `${pref} ${city}` : '未選択'}
      </div>
      {/* ✅ props を渡す */}
      <DialogPrefCitySelect 
      setPref={setPref} 
      setCity={setCity} />
    </div>
  );
}
