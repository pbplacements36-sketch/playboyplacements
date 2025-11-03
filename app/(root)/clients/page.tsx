import Glow from '@/components/Glow';
import Bottomnav from '@/components/sections/Bottomnav'
import ClientsSection from '@/components/sections/ClientsSection';
import DashboardHeader from '@/components/sections/DashboardHeader'
import Membership from '@/components/sections/Membership';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import React from 'react'

const Clients = async () => {
  
  const session = await auth.api.getSession({
          headers: await headers(),
        });
      const session_email = session?.user?.email;
    
      // Fetch user from DB
      const user = await prisma.user.findUnique({ where: { email: session_email } });

  return (
    <div className='dashboard-page clients'>
        <Glow />
        <ClientsSection />
        <Membership user={user} />
        <Bottomnav current="clients" theme="dark" />
    </div>
  )
}

export default Clients