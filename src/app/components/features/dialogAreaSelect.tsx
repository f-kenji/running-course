import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import prefCityData from '@/app/data/prefCity.json';
import Button from '@/app/components/ui/Button';
import { PrefCityProps } from '@/types/prefCity'

export default function DialogPrefCitySelect({ setPref, setCity }: PrefCityProps) {
  let [isOpen, setIsOpen] = useState(false)
  const [selectedPref, setSelectedPref] = useState<string | null>(null);

  //-----------------------------------------------
  // eventHandler - 市区選択
  //-----------------------------------------------
  const handleSelectCity = (city: string, selectedPref: string) => {
    setPref(selectedPref);
    setCity(city);
    setIsOpen(false)
    setTimeout(() => setSelectedPref(null), 200); //アニメーションが終わってからリセット
  }
  // ----------------------------------------
  // JSX 
  // ----------------------------------------
  return (
    <>
      {/* 開くボタン */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className='px-4 py-2'
      >
        エリア選択
      </Button>
      {/* ダイアログ */}
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelectedPref(null)
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="shadow-[0_8px_30px_rgba(0,0,0,0.25)] max-w-4xl w-full 
          space-y-6 bg-white p-12 rounded-3xl text-center max-h-[80vh] overflow-y-auto
           duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
            <DialogTitle className="font-bold text-lg">
              {selectedPref ? `${selectedPref} の市区を選択` : '都道府県を選択'}
            </DialogTitle>
            {/* 都道府県リスト */}
            {!selectedPref && (
              <div className="flex flex-wrap gap-3 max-w-2xl mx-auto ">
                {prefCityData.map((p: any) => (
                  <Button
                    key={p.pref}
                    onClick={() => setSelectedPref(p.pref)}
                    variant="primary"
                    className='w-24 h-10 font-semibold'
                  >
                    {p.pref}
                  </Button>
                ))}
              </div>

            )}
            {/* 市区リスト */}
            {selectedPref && (
              <div className="flex flex-wrap justify-start gap-3">
                {prefCityData
                  .find((p: any) => p.pref === selectedPref)
                  ?.cities.map((city: string) => (
                    <Button
                      key={city}
                      onClick={() => { handleSelectCity(city, selectedPref) }}
                      variant="primary"
                      className='w-26 h-10 whitespace-nowrap text-sm font-semibold'
                    >
                      {city}
                    </Button>
                  ))}
              </div>
            )}
            {/* 下部ボタン */}
            <div className="flex justify-center mt-4">
              {selectedPref ? (
                <Button
                  onClick={() => setSelectedPref(null)}
                  variant="secondary"
                  className='px-4 py-2'
                >
                  戻る
                </Button>
              ) : (
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                  className='px-4 py-2'
                >
                  キャンセル
                </Button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}