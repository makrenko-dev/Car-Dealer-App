import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa';
import 'animate.css';

export default function Home() {
  const [vmakes, setVMakes] = useState([])
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [isNextEnabled, setIsNextEnabled] = useState(false)

  useEffect(() => {
    const fetchMakes = async () => {
      try{

         if (!process.env.NEXT_PUBLIC_API_URL) {
            throw new Error("NEXT_PUBLIC_API_URL is not defined");
          }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`);

        const data =await res.json();
        setVMakes(data.Results);
      } catch (error){
        console.error("Error fetching makes:", error);
      }
    };
    fetchMakes();
  }, [])

  useEffect(() => {
    if (selectedMake && selectedYear) {
      setIsNextEnabled(true)
    } else {
      setIsNextEnabled(false)
    }
  }, [selectedMake, selectedYear])

  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = 2015; year <= currentYear; year++) {
    years.push(year)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="flex flex-col items-center">
       <h1 className="text-4xl font-bold mb-8 text-center animate__animated animate__backInLeft">
        Select Vehicle Make and Model Year
      </h1>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="make" className="block text-gray-700">
            Vehicle Make:
          </label>
          <select
            id="make"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value=""> Select Make </option>
            {vmakes.map((make) => (
              <option key={make.MakeId} value={make.MakeId}>
                {make.MakeName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700">
            Model Year:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value=""> Select Year </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Link href={selectedMake && selectedYear && isNextEnabled ? `/result/${selectedMake}/${selectedYear}` : '#'}>
          <button
            className={`w-full p-2 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-blue-600 transition duration-200 ${!isNextEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isNextEnabled}
          >
            Next
             <FaArrowRight className="mr-2 ml-2" />
          </button>
        </Link>
      </div>
      </div>
    </div>
  )
}
