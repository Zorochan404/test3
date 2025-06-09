"use client"
 

import { useState, useEffect } from "react"

// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useRouter } from "next/navigation"

// Define the type for table headers
type TableHeaderConfig = {
  key: string;
  label: string;
  className?: string;
}

// Define the type for table data
type CellContent = {
  type: 'text' | 'image';
  value: string;
}

type TableData = {
  [key: string]: string | number | CellContent;
}

interface DynamicTableProps {
  headers: TableHeaderConfig[];
  data: TableData[];
  url?: string;

}

export default function DynamicTable({ headers, data, url }: DynamicTableProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredData, setFilteredData] = useState(data)

    // const formSchema = z.object({
    //     search: z.string(),
    // })
    
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //       search: "",
    //     },
    //   })
    
      useEffect(() => {
    const filtered = data.filter(row => 
      Object.entries(row).some(([ value]) => {
        if (isCellContent(value)) {
          return value.type === 'text' && value.value.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
    setFilteredData(filtered)
  }, [data, searchQuery])

  return (
    <div className="p-6">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
      
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header.key} className={header.className}>
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((row, index) => (
          <TableRow 
            key={index}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`${url}/${String(row.id)}`)}
          >
            {headers.map((header) => (
              <TableCell 
                key={`${index}-${header.key}`}
                className={header.className}
              >
                {isCellContent(row[header.key]) ? (
                  (() => {
                    const content = row[header.key] as CellContent;
                    return content.type === 'image' ? (
                      <img 
                        src={content.value} 
                        alt={header.label} 
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <span>{content.type === 'text' ? limitWords(content.value) : content.value}</span>
                    );
                  })()
                ) : row[header.key] !== undefined && row[header.key] !== null ? (
                  <span>{limitWords(String(row[header.key]))}</span>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}

// Type guard for CellContent
function isCellContent(value: unknown): value is CellContent {
  return typeof value === 'object' && value !== null && 'type' in value && 'value' in value;
}

function limitWords(text: string, limit: number = 20): string {
  const words = text.split(/\s+/);
  return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
}
