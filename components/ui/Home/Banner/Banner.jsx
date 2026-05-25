import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <>
      <h2 className="sr-only">بنر های تبلیغاتی</h2>

      {/* <!-- section one --> */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 items-center justify-center">
        <Link href="">
          <Image
            width={415}
            height={175}
            src="/images/advert/bnr1.png"
            className="rounded-xl transition hover:-translate-y-2 mx-auto"
            alt=""
          />
        </Link>
        <Link href="">
          <Image
            width={415}
            height={175}
            src="/images/advert/bnr2.png"
            className="rounded-xl transition hover:-translate-y-2 mx-auto"
            alt=""
          />
        </Link>
        <Link href="">
          <Image
            width={415}
            height={175}
            src="/images/advert/bnr3.png"
            className="rounded-xl transition hover:-translate-y-2 mx-auto"
            alt=""
          />
        </Link>
      </div>
    </>
  );
}
