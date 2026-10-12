'use server'; // Server Actions are always invoked via POST requests behind the scenes.

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, {ssl:'require'}); // Initialize client connection to Postgres SQL

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({

      invalid_type_error: 'Please Select a Customer',

    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter any number greater than $0', }),
    status: z.enum(['pending','paid'], {

      invalid_type_error: 'Please select an invoice status',

    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});
const UpdateInvoice = FormSchema.omit({ id: true, date: true }); // Use Zod to update the expected types


export type State = {
  errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData){
    // const { customerId, amount, status } = CreateInvoice.parse({ // Extract data from formData (.get), pass it to Zod (CreateInvoice) to validate, and Destruct them into variables customerId = ..., amount = ..., status = ...
    // const rawFormData = { // this thing is known as Object, Object with multiple key value pairs
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'), 
    });

    if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];    
      
    try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error){
      // output the error to console
      console.error(error);
      return { // We need this return so that the caller knows what is going on, instead of just receiving undefined
        message: "Database Error Occur: Failed to create invoice",
      };
    }
    
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

    // console.log(rawFormData);
}
 
export async function updateInvoice(id: string, prevState:State ,formData: FormData) {

    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'), 
    });

    if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
      };
    }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  
  try{
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error){
    console.error(error);
    return {
        message: "Database Error Occur: Failed to Update invoice",      
    };

  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}


