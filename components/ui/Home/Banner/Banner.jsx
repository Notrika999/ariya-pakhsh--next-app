import React from "react";

export default function Banner() {
  return (
    <section className="py-5">
      <h2 className="sr-only">بنر های تبلیغاتی</h2>
      <div className="container">
        {/* <!-- section one --> */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <a href="">
            <img
              src="images/advert/bnr1.png"
              className="rounded-xl transition hover:-translate-y-2"
              alt=""
            />
          </a>
          <a href="">
            <img
              src="images/advert/bnr2.png"
              className="rounded-xl transition hover:-translate-y-2"
              alt=""
            />
          </a>
          <a href="">
            <img
              src="images/advert/bnr3.png"
              className="rounded-xl transition hover:-translate-y-2"
              alt=""
            />
          </a>
        </div>
      </div>
    </section>
  );
}
