"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Reply, DownloadIcon } from "lucide-react"

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  replied: boolean
}

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
         <div className="bg-secondary rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
          <h2 className="text-2xl font-bold font-ubuntu mb-2">REVIEWS & RATING</h2>
          <p className="text-white font-ubuntu text-sm">our guide to honest, data-driven reviews.</p>
          </div>
          <div>
            
            <Button variant="pdf" className="bg-transparent border border-white rounded-lg">
            <DownloadIcon/>
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      <Card className="border-primary/50 bg-white p-4">
        <CardHeader>
          <CardTitle className="text-foreground font-bold text-lg">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center mb-4">
            <div className="text-sm font-bold text-secondary">4.5</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= 4 ? "text-orange-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-foreground text-sm">(24 reviews)</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border border-gray-400 rounded-lg p-4 h-12">
                <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">ID</TableHead>
                <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Reviewer</TableHead>
                <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Rate</TableHead>
                <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Review</TableHead>
                <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Review At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="px-4 py-2 text-foreground text-[17px]">#0001</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">John Doe</TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 text-secondary ${star <= 5 ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-400">Excellent food and service!</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">5 min ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="px-4 py-2 text-foreground text-[17px]">#0002</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">Jane Smith</TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 text-secondary ${star <= 4 ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-400">Good experience overall.</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">10 min ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="px-4 py-2 text-foreground text-[17px]">#0003</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">Bob Johnson</TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 text-secondary ${star <= 3 ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-400">Average meal.</TableCell>
                <TableCell className="px-4 py-2 text-gray-400">15 min ago</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{review.customerName}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "text-orange-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  {review.replied && (
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <p className="text-sm text-orange-700">
                        Thank you for your feedback! We're glad you enjoyed your meal.
                      </p>
                    </div>
                  )}
                </div>
                {!review.replied && (
                  <Button size="sm" variant="outline">
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
