import Form from '@/app/ui/invoices/create-form'; // Form: The client-side form component (create-form.tsx)
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'; // Visual navigation bar component that shows the user's current location in the application hierarchy.
import { fetchCustomers } from '@/app/lib/data'; // erver-side data fetching helper function that queries the database to retrieve a list of all available customers.
 
export default async function Page() {
  const customers = await fetchCustomers(); // Before rendering any HTML, server executes fetchCustomers() to grab customer records directly from your database.
                                        // As this runs on the server, no sensitive API calls or database connections are exposed to the browser bundle.
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}