import PageTemplate, { generateMetadata } from './[slug]/page'

// Without this, Next.js 16 statically freezes '/' at build time (when the
// build-time in-memory DB is empty) instead of picking up the draftMode()
// call inside PageTemplate that would normally force dynamic rendering —
// re-exporting a page component from another file doesn't inherit its
// runtime dynamic-API detection the way rendering it directly would.
export const dynamic = 'force-dynamic'

export default PageTemplate

export { generateMetadata }
