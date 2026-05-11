"use client";

import React from "react";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import Description from "@/components/ui/ProductDetails/Description/Description";
import Gallery from "./Gallery/Gallery";
import Action from "./Action/Action";
import Seller from "./Seller/Seller";
import Review from "./Review/Review";
import { useProductDetails } from "@/lib/hooks/useProductDetails";

interface Props {
  id: string;
}

export default function ProductDetails({ id }: Props) {
  console.log(id);
  const { product, loading, error } = useProductDetails(id);

  if (loading) return <p>در حال دریافت اطلاعات...</p>;

  if (error) return <p>{error}</p>;

  if (!product) return null;

  console.log(product);

  return (
    <>
      {/* <!-- START CONTENT --> */}
      <section className="py-5">
        <div className="container mx-auto">
          {/* <!-- Breadcrumb --> */}
          <Breadcrumb
            title={"دسته بندی"}
            active={product.title}
            href={"/category"}
          />

          {/* <!-- Main --> */}
          <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
            <div className="grid grid-cols-12 gap-4 place-items-start">
              {/* <!-- Gallery --> */}
              <Gallery images={product.imageSlider} />

              {/* <!-- Description --> */}
              <Description title={product.title} />

              {/* <!-- Action --> */}
              <Action />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- END CONTENT --> */}

      {/* <!-- START SELLER CONTENT --> */}
      <section className="py-5 hidden">
        <div className="container mx-auto">
          {/* <!-- Main --> */}
          <Seller />
        </div>
      </section>
      {/* <!-- END SELLER CONTENT --> */}

      {/* <!-- START PRODUCT REVIEW --> */}
      <section className="py-5 relative">
        <div className="container mx-auto">
          <Review />
        </div>
      </section>
      {/* <!-- END PRODUCT REVIEW --> */}
    </>
  );
}
