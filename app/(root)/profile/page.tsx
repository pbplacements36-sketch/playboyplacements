import Bottomnav from '@/components/sections/Bottomnav'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import React from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import ProfileForm from '@/components/ProfileForm'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import MembershipForm from '@/components/MembershipForm'

const Profile = async () => {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  const session_email = session?.user?.email;

  // Fetch user from DB
  const user = await prisma.user.findUnique({ where: { email: session_email } });

  return (
    <div className='dashboard-page profile'>
        <ProfilePhotoUpload user={user} />
        <div className="name-container">
          <h3>
            Welcome Back,<br />
            <span>{user?.name || ""}👋</span>
          </h3>
          <div className={`status-container ${user?.membershipType !== 'inactive' ? 'active' : 'not-active'}`}>
            <Image
              src={
                user?.membershipType === 'basic'
                  ? '/assets/profile/activated.png'
                  : user?.membershipType === 'standard'
                  ? '/assets/profile/activated.png'
                  : user?.membershipType === 'premium'
                  ? '/assets/profile/activated.png'
                  : '/assets/profile/close.png'
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
        <ProfileForm user={user} />
        <MembershipForm user={user} />
        <Bottomnav current="profile" theme="dark" />
    </div>
  )
}

export default Profile