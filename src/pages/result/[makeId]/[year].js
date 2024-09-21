import { Suspense } from 'react';
export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`,
  )
  const makes = await res.json()

  const paths = makes.Results.map((make) => ({
    params: { makeId: make.MakeId.toString(), year: '2020' },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { makeId, year } = params
  console.log(params)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`,
  )
  const data = await res.json()

   if (!data.Results) {
    return { props: { models: [], makeId, year } };
  }

  return { props: { models: data.Results, makeId, year } }
}

export default function ResultPage({ models, makeId, year }) {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Vehicle Models for {makeId} ({year})
        </h1>

        {models.length > 0 ? (
          <ul>
            {models.map((model) => (
              <li key={model.Model_ID} className="p-4 bg-white mb-4 shadow-lg rounded-lg transition-transform transform scale-95 hover:scale-100">
                {model.Model_Name}
              </li>
            ))}
          </ul>
        ) : (
          <div> No models found :( </div>
        )}
      </div>
    </Suspense>
  )
}
