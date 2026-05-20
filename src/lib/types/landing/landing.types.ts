// landing/types.ts

export type LandingSection =
  | {
      type: "heroBannerGrid"
      items: {
        image: string
        link?: string
      }[]
    }
  | {
      type: "productSlider"
      title: string
      query: {
        category: string
        type?: "amazing" | "suggested"
      }
    }
  | {
      type: "banner"
      image: string
      link?: string
    }
  | {
      type: "description"
      title: string
      text: string
    }

export type LandingConfig = {
  slug: string
  sections: LandingSection[]
}


export type DescriptionSectionType = Extract<
  LandingSection,
  { type: "description" }
>

