import Link from 'next/link'
import React from 'react'

type BottomnavProps = {
  current: "dashboard" | "bookings" | "clients" | "profile" | "support",
  theme?: "light" | "dark"
}


const navItems = [
  { name: "dashboard", href: "/dashboard", icon: "home" },
  { name: "bookings", href: "/bookings", icon: "bookings" },
  { name: "clients", href: "/clients", icon: "clients" },
  { name: "profile", href: "/profile", icon: "profile" },
  { name: "support", href: "/support", icon: "support" },
];

const Bottomnav: React.FC<BottomnavProps> = ({ current, theme }) => {
  return (
    <div className={`bottom-nav ${theme}`}>
      {navItems.map((item) => (
        <div className="nav-item" key={item.name}>
          <Link href={item.href}>
            <img
              src={`/assets/dashboard/${item.icon}-${item.name === current ? "dark" : "light"}.png`}
              alt={item.name}
            />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Bottomnav