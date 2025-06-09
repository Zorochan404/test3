"use client"

import DynamicTable from '@/components/dynamic-table'
// import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getCompanies } from '@/constants/apis'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Company = {
  _id: string;
  name: string;
  src?: string;
}

export default function Page() {
  // const params = useParams()
  const [companies, setCompanies] = useState<Company[]>([])
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies()

          setCompanies(data)
      
      } catch (error) {
        console.error('Error fetching companies:', error)
        // setError('Failed to fetch companies')
      }
    }
    fetchCompanies()
  }, [])

  const mappedCompanies = companies.map((company) => ({
    id: company._id,
    name: company.name,
    image: { 
      type: company.src ? 'image' as const : 'text' as const, 
      value: company.src || 'No image available' 
    }
  }))

  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteCompanyById(id);
  //     // Refresh the companies list after deletion
  //     const data = await getCompanies();
  //     setCompanies(data);
  //   } catch (error) {
  //     console.error('Error deleting company:', error);
  //     setError('Failed to delete company');
  //   }
  // };

  // if (error) {
  //   return <div className="p-4 text-red-500">{error}</div>
  // }

  return (
    <div>
      <div className='flex justify-between items-center mx-6'>
        <div className='text-2xl font-bold capitalize'>
          INDUSTRY AND PLACEMENT PARTNER
        </div>
        <Link href={'/dashboard/webdata/industry-and-placement-partner/add'}><Button>Add Industry and placement partner</Button></Link>
      </div>
      <DynamicTable 
        data={mappedCompanies}
        headers={[
            { key: 'name', label: 'Company Name' },
            { key: 'image', label: 'Logo' },
            { key: 'actions', label: '', className: 'w-[50px]' }
          ]}
        url="/dashboard/webdata/industry-and-placement-partner/edit"
        />
    </div>
  )
}
