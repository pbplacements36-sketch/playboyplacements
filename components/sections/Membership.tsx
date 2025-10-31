import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// The component now accepts a 'user' prop to check membership status
const Membership = ({ user }: { user: any }) => {
  // Check if the user's membershipType is explicitly 'inactive'
  const isInactiveMembership = user?.membershipType === "inactive";

  return (
    <div className='membership-section'>
        <div className="text-container">
            <Image src="/assets/dashboard/star.png" alt="Star Icon" width={40} height={40} unoptimized />
            <h3>
                {isInactiveMembership
                    ? "Activate your membership to unlock full access"
                    : "Upgrade your membership to unlock more benefits"}
            </h3>
        </div>
        {/* Use Next.js's Link component to navigate to the profile page and scroll to the specified ID */}
        <Link href="/profile#membership-container">
            <button>
                {isInactiveMembership ? "View Plans" : "Upgrade Plan"}
            </button>
        </Link>
    </div>
  )
}

export default Membership