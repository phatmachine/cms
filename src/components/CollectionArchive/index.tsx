import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import { JurisdictionFlags } from '@/components/ExitGuide/JurisdictionValue'
import { getJurisdiction } from '@/utilities/jurisdictionFlags'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              // Rendered here, on the server, and passed down: Card is a
              // client component and mustn't pull the flag set into the bundle.
              // Posts with no recognisable country (blog posts, search-index
              // docs) simply get no flag.
              const jurisdiction = getJurisdiction(result)

              return (
                <div className="col-span-4" key={index}>
                  <Card
                    className="h-full"
                    doc={result}
                    flag={
                      jurisdiction ? (
                        <JurisdictionFlags className="h-3.5 w-[21px] shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(61,61,51,0.18)]" value={jurisdiction} />
                      ) : undefined
                    }
                    relationTo="posts"
                    showCategories
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
