import Image from "next/image";

export default function ShareModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">

      <div className="bg-white dark:bg-custom-dark rounded-lg shadow-lg w-full max-w-md border dark:border-gray-700">

        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl dark:text-white">
            اشتراک گذاری محصول
          </h3>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ✕
          </button>
        </div>

        <div className="p-4">
          <ul className="flex items-center justify-center gap-4">

            <li>
              <Image src="/images/social/rubika.png" alt="rubika" width={28} height={28}/>
            </li>

            <li>
              <Image src="/images/social/aparat.png" alt="aparat" width={28} height={28}/>
            </li>

            <li>
              <Image src="/images/social/bale.png" alt="bale" width={28} height={28}/>
            </li>

            <li>
              <Image src="/images/social/eitta.png" alt="eitta" width={28} height={28}/>
            </li>

            <li>
              <Image src="/images/social/igap.png" alt="igap" width={28} height={28}/>
            </li>

            <li>
              <Image src="/images/social/sorush.png" alt="sorush" width={28} height={28}/>
            </li>

          </ul>
        </div>

      </div>
    </div>
  );
}
