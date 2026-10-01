import SideNav from '@/app/ui/dashboard/sidenav'; // <SideNav /> component into my layout
                                                  // Any components I import into this file will be part of the layout.
 
export default function Layout({ children }: { children: React.ReactNode }) { // <Layout /> component receives a children prop
  return (                                                                    // child can either be a page or another layout
                                                                              // In our case, the pages inside /dashboard will 
                                                                              // automatically be nested inside a <Layout /> like so:
                                                                              // Meaning all the child route inside /dashboard will inherit /dashboard layout/style
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}