import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const salesData = [
  {
    name: "John Doe",
    avatar: "/user-avatar-1.png",
    fallback: "JD",
    items: "Jollof Rice + Egusi Soup",
    amount: "+£24.50",
  },
  {
    name: "Sarah Miller",
    avatar: "/user-avatar-2.png",
    fallback: "SM",
    items: "Pepper Soup + Plantain",
    amount: "+£18.75",
  },
  {
    name: "Michael Johnson",
    avatar: "/user-avatar-3.png",
    fallback: "MJ",
    items: "Curry Combo",
    amount: "+£32.00",
  },
  {
    name: "Lisa Wilson",
    avatar: "/user-avatar-4.png",
    fallback: "LW",
    items: "Okra Soup Special",
    amount: "+£21.25",
  },
  {
    name: "David Brown",
    avatar: "/user-avatar-5.png",
    fallback: "DB",
    items: "Mixed Grill Platter",
    amount: "+£45.00",
  },
]
export function RecentSales() {
  return (
    <table className="w-full">
      <tbody>
        {salesData.map((sale, index) => (
          <tr key={index} className="border-b border-gray-400">
            <td className="p-3 w-12">
              <Avatar className="h-9 w-9 text-white">
                <AvatarFallback className="bg-secondary">{sale.fallback}</AvatarFallback>
              </Avatar>
            </td>
            <td className="p-3">
              <p className="text-sm font-medium leading-none text-primary">
                {sale.name}
              </p>
            </td>
            <td className="p-3 text-sm text-gray-400">
              {sale.items}
            </td>
            <td className="p-3 text-right font-medium text-primary">
              {sale.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
