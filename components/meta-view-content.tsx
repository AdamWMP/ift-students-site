'use client'

import { useEffect } from 'react'
import { track } from '@/lib/meta/events'

type Props = {
  contentId: string
  contentName: string
  contentCategory?: string
  value?: number
  currency?: string
}

export default function MetaViewContent({ contentId, contentName, contentCategory = 'course', value, currency = 'EUR' }: Props) {
  useEffect(() => {
    track('ViewContent', {
      customData: {
        content_ids: [contentId],
        content_name: contentName,
        content_category: contentCategory,
        content_type: 'product',
        ...(value !== undefined ? { value, currency } : {}),
      },
    })
  }, [contentId, contentName, contentCategory, value, currency])

  return null
}
