import { NextPage } from "next";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => 
  import("@/app/components/admins/AdminApp"), {
    ssr: false,
  });

  const Admin: NextPage = () => <AdminApp />;

  export default Admin;