import React from 'react'
import Image from 'next/image'
import Glow from './Glow'

const DashboardUserDetails = ({ user } : { user: any }) => {
  return (
    <div className='dashboard-user-details'>
      <Glow />
      <div className="photo-border-wrapper">
          <div className="photo-container" style={{ position: "relative", cursor: "pointer" }}>
            <Image
              src={user?.image || "/assets/dashboard/profile-pic.png"}
              alt="profile-photo"
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
        </div>
        <div className="name-container">
          <h3>
            Hi, <span>{user?.name || ""}👋</span>
          </h3>
          <div className={`status-container ${user?.membershipType !== 'inactive' ? 'active' : 'not-active'}`}>
            <Image
              src={
                user?.membershipType === 'inactive'
                  ? '/assets/profile/close.png'
                  : '/assets/profile/activated.png'
              }
              alt="verified-badge"
              width={16}
              height={16}
            />
            <p>
              {!user?.membershipType || user.membershipType === 'inactive'
                ? 'Not Activated'
                : user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)}
            </p>
          </div>
        </div>
    </div>
  )
}

export default DashboardUserDetails