import Bottomnav from '@/components/sections/Bottomnav'
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import React from 'react'
import Image from 'next/image';
import DashboardUserDetails from '@/components/DashboardUserDetails';
import DashboardStats from '@/components/DashboardStats';
import ClientCard from '@/components/ClientCard';
import DashboardClients from '@/components/sections/DashboardClients';
import Membership from '@/components/sections/Membership';
import LocationRequiredWrapper from '@/components/LocationRequiredWrapper';
import { LocationProvider } from '@/hooks/useLocation';

const Dashboard = async () => {
  
  const session = await auth.api.getSession({
        headers: await headers(),
      });
    const session_email = session?.user?.email;
  
    // Fetch user from DB
    const user = await prisma.user.findUnique({ where: { email: session_email } });

  return (
    <LocationProvider>
    <LocationRequiredWrapper>
      <div className='dashboard-page dashboard'> 
          <DashboardUserDetails user={user} />
          <DashboardStats />
          <DashboardClients />
          <Membership user={user} />
          <Bottomnav current="dashboard" theme="dark" />
      </div>
    </LocationRequiredWrapper>
    </LocationProvider>
  )
}

export default Dashboard