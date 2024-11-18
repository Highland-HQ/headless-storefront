import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {Button, ButtonVariant} from '~/components/ui/Button';
import {LogOut} from 'lucide-react';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="max-w-layout w-full mx-auto p-4">
      <h1 className="text-3xl font-bold text-secondary">{heading}</h1>
      <AccountMenu />
      <hr />
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({isActive}: {isActive: boolean}): ButtonVariant {
    return (isActive ? 'secondary' : 'ghost') as ButtonVariant;
  }

  return (
    <nav
      role="navigation"
      className="my-6 inline-block bg-primary-50 p-1 rounded"
    >
      <div className="flex gap-4">
        <NavLink to="/account/orders">
          {(isActive) => (
            <Button variant={isActiveStyle(isActive)}>Orders</Button>
          )}
        </NavLink>
        <NavLink to="/account/profile">
          {(isActive) => (
            <Button variant={isActiveStyle(isActive)}>Profile</Button>
          )}
        </NavLink>
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <Button variant="ghost" type="submit">
        <span>Sign out</span>
        <LogOut className="h-4 w-4 ml-2" />
      </Button>
    </Form>
  );
}
