"use client";

import Description from "@/components/ui/ProductPageClient/Description/Description";
import Gallery from "./Gallery/Gallery";
import Action from "./Action/Action";
import Seller from "./Seller/Seller";
import Review from "./Review/Review";
import { useProductDetails } from "@/src/lib/hooks/useProductDetails";
import ConsumerProducts from "./ConsumerProducts/ConsumerProducts";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

interface Props {
  id: string;
}

export default function ProductPageClient({ id }: Props) {
  const { product, loading, error } = useProductDetails(id);

  if (loading) return <p>در حال دریافت اطلاعات...</p>;

  if (error) return <p>{error}</p>;

  if (!product) return null;

  const isOutOfStock = product.count === 0;

  return (
    <>
      {/* <!-- START CONTENT --> */}
      <SectionContainer>
        {/* <!-- Breadcrumb --> */}
        {/* <Breadcrumb
            title={"دسته بندی"}
            active={product.title}
            href={"/category"}
          /> */}

        {/* <!-- Main --> */}
        <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
          <div className="grid grid-cols-12 gap-4 place-items-start">
            {/* <!-- Gallery --> */}
            <Gallery images={product.imageSlider} isOutOfStock={isOutOfStock} />

            {/* <!-- Description --> */}
            <Description product={product} isOutOfStock={isOutOfStock} />

            {/* <!-- Action --> */}
            <Action product={product} isOutOfStock={isOutOfStock} />
          </div>
        </div>
      </SectionContainer>
      {/* <!-- END CONTENT --> */}

      {/* <!-- START Consumer Products --> */}
      <ConsumerProducts />
      {/* <!-- END Consumer Products --> */}

      {/* <!-- START SELLER CONTENT --> */}
      {/* <SectionContainer>
      
          <Seller />
        
      </SectionContainer> */}
      {/* <!-- END SELLER CONTENT --> */}

      {/* <!-- START PRODUCT REVIEW --> */}
      <SectionContainer>
        <Review />
      </SectionContainer>
      {/* <!-- END PRODUCT REVIEW --> */}
    </>
  );
}
