import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import React from 'react'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async () => {
  return <div>{/* <CollectionArchive posts={posts} /> */}</div>
}
