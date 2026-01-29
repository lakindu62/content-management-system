import { ImageValidationConfig } from '.'

export const imageSizeOptions: Record<
  'hero' | 'card' | 'square' | 'portrait' | 'ogImage' | 'ultrawide',
  ImageValidationConfig
> = {
  /**
   * Hero / Main Banner
   * Standard 16:9 widescreen format.
   * Enforces High Def (720p+) minimums.
   */
  hero: {
    minWidth: 1280,
    minHeight: 720,
    aspectRatio: 16 / 9,
    aspectRatioTolerance: 0.05, // Stricter tolerance for layout shifts
  },

  /**
   * Standard Content Card / Blog Post
   * Classic 3:2 ratio (standard photography shape).
   * Good for grid layouts.
   */
  card: {
    minWidth: 800,
    minHeight: 533,
    aspectRatio: 3 / 2,
    aspectRatioTolerance: 0.1,
  },

  /**
   * Square / Avatar / Product Thumbnail
   * Strict 1:1 ratio.
   */
  square: {
    minWidth: 500,
    minHeight: 500,
    aspectRatio: 1,
    aspectRatioTolerance: 0.02, // Very strict to ensure perfect circles/squares
  },

  /**
   * Portrait / Vertical Card
   * 2:3 ratio (poster style).
   * Great for mobile-first designs or sidebar widgets.
   */
  portrait: {
    minWidth: 600,
    minHeight: 900,
    aspectRatio: 2 / 3,
    aspectRatioTolerance: 0.1,
  },

  /**
   * Social Sharing (Open Graph)
   * The specific 1.91:1 ratio required by Facebook/Twitter/LinkedIn
   * to avoid cropping.
   */
  ogImage: {
    minWidth: 1200,
    minHeight: 630,
    aspectRatio: 1.91,
    aspectRatioTolerance: 0.05,
  },

  /**
   * Ultrawide / Cinematic
   * 21:9 ratio. Good for immersive strips between content sections.
   */
  ultrawide: {
    minWidth: 1920,
    minHeight: 822,
    aspectRatio: 21 / 9,
    aspectRatioTolerance: 0.1,
  },
}
