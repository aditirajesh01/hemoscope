import { useState, useEffect } from 'react'
import axios from 'axios'

export function useVariant(variantId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!variantId) return
    setLoading(true)
    setError(null)
    setData(null)

    axios.get(`/api/variant/${variantId}`)
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 404)
          setError(`Variant "${variantId}" not found in database`)
        else
          setError('Failed to load variant — please check your connection')
      })
      .finally(() => setLoading(false))
  }, [variantId])

  return { data, loading, error }
}
