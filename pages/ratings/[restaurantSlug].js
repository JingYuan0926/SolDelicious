import { useRouter } from 'next/router'
import Head from 'next/head'

export default function RestaurantRatings() {
  const router = useRouter()
  const { restaurantSlug } = router.query

  const restaurantName = restaurantSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>{`${restaurantName || 'Restaurant'} - Ratings`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-12 text-center">
          {restaurantName} Ratings
        </h1>

        <p className="text-white text-center text-xl">
          Ratings for {restaurantName} will be displayed here.
        </p>
      </main>
    </div>
  )
}