import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardHeader = ({user} : {user: any}) => {
  return (
    <div className='dashboard-header'>
        <Link className='logo' href="/dashboard">
            <Image src="/assets/logo-dark.svg" alt="Logo" width={120} height={40} />
        </Link>
        <Link href="/profile" className='profile-pic'>
            <Image
              src={user?.image && user.image.length > 0 ? user.image : "/assets/dashboard/profile-pic.png"}
              alt="Profile"
              className='profile-pic'
              width={40}
              height={40}
            />
        </Link>
    </div>
  )
}

export default DashboardHeader