// "use client";

// import Description from "@/components/ui/ProductPageClient/Description/Description";
// import Gallery from "./Gallery/Gallery";
// import Action from "./Action/Action";
// import Seller from "./Seller/Seller";
// import Review from "./Review/Review";
// import { useProductDetails } from "@/src/lib/hooks/useProductDetails";
// import ConsumerProducts from "./ConsumerProducts/ConsumerProducts";
// import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
// import { ProductDetail } from "@/src/lib/types/products/productDetail.types";

// interface Props {
//   product: ProductDetail;
// }

// export default function ProductPageClient({ product }: Props) {
//   console.log("Product Detilas Componnet Page => ", product);
//   // const { product, loading, error } = useProductDetails(id);

//   // if (loading) return <p>در حال دریافت اطلاعات...</p>;

//   // if (error) return <p>{error}</p>;

//   // if (!product) return null;

//   // const isOutOfStock = product.count === 0;

//   return (
//     <>
//       {/* <!-- START CONTENT --> */}
//       <SectionContainer>
//         {/* <!-- Breadcrumb --> */}
//         {/* <Breadcrumb
//             title={"دسته بندی"}
//             active={product.title}
//             href={"/category"}
//           /> */}

//         {/* <!-- Main --> */}
//         <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
//           <div className="grid grid-cols-12 gap-4 place-items-start">
//             {/* <!-- Gallery --> */}
//             {/* <Gallery images={product.imageSlider} isOutOfStock={isOutOfStock} />

//              <!-- Description -->
//             <Description product={product} isOutOfStock={isOutOfStock} />

//             <!-- Action -->
//             <Action product={product} isOutOfStock={isOutOfStock} /> */}
//           </div>
//         </div>
//       </SectionContainer>
//       {/* <!-- END CONTENT --> */}

//       {/* <!-- START Consumer Products --> */}
//       <ConsumerProducts />
//       {/* <!-- END Consumer Products --> */}

//       {/* <!-- START SELLER CONTENT --> */}
//       {/* <SectionContainer>

//           <Seller />

//       </SectionContainer> */}
//       {/* <!-- END SELLER CONTENT --> */}

//       {/* <!-- START PRODUCT REVIEW --> */}
//       <SectionContainer>
//         <Review />
//       </SectionContainer>
//       {/* <!-- END PRODUCT REVIEW --> */}
//     </>
//   );
// }

"use client";

import Gallery from "./Gallery/Gallery";
import Description from "./Description/Description";
import Action from "./Action/Action";
import ConsumerProducts from "./ConsumerProducts/ConsumerProducts";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";
import Review from "./Review/Review";
import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";

interface Props {
  product: ProductDetail;
}

export default function ProductPageClient({ product }: Props) {
  const primaryCategory =
    product.categories?.find((c) => c.isPrimary) ?? product.categories?.[0];

  const productDetailsBreadcrumb = [
    {
      id: "0",
      name: "خانه",
      slug: "",
      link: `/`,

      depth: -1,
      position: 0,
      isActive: true,
    },
    {
      id: "1",
      name: primaryCategory.name,
      slug: primaryCategory.slug,
      link: `/categories/${primaryCategory.slug}`,
      depth: 0,
      position: 1,
      isActive: false,
    },
    {
      id: "2",
      name: product.name,
      slug: "روکش-صندلی-خودرو",
      depth: 0,
      position: 1,
      isActive: false,
    },
  ];

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
  const isOutOfStock = !defaultVariant?.inStock;

  // map variant images to Gallery format
  const images =
    defaultVariant?.images?.map((img) => ({
      imgSrc: `https://aryapakhsh.shop${img.largePath}`,
      thumbSrc: `https://aryapakhsh.shop${img.thumbnailPath}`,
    })) ?? [];

  return (
    <>
      <SectionContainer>
        <Breadcrumb items={productDetailsBreadcrumb} />
        <div className="bg-white dark:bg-custom-dark dark:text-gray-200 space-y-3 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 rounded-2xl px-6 py-4">
          <div className="grid grid-cols-12 gap-4 place-items-start">
            <Gallery images={images} isOutOfStock={isOutOfStock} />
            <Description product={product} isOutOfStock={isOutOfStock} />
            <Action
              product={product}
              variant={defaultVariant}
              isOutOfStock={isOutOfStock}
            />
          </div>
        </div>
      </SectionContainer>

      <ConsumerProducts />

      <SectionContainer>
        <Review />
      </SectionContainer>
    </>
  );
}
