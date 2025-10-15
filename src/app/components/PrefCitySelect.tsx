// /components/PrefCitySelect.tsx
'use client';
import { useState, useEffect } from 'react';
import prefCityData from '@/app/data/prefCity.json';
import DialogPrefCitySelect from '@/app/components/DialogPrefCitySelect';
import { PrefCityProps } from '@/types/PrefCity'

export default function PrefCitySelect({ pref, city, setPref, setCity }: PrefCityProps) {
  const [cities, setCities] = useState<string[]>([]);
  // ----------------------------------------
  // useEffect 
  // ----------------------------------------   
  useEffect(() => {
    if (pref) {
      // 都道府県 に対する 市区のリストを設定
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