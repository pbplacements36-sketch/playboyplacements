import React from 'react'
import Image from 'next/image'

const data = [
    {
        name: "Earnings",
        value: "0",
        icon: '/assets/dashboard/earnings.png'
    },
    {
        name: "Active Bookings",
        value: "0",
        icon: '/assets/dashboard/bookings.png'
    },
    {
        name: "Clients",
        value: "0",
        icon: '/assets/dashboard/clients.png'
    },

]

const DashboardStats = () => {
  return (
    <div className="dashboard-stats">
        {data.map((item, index) => (
            <div className="stat-card" key={index}>
                <div className="icon-container">
                    <Image src={item.icon} alt="Icon" width={40} height={40} />
                </div>
                <div className="text-container">
                    <h3>{item.name}</h3>
                    <p>{item.name === "Earnings" ? "$" : ""}{item.value}</p>
                </div>
                
            </div>
        ))}
    </div>
  )
}

export default DashboardStats