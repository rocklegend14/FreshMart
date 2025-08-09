import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">About FreshMart</h1>

      {/* Vision and Values Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700 mb-4">
              At FreshMart, we envision a world where everyone has access to fresh, nutritious food at affordable
              prices. We're committed to building a sustainable food system that supports local farmers and reduces
              environmental impact.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Our Values</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">
                  1
                </span>
                <div>
                  <span className="font-medium">Freshness:</span> We source products daily to ensure maximum freshness
                  and flavor.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">
                  2
                </span>
                <div>
                  <span className="font-medium">Affordability:</span> We work directly with producers to offer fair
                  prices.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">
                  3
                </span>
                <div>
                  <span className="font-medium">Sustainability:</span> We prioritize eco-friendly practices throughout
                  our operations.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">
                  4
                </span>
                <div>
                  <span className="font-medium">Customer Focus:</span> We're dedicated to providing exceptional service
                  and convenience.
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/about.jpeg" alt="Fresh produce" fill className="object-fit" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Gnaneshwaran K",
              role: "Developer",
              image: "/placeholder.svg?height=300&width=300",
              bio: "Believes every problem can be solved with enough tea and “temporary” fixes (that somehow stay forever).",
            },
            {
              name: "Samyuktha N",
              role: "Developer",
              image: "/placeholder.svg?height=300&width=300",
              bio: "The queen of “it looked fine on my laptop.” Handles styling like a pro and still manages to finish assignments on time.",
            },
            {
              name: "Jayashree S",
              role: "Developer",
              image: "/placeholder.svg?height=300&width=300",
              bio: "Knows exactly how the whole system works (probably). Also the one who remembers to actually read the documentation.",
            },
            {
              name: "Harini S",
              role: "Developer",
              image: "/placeholder.svg?height=300&width=300",
              bio: "Ensures the application runs efficiently and manages backend processes to maintain smooth operations.",
            },
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-green-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fun Facts */}
      <section className="bg-green-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">FreshMart by the Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "5,000+", label: "Happy Customers" },
            { number: "50+", label: "Local Suppliers" },
            { number: "3", label: "Store Locations" },
            { number: "500+", label: "Deliveries per Week" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-green-600">{stat.number}</p>
              <p className="text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
