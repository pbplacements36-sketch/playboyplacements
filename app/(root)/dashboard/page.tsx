import Bottomnav from '@/components/sections/Bottomnav'
import DashboardHeader from '@/components/sections/DashboardHeader'
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import React from 'react'

const Dashboard = async () => {
  const session = await auth.api.getSession({
        headers: await headers(),
      });
    const session_email = session?.user?.email;
  
    // Fetch user from DB
    const user = await prisma.user.findUnique({ where: { email: session_email } });

  return (
    <div className='dashboard-page'>
        <DashboardHeader user={user} />
        <Bottomnav current="dashboard" />
    </div>
  )
}

export default Dashboard