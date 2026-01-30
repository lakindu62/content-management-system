/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayField, FieldHook, TypeWithID, UploadField, ValidateOptions } from 'payload'

export interface ImageValidationConfig {
  minWidth?: number
  width?: number
  height?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: number
  aspectRatioTolerance?: number
}

// Type definition for different media reference structures
type MediaReference =
  | string // Direct ID
  | { image: string } // Wrapped in image property
  | { images: string } // Wrapped in images property
  | { id: string; url: string; width?: number; height?: number; mimeType?: string } // Populated media

// Helper function to extract media ID from various structures
function extractMediaId(ref: MediaReference): string | null {
  if (typeof ref === 'string') return ref

  if (typeof ref === 'object' && ref !== null) {
    if ('images' in ref && typeof ref.images === 'string') return ref.images
    if ('image' in ref && typeof ref.image === 'string') return ref.image
    if ('id' in ref && typeof ref.id === 'string') return ref.id
  }

  return null
}

// Separate validation logic for cleaner code
function validateMediaDimensions(
  media: any,
  config: ImageValidationConfig,
): { valid: boolean; error?: string } {
  const { width, height } = media

  if (!width || !height) {
    return { valid: false, error: 'Could not determine image dimensions' }
  }

  if (config.width && width !== config.width) {
    return {
      valid: false,
      error: `Image width must be exactly ${config.width}px (current: ${width}px)`,
    }
  }

  if (config.height && height !== config.height) {
    return {
      valid: false,
      error: `Image height must be exactly ${config.height}px (current: ${height}px)`,
    }
  }

  if (config.minWidth && width < config.minWidth) {
    return {
      valid: false,
      error: `Image width must be at least ${config.minWidth}px (current: ${width}px)`,
    }
  }

  if (config.minHeight && height < config.minHeight) {
    return {
      valid: false,
      error: `Image height must be at least ${config.minHeight}px (current: ${height}px)`,
    }
  }

  if (config.maxWidth && width > config.maxWidth) {
    return {
      valid: false,
      error: `Image width must not exceed ${config.maxWidth}px (current: ${width}px)`,
    }
  }

  if (config.maxHeight && height > config.maxHeight) {
    return {
      valid: false,
      error: `Image height must not exceed ${config.maxHeight}px (current: ${height}px)`,
    }
  }

  if (config.aspectRatio) {
    const actualRatio = width / height
    const tolerance = config.aspectRatioTolerance || 0.01
    const expectedRatio = config.aspectRatio

    if (Math.abs(actualRatio - expectedRatio) > tolerance) {
      return {
        valid: false,
        error: `Image aspect ratio must be ${expectedRatio.toFixed(2)} (current: ${actualRatio.toFixed(2)})`,
      }
    }
  }

  return { valid: true }
}

export const validateSingleImage = async (
  fileId: MediaReference,
  config: ImageValidationConfig,
  req?: any,
): Promise<{ valid: boolean; error?: string; isVideo?: true }> => {
  console.log('🚀 ~ validateSingleImage ~ fileId:', fileId)

  // Check if media is already populated with full data
  if (typeof fileId === 'object' && fileId !== null && 'url' in fileId && 'id' in fileId) {
    console.log('✅ Media already populated, using directly')
    const media = fileId

    // Handle videos
    if (media.mimeType?.startsWith('video/')) {
      return { valid: true, isVideo: true }
    }

    // Validate dimensions
    if (!media.width || !media.height) {
      return { valid: false, error: 'Could not determine image dimensions' }
    }

    return validateMediaDimensions(media, config)
  }

  // Extract the actual media ID
  const actualFileId = extractMediaId(fileId)

  if (!actualFileId) {
    console.error('❌ Could not extract media ID from:', fileId)
    return { valid: false, error: 'Invalid media reference structure' }
  }

  console.log('✅ Extracted media ID:', actualFileId)

  try {
    let media

    if (req?.payload) {
      media = await req.payload.findByID({
        collection: 'media',
        id: actualFileId,
      })
    } else {
      const response = await fetch(`/api/media/${actualFileId}`)
      media = await response.json()
    }

    // Handle videos
    if (media.mimeType?.startsWith('video/')) {
      console.log('✅ Video detected, skipping dimension validation')
      return { valid: true, isVideo: true }
    }

    console.log('🚀 ~ validateSingleImage ~ media:', media)

    if (!media?.url) {
      console.log('⚠️ No media URL found, skipping validation')
      return { valid: true }
    }

    // Validate image dimensions
    return validateMediaDimensions(media, config)
  } catch (error) {
    console.log('🚀 ~ validateSingleImage ~ error:', error)
    const errorMessage = error?.toString() || String(error)

    // Allow if media not found (might be deleted)
    if (errorMessage.includes('NotFound')) {
      return { valid: true }
    }

    return { valid: false, error: 'Failed to validate image' }
  }
}

export const validateImagesOnPublish = (validationConfig: ImageValidationConfig) => {
  return async (
    val: unknown,
    options: ValidateOptions<unknown, unknown, ArrayField | UploadField, unknown>,
  ) => {
    const value = val as string | string[] | MediaReference[] | null | undefined

    console.log('🚀 ~ validateOnPublish ~ val:', value)

    // Skip validation on delete operations
    if (options.operation === 'delete') return true

    if (!value) {
      return 'Image is required'
    }

    try {
      if (Array.isArray(value)) {
        // Validate each item in the array
        for (const item of value) {
          if (!item) continue // Skip null/undefined items

          const result = await validateSingleImage(item, validationConfig, options.req)
          console.log('🚀 ~ validateOnPublish ~ result:', result)

          if (!result.valid) {
            return result.error || 'Image validation failed'
          }
        }
        return true
      } else {
        // Validate single image
        const result = await validateSingleImage(value, validationConfig, options.req)
        console.log('🚀 ~ validateOnPublish ~ result:', result)

        if (!result.valid) {
          return result.error || 'Image validation failed'
        }

        return true
      }
    } catch (error) {
      console.error('Validation error:', error)
      return 'Failed to validate image dimensions'
    }
  }
}

export const validateImageSize = async (
  images: string | string[] | MediaReference[],
  req: any,
  config: ImageValidationConfig,
) => {
  console.log('🚀 ~ validateImageSize ~ images:', images)

  if (Array.isArray(images)) {
    for (const item of images) {
      if (item) {
        const result = await validateSingleImage(item, config, req)
        if (!result.valid) {
          throw new Error(result.error || 'Image validation failed')
        }
      }
    }
    return images
  } else if (images) {
    const result = await validateSingleImage(images, config, req)
    if (!result.valid) {
      throw new Error(result.error || 'Image validation failed')
    }
  }

  return images
}

export const validateImageSizeHook = <T extends TypeWithID>(
  config: ImageValidationConfig,
  getImages: (args: Parameters<FieldHook<T>>[0]) => string[] | MediaReference[],
): FieldHook<T> => {
  return async (args) => {
    console.log('🎯 validateImageSizeHook called')
    const images = getImages(args)
    console.log('🎯 Images to validate:', images)

    await validateImageSize(images, args.req, config)
    console.log('✅ Validation passed')
  }
}
