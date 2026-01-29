/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayField, FieldHook, TypeWithID, ValidateOptions } from 'payload'

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

export const validateSingleImage = async (
  fileId: string,
  config: ImageValidationConfig,
  req?: any, // Add optional req parameter
): Promise<{ valid: boolean; error?: string }> => {
  console.log('🚀 ~ validateSingleImage ~ fileId:', fileId)
  //🚀 ~ validateSingleImage ~ fileId: { id: '697b5c5f16f6a5eb508df43a', image: '697b5d5a6a2fd260c5d83329' }
  // Handle case where fileId is an object with an image property
  if (typeof fileId === 'object' && fileId !== null && 'image' in fileId) {
    fileId = (fileId as any).image
  }
  try {
    let media

    if (req?.payload) {
      media = await req.payload.findByID({
        collection: 'media',
        id: fileId,
      })
    } else {
      const response = await fetch(`/api/media/${fileId}`)
      media = await response.json()
    }

    console.log('🚀 ~ validateSingleImage ~ media:', media)

    if (!media?.url) return { valid: true }

    const { width, height } = media
    console.log('🚀 ~ validateSingleImage ~ height:', height)
    console.log('🚀 ~ validateSingleImage ~ width:', width)

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
      console.log('🚀 ~ validateSingleImage ~ actualRatio:', actualRatio)
      console.log('🚀 ~ validateSingleImage ~ actualRatio:', actualRatio)
      const tolerance = config.aspectRatioTolerance || 0.01
      console.log('🚀 ~ validateSingleImage ~ tolerance:', tolerance)
      const expectedRatio = config.aspectRatio
      console.log('🚀 ~ validateSingleImage ~ expectedRatio:', expectedRatio)

      if (Math.abs(actualRatio - expectedRatio) > tolerance) {
        return {
          valid: false,
          error: `Image aspect ratio must be ${expectedRatio.toFixed(2)} (current: ${actualRatio.toFixed(2)})`,
        }
      }
    }

    return { valid: true }
  } catch (error) {
    console.log('🚀 ~ validateSingleImage ~ error:', error)
    const errorMessage = error?.toString() || String(error)
    if (errorMessage.includes('NotFound')) {
      return { valid: true }
    }
    return { valid: false, error: 'Failed to validate image' }
  }
}

export const validateImagesOnPublish = (validationConfig: ImageValidationConfig) => {
  // 1. Change 'val' to 'unknown' to match Payload's signature
  return async (val: unknown, options: ValidateOptions<unknown, unknown, ArrayField, unknown>) => {
    // 2. Cast 'val' to your expected type for internal logic
    const value = val as string | string[] | null | undefined

    console.log('🚀 ~ validateOnPublish ~ val:', value)

    // 3. Update references to use 'value' instead of 'val'
    if (options.operation === 'delete') return true

    if (!value) {
      return 'Image is required'
    }

    try {
      // Ensure validateSingleImage accepts the types you expect

      if (Array.isArray(value)) {
        for (const item of value) {
          const result = await validateSingleImage(item, validationConfig, options.req)
          console.log('🚀 ~ validateOnPublish ~ result:', result)

          if (!result.valid) {
            return 'Image validation failed'
          }
          return true
        }
      } else {
        const result = await validateSingleImage(value, validationConfig, options.req)
        console.log('🚀 ~ validateOnPublish ~ result:', result)

        if (!result.valid) {
          return 'Image validation failed'
        }
      }

      return true
    } catch (error) {
      console.error('Validation error:', error)
      return 'Failed to validate image dimensions'
    }
  }
}

export const validateImageSize = async (images: string | string[], req: any, config: any) => {
  console.log('🚀 ~ validateImageSize ~ images:', images)

  if (Array.isArray(images)) {
    for (const item of images) {
      if (item) {
        await validateSingleImage(item, config)
      }
    }
    return images
  }
}

export const validateImageSizeHook = <T extends TypeWithID>(
  config: ImageValidationConfig,
  getImages: (args: Parameters<FieldHook<T>>[0]) => string[],
): FieldHook<T> => {
  return async (args) => {
    console.log('🎯 validateImageSizeHook called')
    const images = getImages(args)
    console.log('🎯 Images to validate:', images)

    await validateImageSize(images, args.req, config)
    console.log('✅ Validation passed')
  }
}
