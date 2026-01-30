'use client'

import React, { useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'
import {
  ImageValidationConfig,
  validateSingleImage,
} from '@/collections/Hooks/ValidateImageSizeHook'

interface CustomFieldProps {
  field: {
    name: string
    type: string
    relationTo: string
    required?: boolean
    label?: string
    admin?: {
      isSortable?: boolean
      description?: string
      custom: {
        imageValidationConfig: ImageValidationConfig
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    } //eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  path: string
  permissions: boolean
  readOnly: boolean
  schemaPath: string
}

const ImageValidationAfterField: React.FC<CustomFieldProps> = (props) => {
  const { value } = useField({ path: props.path })
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'valid' | 'invalid' | 'valid-isVideo'
  >('idle')

  // Validate whenever the value changes
  useEffect(() => {
    const validateImages = async () => {
      if (!value) {
        setValidationError(null)
        setValidationStatus('idle')
        return
      }

      setValidating(true)
      setValidationError(null)

      try {
        // Handle single image or array of images
        const images = Array.isArray(value) ? value : [value]

        for (const item of images) {
          // Handle both string IDs and objects with image property
          const imageId = typeof item === 'string' ? item : item?.image

          if (imageId && props.field.admin?.custom.imageValidationConfig) {
            const result = await validateSingleImage(
              imageId,
              props.field.admin?.custom.imageValidationConfig,
            )

            if (result.valid && result.isVideo) {
              setValidationStatus('valid-isVideo')
              setValidationError(null)
              return
            }

            if (!result.valid) {
              setValidationError(result.error || 'Validation failed')
              setValidationStatus('invalid')
              setValidating(false)
              return
            }
          }
        }

        // All images passed validation
        setValidationStatus('valid')
        setValidationError(null)
      } catch (error) {
        console.error('Validation error:', error)
        setValidationError('Failed to validate images')
        setValidationStatus('invalid')
      } finally {
        setValidating(false)
      }
    }

    validateImages()
  }, [value, props.field.admin?.custom.imageValidationConfig])

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      {validating && <div style={{ color: '#666', marginBottom: '0.5rem' }}>⏳ Validating</div>}

      {validationStatus === 'valid-isVideo' && !validating && (
        <div style={{ color: '#4caf50', marginBottom: '0.5rem' }}>
          {/* Please make sure the video has the correct Dimensions */}
        </div>
      )}
      {validationStatus === 'valid' && !validating && (
        <div style={{ color: '#4caf50', marginBottom: '0.5rem' }}>
          ✓ Image meet all requirements
        </div>
      )}

      {validationStatus === 'invalid' && !validating && validationError && (
        <div
          style={{
            color: '#f44336',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          ✗ {validationError}
        </div>
      )}
    </div>
  )
}

export default ImageValidationAfterField
